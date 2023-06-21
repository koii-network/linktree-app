import {
  Box,
  Center,
  Text,
  Stack,
  Button,
  useToast,
  Icon,
  Avatar,
  Spacer,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { InfoIcon, ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { getLinktree, deleteLinktree } from "../api";
import { useWalletContext } from "../contexts";

function ControlPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const toast = useToast();
  const { publicKey, apiUrl, nodeList } = useWalletContext();

  useEffect(() => {
    async function getUserData() {
      const userResponse = await getLinktree(publicKey, nodeList);
      setUserData(userResponse?.data?.linktree);
      return userResponse;
    }
    async function getData() {
      const userData = await getUserData();
      if (userData?.status) {
        setIsLoading(false);
      } else {
        toast({
          title: "Error fetching Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
    getData();
  }, [publicKey, toast, navigate, apiUrl, nodeList]);

  const handleShow = () => {
    navigate(`/linktree/${userData?.linktreeAddress}`);
  };

  const handleDeleteLinktree = async () => {
    if (publicKey) {
      try {
        const deletedProfile = await deleteLinktree(nodeList, publicKey);
        if (deletedProfile) {
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
          return;
        }
        throw Error("Error deleting profile");
      } catch (error) {
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

  const handleRedesign = () => {
    toast({
      title: "Redesigning your Linktree.",
      description: "Redirecting to the redesign page...",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <Center height='100vh'>
        <Box
          width={"50vw"}
          bgGradient='linear(to-r, teal.500,green.500)'
          p={5}
          borderRadius='15px'
        >
          <Flex>
            <Avatar size='md' name={userData?.name} />
            <Spacer />
            <Heading color='white' fontSize='2xl'>
              Control Panel
            </Heading>
          </Flex>

          <Text
            color='white'
            marginTop='10px'
            fontSize='15px'
            textAlign='center'
          >
            🎏 {userData?.linktreeAddress} 🎏
          </Text>

          <Stack direction='column' spacing={4} align='center' marginTop='20px'>
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="blue"
              onClick={handleShow}
              minWidth='200px'
            >
              Show my Linktree
            </Button>

            <Button
              leftIcon={<EditIcon />}
              colorScheme="purple"
              onClick={handleRedesign}
              minWidth='200px'
            >
              Redesign Linktree
            </Button>

            <Button
              leftIcon={<DeleteIcon />}
              colorScheme='red'
              minWidth='200px'
              onClick={handleDeleteLinktree}
            >
              Delete Linktree
            </Button>
          </Stack>

          {/* <Checkbox marginTop='20px'>Show 'Tip Koii' Option</Checkbox> */}

          <Text
            marginTop='90px'
            fontSize='12px'
            textAlign='center'
            color='white'
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Icon as={InfoIcon} style={{ marginRight: "5px" }} />
              <span>Learn more about KOII</span>
            </div>
          </Text>
        </Box>
      </Center>
    </>
  );
}

export default ControlPanel;
