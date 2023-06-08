import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast, Box } from "@chakra-ui/react";
import { getLinktrees, getAuthList } from "../api";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";

function LinksComponent() {
  const [connected, setConnected] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState({});
  const { isFinnieDetected, connect } = useK2Finnie();

  const { publicKey, apiUrl, setPublicKey } = useWalletContext();

  useEffect(() => {
    async function getUserData() {
      const response = await getLinktrees(query, apiUrl);
      console.log(response);
      setUserData(response.data.data.linktree);
    }
    async function getAuth() {
      if (!publicKey) {
        toast({
          title: "Connect your finnie wallet",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setConnected(false);
        return;
      }
      setConnected(true);
      const showData = await getAuthList(publicKey, apiUrl);
      if (showData) {
        await getUserData();
      } else {
        toast({
          title: "You are not authorized to view linktree profiles",
          description: "You'll be re-directed to get Authorized",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
    getAuth();
  }, [query, publicKey, toast, navigate, apiUrl]);

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );
  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      const pubKey = await connect();
      if (pubKey) {
        setPublicKey(pubKey);
      }
    }
  };

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <div className='container'>
      <Box
        minHeight='70vh'
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {userData && connected && (
          <>
            {" "}
            {userData?.image && (
              <img
                src={userData?.image}
                alt={userData?.name}
                className='user-image'
              />
            )}
            <p className='user-name'> {userData?.name} </p>
            <p className='user-desc'> {userData?.description} </p>
            <div className='links'>
              {userData?.links?.map((link, index) => (
                <a
                  className='link'
                  key={index}
                  href={link?.redirectUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}
        {!connected && (
          <Box marginTop='10rem'>
            <button
              onClick={handleConnectFinnie}
              className='connect-wallet-button'
            >
              {connectButtonText}
            </button>
          </Box>
        )}
        {!userData && connected && (
          <p>No Linktree profile for this public key</p>
        )}
      </Box>
      <div className='footer'>
        Link tree by{" "}
        <a href='https://www.koii.network/' className='by-koii'>
          Koii Network
        </a>
      </div>
    </div>
  );
}

export default LinksComponent;

// const Message = ({ children }) => {
//   return <div className='message-container'>{children}</div>;
// };
