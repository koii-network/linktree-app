import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useWalletContext } from "./contexts";
import { useK2Finnie } from "./hooks";
import { DOWNLOAD_FINNIE_URL } from "./config";
import { getLinktrees } from "./api";

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setPublicKey } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);
          const linktree = await getLinktrees(pubKey);
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
              navigate(`linktree/${pubKey}`);
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
        <button onClick={handleConnectFinnie} className='connect-wallet-button'>
          {connectButtonText}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
