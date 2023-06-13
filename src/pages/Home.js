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

  const texts = ["Koii Linktree.", "Decentralization.", "The future.", "Koii Linktree."];
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [letter, setLetter] = useState("");

  useEffect(() => {
    const type = () => {
      if (count === texts.length) {
        setCount(0);
      } else if (count === 3) {
        setCount(0);
      }
  
      const currentText = texts[count];
      setLetter(currentText.slice(0, index + 1));
  
      if (index === currentText.length - 1) {
        if (count < texts.length - 1) {
          setTimeout(() => {
            setCount(count + 1);
            setIndex(0);
          }, 600); 
        } else {
          setCount(0);
          setIndex(0);
        }
      } else {
        setIndex(index + 1);
      }
    };
  
    const timer = setTimeout(type, 130);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [count, index, letter, texts]); // Depend on these values
  
  

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
            <Stack direction="column" spacing={4} align="center">
              <Button
                onClick={() => navigate(`linktree/${localpk}`)}
                colorScheme="blue"
              >
                Show my Linktree
              </Button>
              <Button
                onClick={() => navigate(`createlinktree`)}
                colorScheme="blue"
              >
                Redesign Linktree
              </Button>
            </Stack>
          </>
        ) : (
          <div className="auth-user">
            {isAuth ? (
              <>
             <Text
                  marginBottom="10px"
                  fontSize="24px"
                  textAlign="center"
                  maxWidth="600px"
                >
                  Welcome to
                </Text>
                <Text
                  marginBottom="15px"
                  fontSize="24px"
                  textAlign="center"
                  maxWidth="600px"
                >
                  {letter}
                </Text>
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
          <Text
                  marginTop="10px"
                  fontSize="11px"
                  textAlign="center"
                  maxWidth="600px"
                >
                Knowledgeable Open and Infinite Internet

                </Text>
        </div>
      )}
    </>
  );
};

export default HomePage;
