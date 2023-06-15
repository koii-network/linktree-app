import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast, Box, Spinner, IconButton, Tooltip } from "@chakra-ui/react";
import { DeleteIcon, AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { getLinktree, deleteLinktree } from "../api";
import { useWalletContext } from "../contexts";

function LinksComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [noProfileText, setNoProfileText] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState({});

  const { publicKey, apiUrl, nodeList } = useWalletContext();

  const isProfileOwner = query === publicKey;

  useEffect(() => {
    async function getUserData() {
      const response = await getLinktree(query, nodeList);
      setUserData(response?.data?.linktree);
      return response;
    }
    async function getData() {
      const userData = await getUserData();
      if (userData.status) {
        setIsLoading(false);
      } else {
        toast({
          title: "Error fetching Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setNoProfileText("Error fetching Linktree profile");
      }
      if (userData.data && userData.status) {
        setNoProfileText("No Linktree profile for this public key");
      }
    }
    getData();
  }, [query, publicKey, toast, navigate, apiUrl, nodeList]);

  const handleDeleteLinktree = async () => {
    if (publicKey) {
      try {
        await deleteLinktree(apiUrl, publicKey);
        toast({
          title: "Linktree profile deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch {
        toast({
          title: "Error deleting Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  function handleEditLinktree() {

      navigate("/createlinktree");

  }
  return (
    <Box className='container' position='relative'>
      <Box
        minHeight='70vh'
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyItems='center'
      >
        {isLoading ? (
          <Box
            height='100%'
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyItems='center'
          >
            <Spinner height='50px' width='50px' />
          </Box>
        ) : (
          <Box
            width='100%'
            display='flex'
            alignItems='center'
            flexDirection='column'
          >
            {isProfileOwner && (
              <>
              <Box
                position='absolute'
                top={{ base: "20px", md: "30px" }}
                left={{ base: "20px", md: "-5%" }}
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
                    onClick={handleDeleteLinktree}
                  />
                </Tooltip>
              </Box>

<Box
position='absolute'
top={{ base: "20px", md: "30px" }}
right={{ base: "20px", md: "-5%" }}
>
<Tooltip
  hasArrow
  label='Edit Your Linktree Profile'
  bg='#ecfffe'
  fontSize='sm'
  color='#171753'
>
  <IconButton
    rounded='full'
    alignSelf={{ base: "flex-end", lg: "" }}
    marginTop='10px'
    icon={<SettingsIcon />}
    colorScheme='blue'
    onClick={handleEditLinktree}
  />
</Tooltip>
</Box>
</>
            )}
            {userData && (
              <>
                {userData?.image && (
                  <img
                    src={userData?.image}
                    alt={userData?.name}
                    className='user-image'
                  />
                )}
                <p className='user-name'> {userData?.name} </p>
                <p className='user-desc'>{userData?.description}</p>
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
                {publicKey && (
                  <p>
                    <a
                      href={`https://linktree.koii.network/linktree/${publicKey}`}
                      className='displayLink'
                    >
                      Your linktree profile Link
                    </a>
                  </p>
                )}
              </>
            )}
            {!userData && !isLoading && <p>{noProfileText}</p>}
          </Box>
        )}
      </Box>
      <div className='footer'>
        Linktree by{" "}
        <a href='https://www.koii.network/' className='by-koii'>
          Koii Network
        </a>
      </div>
    </Box>
  );
}

export default LinksComponent;

// const Message = ({ children }) => {
//   return <div className='message-container'>{children}</div>;
// };
