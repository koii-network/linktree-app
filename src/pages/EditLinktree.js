import React, { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import uuid from "react-uuid";
import { updateLinktree } from "../api";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../contexts";
import { Oval } from "react-loader-spinner";
import { useDropzone } from "react-dropzone";
import { themeApplier, createThemeApplier } from "../helpers";
import LinktreeEditForm from "../components/form/edit-form";

document.documentElement.setAttribute("data-theme", "dark");

function makeStorageClient() {
  return new Web3Storage({
    token: process.env.REACT_APP_WEB3STORAGE_TOKEN,
  });
}

const EditLinktree = () => {
  const { publicKey, nodeList, userData } = useWalletContext();
  const [files, setFiles] = useState([]);
  const [imageName, setImageName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [choosenTheme, setChoosenTheme] = useState("Dark");
  const [choosenLabelTheme, setChoosenLabelTheme] = useState(
    userData?.choosenLabelTheme || "label-one"
  );

  const toast = useToast();
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setImageName(acceptedFiles[0].name);
    },
  });

  const handleLabelSelection = (e) => {
    setChoosenLabelTheme(e);
  };

  useEffect(() => {
    async function getData() {
      if (userData) {
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
  }, [userData, toast]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    themeApplier(userData?.theme);
    setChoosenTheme(userData?.theme);
    handleThemeSelection(userData?.theme);
  }, [userData]);

  function handleThemeSelection(theme) {
    setChoosenTheme(theme);
    createThemeApplier(theme);
  }

  const uploadToIPFS = async (image) => {
    if (image) {
      try {
        const client = makeStorageClient();
        const cid = await client.put(image, {
          name: "cat pics",
          maxRetries: 3,
        });
        if (cid !== undefined) {
          return cid;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const insertKey = (links) => {
    return links.map((item, index) => {
      return {
        ...item,
        isFavorite: index === 0 ? true : false,
        key: uuid(),
      };
    });
  };

  const handleSubmit = async (values) => {
    console.log("hello");
    setIsLoading(true);
    if (!publicKey) {
      toast({
        title: "Connect your finnie wallet",
        description: "You'll be re-directed to connect your finnie wallet",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setIsLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      return;
    }
    console.log("result", values);
    let imageLink;
    if (values?.image && files.length > 0) {
      values.image = files[0].name;
      const imageCID = await uploadToIPFS(files);
      if (imageCID === null) {
        setIsLoading(false);
        return toast({
          title: "Try again",
          description: "Error uploading image",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      imageLink = `https://${imageCID}.ipfs.dweb.link/${imageName}`;
    } else {
      imageLink = userData?.image;
    }

    values.links = insertKey(values.links);
    const payload = {
      uuid: uuid(),
      linktree: {
        ...values,
        image: imageLink,
        background: "",
        theme: choosenTheme,
        choosenLabelTheme: choosenLabelTheme,
      },
      timestamp: Date.now(),
    };
    // return;
    const res = await updateLinktree(
      payload,
      publicKey,
      nodeList,
      values?.linktreeAddress
    );
    console.log("result", res);
    if (res?.message === "Proof and linktree registered successfully") {
      toast({
        title:
          "Successfully edited Linktree profile! Redirecting in 10 seconds...",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        navigate(`/${values?.linktreeAddress}`);
      }, 10000);
    } else {
      toast({
        title: "Error editing Linktree profile!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setIsLoading(false);
  };
  const linksGroup = { label: "", redirectUrl: "", key: "", isFavorite: false };
  return (
    <>
      {userData ? (
        <>
          <Flex justify='center' align='center' width='100%'>
            <Box
              py={{ base: "3rem", md: "5rem" }}
              px={8}
              margin='auto'
              maxWidth={{ base: "100%", md: "800px" }}
              className='createLinktree'
            >
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight={{ base: "bold", md: "normal" }}
                my={5}
                display={"flex"}
                gap='15px'
                color='var(--koii-create-topic)'
              >
                <Button
                  leftIcon={
                    <ChevronLeftIcon
                      height={{ base: "20px", md: "30px" }}
                      width={{ base: "20px", md: "30px" }}
                      marginRight='-8px'
                    />
                  }
                  onClick={() => {
                    navigate(-1);
                  }}
                  variant='outline'
                  padding='0px'
                  display='flex'
                  alignItems='center'
                  justifyItems='center'
                  height={{ base: "40px", md: "50px" }}
                  width={{ base: "30px", md: "50px" }}
                  color='var(--koii-create-topic)'
                  rounded='full'
                  borderColor='var(--koii-create-topic)'
                  _hover={{
                    backgroundColor: "var(--koii-white)",
                    color: "var(--koii-create-topic)",
                  }}
                />
                Edit your Profile
              </Text>

              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight={{ base: "bold", md: "bold" }}
                my={5}
                color='var(--koii-create-topic)'
              >
                Profile Settings
              </Text>

              <LinktreeEditForm
                choosenLabelTheme={choosenLabelTheme}
                choosenTheme={choosenTheme}
                linksGroup={linksGroup}
                handleSubmit={handleSubmit}
                userData={userData}
                isLoading={isLoading}
                handleLabelSelection={handleLabelSelection}
                handleThemeSelection={handleThemeSelection}
                files={files}
                getInputProps={getInputProps}
                getRootProps={getRootProps}
              />
            </Box>
          </Flex>
        </>
      ) : (
        <Box marginTop={"300px"}>
          <Oval
            height={80}
            width={80}
            color='#ffffff'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#ffffff'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </Box>
      )}
    </>
  );
};

export default EditLinktree;
