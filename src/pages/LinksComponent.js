import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast, Box, IconButton, Tooltip } from "@chakra-ui/react";
import { getLinktrees, getAuthList } from "../api";
import { useWalletContext } from "../contexts";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

function LinksComponent() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState({});

  const { publicKey } = useWalletContext();

  useEffect(() => {
    async function getUserData() {
      const response = await getLinktrees(query);
      setUserData(response.data.data.linktree);
    }
    async function getAuth() {
      if (!publicKey) {
        toast({
          title: "Connect your finnie wallet",
          description: "You'll be re-directed to connect your finnie wallet",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
        return;
      }
      const showData = await getAuthList(publicKey);
      if (showData) {
        await getUserData();
      } else {
        toast({
          title: "You need to create a profile to view linktree profiles",
          description: "You'll be re-directed to create a profile",
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
    getAuth();
  }, [query, publicKey, toast, navigate]);

  const isProfileOwner = query === publicKey;

  return (
    <div className='container relative'>
      <Box
        minHeight='70vh'
        maxWidth='600px'
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {userData && (
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
      </Box>
      {isProfileOwner && (
        <Box
          position='absolute'
          top={{ base: "20px", md: "30px" }}
          left={{ base: "20px", md: "15%", lg: "25%" }}
        >
          <Tooltip
            hasArrow
            label='Delete Your Linktree Profile'
            bg='#ecfffe'
            fontSize='sm'
            color='#171753'
          >
            <IconButton
              rounded='full'
              alignSelf={{ base: "flex-end", lg: "" }}
              marginTop='10px'
              icon={<DeleteIcon />}
              colorScheme='red'
            />
          </Tooltip>
        </Box>
      )}
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
