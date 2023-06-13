import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Text, Button, Stack } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree, getAuthList, transferKoii } from "../api";

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(true);
  const toast = useToast();
  const { setPublicKey, apiUrl, nodeList } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();
  const [total, setTotal] = useState(null);

  const [isLogged, setIsLogged] = useState(false);
  const [localpk, setLocalpk] = useState("");


  useEffect(() => {
    allLinktrees()
      .then((number) => {
        setTotal(number);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiUrl]);

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);
          const isAuthListed = await getAuthList(pubKey, apiUrl);

          if (isAuthListed) {
            const linktree = await getLinktree(pubKey, nodeList);
            console.log(linktree);
            if (linktree.status === true && !linktree.data) {
              toast({
                title: "No Linktree profile for this public key",
                description: "You'll be redirected to create a profile",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
              setTimeout(() => {
                navigate("/createlinktree");
              }, 3000);
            } else if (linktree.data) {
              toast({
                title: "Linktree profile successfully fetched!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
              setLocalpk(pubKey);
              // setTimeout(() => {
              //   navigate(`linktree/${pubKey}`);
              // }, 2000);
              setIsLogged(true);
            } else {
              toast({
                title: "Error fetching Linktree data",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
              setTimeout(() => {
                navigate("/createlinktree");
              }, 3000);
            }
          } else {
            toast({
              title: "You are not authorized to create profile",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
            setIsAuth(false);
          }
        }
      } catch (err) {
        toast({
          title: "Error fetching Linktree data",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const handleTransferKoii = async () => {
    try {
      const isTransfer = await transferKoii(apiUrl);
      if (isTransfer) {
        toast({
          title: "Koii Transfer Successful",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/createlinktree");
        }, 3000);
      } else {
        throw new Error("An Error Occurred");
      }
    } catch {
      toast({
        title: "Error transferring koii",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <>
      <div className="container public-key-input-container">
        {isLogged ? (
          <>
            <Text
              marginBottom="10px"
              fontSize="25px"
              textAlign="center"
              maxWidth="600px"
            >
              Linktree Control Panel
            </Text>
            
            <Text
              marginBottom="10px"
              fontSize="12px"
              textAlign="center"
              maxWidth="600px"
            >
              User: {localpk}
            </Text>
            <Stack direction='column' spacing={4} align='center'>
            <Button onClick={() => navigate(`linktree/${localpk}`)} colorScheme='blue'>Show my Linktree</Button>
            <Button onClick={() => navigate(`createlinktree`)} colorScheme='blue'>Redesign Linktree</Button>
            </Stack>

          </>
        ) : (
          <div className="auth-user">
            {isAuth ? (
              <>
                <h1>Welcome to Koii</h1>
                <h1>Linktree</h1>
                <button
                  onClick={handleConnectFinnie}
                  className="connect-wallet-button"
                >
                  {connectButtonText}
                </button>
              </>
            ) : (
              <>
                <Text
                  marginBottom="10px"
                  fontSize="30px"
                  textAlign="center"
                  maxWidth="600px"
                >
                  You are not authorized to create and access Linktree profiles
                </Text>
                <Text
                  marginBottom="20px"
                  fontSize="18px"
                  textAlign="center"
                  maxWidth="600px"
                >
                  Transfer 10 Koii to
                  stakepotaccount2YjJnz34eyunRGBNrAFdMM4Rmwop by clicking the
                  button below to create and access linktree profiles:{" "}
                </Text>
                <button
                  onClick={handleTransferKoii}
                  className="connect-wallet-button"
                >
                  Transfer Koii
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {total !== null && (
        <div className="footer">
          <p>
            Total{" "}
            <a className="by-koii" href="https://www.koii.network/">
              Koii
            </a>{" "}
            linktrees created: <span className="by-koii total"> {total} </span>{" "}
          </p>
        </div>
      )}
    </>
  );
};

export default HomePage;
