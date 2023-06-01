import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Button } from "@chakra-ui/react";
import { useWalletContext } from "./contexts";
import { useK2Finnie } from "./hooks";
import { DOWNLOAD_FINNIE_URL } from "./config";

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { publicKey, setPublicKey } = useWalletContext();
  const { isFinnieDetected, k2PubKey, connect } = useK2Finnie();

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      await connect();
      if (k2PubKey) {
        setPublicKey(k2PubKey);
        navigate(`/linktree/${k2PubKey}`);
      } else {
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
      }
    }
  };

  const linkToGetFinnie = (
    <a
      rel="noreferrer"
      target="_blank"
      href={DOWNLOAD_FINNIE_URL}
    >
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected ? "Connect Finnie" : linkToGetFinnie;

  return (
    <div className="container public-key-input-container">
      <div className="auth-user">
        <Button
          backgroundColor="transparent"
          padding="35px 30px"
          border="1px solid #171753"
          fontSize="20px"
          borderRadius="35px"
          _hover={{
            backgroundColor: "#8989c7",
            color: "#FFFFFF",
            border: "none",
          }}
          onClick={handleConnectFinnie}
          className="connect-finnie"
        >
          {connectButtonText}
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
