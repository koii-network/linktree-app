import React, { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import koiiDecor from "./images/Decor 1.svg";
import LinktreeForm from "../components/form";

import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import uuid from "react-uuid";
import { setLinktree, getLinktreeWithUsername, setLinktreeMagic } from "../api";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../contexts";
import "../css/ButtonAnimations.css";
import { createThemeApplier, getRadioButtonScheme } from "../helpers";
import TransferTokens from "../components/modals/magic/TransferTokens";
import MasterMagic from "../components/modals/magic/MasterMagic";

function makeStorageClient() {
  return new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhmOWMxOTNjODJlODMzMjVDMThkNWM4NzRCM2Q2NGM5ZjI5NDdEOUQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2NTY1NzExNjEsIm5hbWUiOiJLb2lpIn0.qZJmInvmwLCkq_7T3h2gfm4Hs84MNKEVooOuAFfbIXI",
  });
}

const CreateLinktree = () => {
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [choosenTheme, setChoosenTheme] = useState("Mint");
  const [choosenLabelTheme, setChoosenLabelTheme] = useState("label-one");
  const [radioColorScheme, setRadioColorScheme] = useState("yellow");

  const [usernameError, setUsernameError] = useState("");
  const [disabled, setDisabled] = useState(true);

  function handleThemeSelection(theme) {
    setChoosenTheme(theme);
    createThemeApplier(theme);
    const colorScheme = getRadioButtonScheme(theme);
    setRadioColorScheme(colorScheme);
  }

  const linksGroup = { label: "", redirectUrl: "", key: "", isFavorite: false };
  const toast = useToast();
  const navigate = useNavigate();
  const {
    publicKey,
    apiUrl,
    nodeList,
    magicData,
    magicPayload,
    setMagicPayload,
  } = useWalletContext();
  console.log(magicData);

  const uploadToIPFS = async (image) => {
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

  useEffect(() => {
    handleThemeSelection("Mint");
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
    }
    getAuth();
  }, [publicKey, toast, navigate, apiUrl]);

  const handleSubmit = async (values, actions) => {
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

    values.links = insertKey(values.links);
    const payload = {
      uuid: uuid(),
      linktree: {
        ...values,
        image: `https://${imageCID}.ipfs.dweb.link/${imageName}`,
        background: "",
        theme: choosenTheme,
        choosenLabelTheme: choosenLabelTheme,
      },
      timestamp: Date.now(),
    };

    const res = await setLinktree(
      payload,
      publicKey,
      nodeList,
      values?.linktreeAddress
    );
    if (res?.message === "Proof and linktree registered successfully") {
      toast({
        title:
          "Successfully created Linktree profile! Redirecting in 10 seconds...",
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
        title: "Error creating Linktree profile!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setIsLoading(false);
  };

  const handleSubmitMagic = async (values, actions) => {
    setIsLoading(true);

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

    values.links = insertKey(values.links);
    const payload = {
      uuid: uuid(),
      linktree: {
        ...values,
        image: `https://${imageCID}.ipfs.dweb.link/${imageName}`,
        background: "",
        theme: choosenTheme,
        choosenLabelTheme: choosenLabelTheme,
      },
      timestamp: Date.now(),
    };

    setMagicPayload(payload);

    setIsLoading(false);
  };

  const handleChangeUserName = async (e) => {
    const userData = await getLinktreeWithUsername(e.target.value, nodeList);
    if (userData?.data?.username) {
      setUsernameError("Username already exists");
      setDisabled(true);
    } else {
      setUsernameError("");
      setDisabled(false);
    }
  };

  const handleLabelSelection = (e) => {
    setChoosenLabelTheme(e);
  };
  return (
    <Flex justify="center" align="center" width="100%">
      <Box
        py={{ base: "2rem", md: "5rem" }}
        px={8}
        margin="auto"
        maxWidth={{ base: "100%", md: "800px" }}
        className="createLinktree"
      >
        <Flex>
          <Text
            my={5}
            color="var(--koii-create-topic)"
            fontSize={{ base: "24px", md: "32px" }}
            fontFamily="Sora"
            fontStyle="normal"
            fontWeight="600"
            lineHeight={{ base: "24px", md: "40px" }}
          >
            Create Your Koii Linktree Profile
          </Text>
        </Flex>

        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight={{ base: "bold", md: "bold" }}
          my={5}
          color="var(--koii-create-topic)"
        >
          Profile Settings
        </Text>

        {magicData ? (
          <>
            <LinktreeForm
              choosenLabelTheme={choosenLabelTheme}
              choosenTheme={choosenTheme}
              linksGroup={linksGroup}
              image={image}
              handleSubmit={handleSubmitMagic}
              setFiles={setFiles}
              setImage={setImage}
              setImageName={setImageName}
              handleChangeUserName={handleChangeUserName}
              usernameError={usernameError}
              disabled={disabled}
              isLoading={isLoading}
              handleLabelSelection={handleLabelSelection}
              handleThemeSelection={handleThemeSelection}
              colorScheme={radioColorScheme}
              registerLinkText={"Prepare My KoiiLink"}
            />
            <MasterMagic />
          </>
        ) : (
          <>
            <LinktreeForm
              choosenLabelTheme={choosenLabelTheme}
              choosenTheme={choosenTheme}
              linksGroup={linksGroup}
              image={image}
              handleSubmit={handleSubmit}
              setFiles={setFiles}
              setImage={setImage}
              setImageName={setImageName}
              handleChangeUserName={handleChangeUserName}
              usernameError={usernameError}
              disabled={disabled}
              isLoading={isLoading}
              handleLabelSelection={handleLabelSelection}
              handleThemeSelection={handleThemeSelection}
              colorScheme={radioColorScheme}
              registerLinkText={"Register My KoiiLink"}
            />
          </>
        )}
      </Box>
    </Flex>
  );
};

export default CreateLinktree;
