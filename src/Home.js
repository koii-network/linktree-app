import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Button } from "@chakra-ui/react";
import { useWalletContext } from "./contexts";
import { useK2Finnie } from "./hooks";
import { DOWNLOAD_FINNIE_URL } from "./config";
import { getLinktrees } from "./api";

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { publicKey, setPublicKey } = useWalletContext();
  const { isFinnieDetected, k2PubKey, connect } = useK2Finnie();

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      await connect();
      try {
        if (k2PubKey) {
          setPublicKey(k2PubKey);
          const linktree = await getLinktrees(k2PubKey);
          if (linktree.status === 200 && linktree.data.length === 0) {
            toast({
              title: "No Linktree profile for this public key",
              description: "You'll be re-directed to create a profile",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate("/createlinktree");
            }, 3000);
          } else {
            toast({
              title: "Linktree profile successfully fetched!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate(`linktree/${k2PubKey}`);
            }, 2000);
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
        alert(err.data);
      }
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
        <Button
          backgroundColor='transparent'
          padding='35px 30px'
          border='1px solid #171753'
          fontSize='20px'
          borderRadius='35px'
          _hover={{
            backgroundColor: "#8989c7",
            color: "#FFFFFF",
            border: "none",
          }}
          onClick={handleConnectFinnie}
          className='connect-finnie'
        >
          {connectButtonText}
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
