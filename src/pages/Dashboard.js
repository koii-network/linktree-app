import {
  Box,
  Center,
  Text,
  Stack,
  Button,
  useToast,
  Input,
  Checkbox,
  Tooltip,
  Icon,
  Avatar,
  Spacer,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { InfoIcon, ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";

function ControlPanel() {
  const toast = useToast();

  const handleShow = () => {
    toast({
      title: "Showing your Linktree.",
      description: `Navigate to www.linktree.com`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
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
      <Center height="100vh">
        <Box
          height={"60vh"}
          width={"50vw"}
          bgGradient="linear(to-r, teal.500,green.500)"
          p={5}
          borderRadius="15px"
        >
          <Flex>
            <Avatar size="md" name="User Avatar" />
            <Spacer />
            <Heading color="white" fontSize="2xl">
              Control Panel
            </Heading>
          </Flex>

          <Text
            color="white"
            marginTop="10px"
            fontSize="15px"
            textAlign="center"
          >
            🎏 yourusername 🎏
          </Text>

          <Stack direction="column" spacing={4} align="center" marginTop="20px">
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="blue"
              onClick={handleShow}
            >
              Show my Linktree
            </Button>

            <Button
              leftIcon={<EditIcon />}
              colorScheme="purple"
              onClick={handleRedesign}
            >
              Redesign Linktree
            </Button>

            <Button leftIcon={<DeleteIcon />} colorScheme="red">
              Delete Linktree
            </Button>
          </Stack>

          <Checkbox marginTop="20px">Show 'Tip Koii' Option</Checkbox>

          <Text
            marginTop="20px"
            fontSize="12px"
            textAlign="center"
            color="white"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
