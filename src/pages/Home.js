import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Text } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { getLinktrees, getAuthList, transferKoii } from "../api";

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(true);
  const toast = useToast();
  const { setPublicKey, apiUrl } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);
          const isAuthListed = await getAuthList(pubKey, apiUrl);

          if (isAuthListed) {
            const linktree = await getLinktrees(pubKey, apiUrl);
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
              setTimeout(() => {
                navigate(`linktree/${pubKey}`);
              }, 2000);
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
              title: "You are not authorized to access Linktree profiles",
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
      await transferKoii(apiUrl);
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
    <div className='container public-key-input-container'>
      <div className='auth-user'>
        {isAuth ? (
          <button
            onClick={handleConnectFinnie}
            className='connect-wallet-button'
          >
            {connectButtonText}
          </button>
        ) : (
          <>
            <Text marginBottom='10px' fontSize='30px'>
              You are not authorized to create and access Linktree profiles
            </Text>
            <Text marginBottom='20px' fontSize='18px'>
              Transfer 10 Koii to this address by clicking the button below to
              create and access linktree profiles:{" "}
            </Text>
            <button
              onClick={handleTransferKoii}
              className='connect-wallet-button'
            >
              Transfer Koii
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
