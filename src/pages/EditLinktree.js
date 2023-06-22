import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage, Field, FieldArray } from "formik";
import { array, object, string, mixed, boolean } from "yup";
import { Web3Storage } from "web3.storage";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Input,
  IconButton,
  Text,
  Textarea,
  Spacer,
  Spinner,
  Select,
  Center,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import uuid from "react-uuid";
import { setLinktree, getLinktreeWithUsername } from "../api";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../contexts";
import { Oval } from "react-loader-spinner";
import { useDropzone } from "react-dropzone";
import { themeApplier } from "../helpers";

document.documentElement.setAttribute("data-theme", "dark");

function makeStorageClient() {
  return new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhmOWMxOTNjODJlODMzMjVDMThkNWM4NzRCM2Q2NGM5ZjI5NDdEOUQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2NTY1NzExNjEsIm5hbWUiOiJLb2lpIn0.qZJmInvmwLCkq_7T3h2gfm4Hs84MNKEVooOuAFfbIXI",
  });
}

const EditLinktree = () => {
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [imageName, setImageName] = useState(null);
  const [isProfileOwner, setIsProfileOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [choosenTheme, setChoosenTheme] = useState("Dark");
  const [choosenAnimation, setChoosenAnimation] = useState("none");
  const query = location.pathname.slice(14);
  const [userData, setUserData] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { publicKey, apiUrl, nodeList } = useWalletContext();
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

  useEffect(() => {
    async function getUserData() {
      const userResponse = await getLinktreeWithUsername(query, nodeList);
      const isProfileOwner =
        window?.k2 &&
        publicKey &&
        window?.k2?.publicKey?.toString() === userResponse.data.publicKey;
      setIsProfileOwner(isProfileOwner);
      setUserData(userResponse?.data?.data?.linktree);
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
  }, [query, publicKey, toast, navigate, apiUrl, nodeList]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);
  useEffect(() => {
    themeApplier(userData?.theme);
    setChoosenTheme(userData?.theme);
  }, [userData]);
  function handleThemeSelection(theme) {
    setChoosenTheme(theme);
    switch (theme) {
      case "Dark":
        document.documentElement.setAttribute("data-theme", "dark");
        break;
      case "Mint":
        document.documentElement.setAttribute("data-theme", "light");
        break;
      case "Gradient":
        document.documentElement.setAttribute("data-theme", "gradient");
        break;
      default:
        break;
    }
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
    let imageLink;
    console.log(values?.image);
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
        animation: choosenAnimation,
      },
      timestamp: Date.now(),
    };
    console.log(payload);
    // return;
    const res = await setLinktree(
      payload,
      publicKey,
      nodeList,
      values?.linktreeAddress
    );
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
        navigate(`/linktree/${values?.linktreeAddress}`);
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

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setChoosenAnimation(selectedValue);
    console.log("hello");
  };
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img
        className='user-image'
        alt='User'
        src={file.preview}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));
  return (
    <>
      {userData ? (
        <Box
          py={{ base: "8rem", md: "5rem" }}
          px={8}
          className='createLinktree'
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight={{ base: "bold", md: "normal" }}
            my={5}
          >
            Edit Your Koii Linktree Profile
          </Text>

          <Formik
            initialValues={{
              name: userData?.name,
              description: userData?.description,
              image: userData?.image,
              background: "",
              links: userData?.links,
              linktreeAddress: userData?.linktreeAddress,
            }}
            validationSchema={object({
              name: string().required("Full name is required"),
              description: string()
                .min(5, "Bio is too short!")
                .max(400, "Bio is too Long")
                .required("A short bio is required"),
              linktreeAddress: string()
                .min(5, "Username is too short!")
                .max(200, "Username is too Long")
                .required("An address is required."),
              image: mixed().nullable().required("Upload a profile image"),
              links: array(
                object({
                  label: string().required("Link label is required"),
                  redirectUrl: string().required("Link URL is required"),
                  key: string(),
                  isFavorite: boolean(),
                })
              )
                .min(1, "At least one link is required!")
                .required("Add a social link"),
            })}
            onSubmit={handleSubmit}
          >
            {({ values, handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit}>
                <Box mt={8}>
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Box mt={5}>
                      {files.length === 0 ? (
                        <img
                          src={userData?.image}
                          alt='User'
                          className='user-image'
                        />
                      ) : (
                        thumbs
                      )}
                    </Box>
                    <Box
                      border={"1px dashed #8989c7"}
                      borderRadius={10}
                      py={5}
                      px={8}
                      height={"auto"}
                      cursor={"pointer"}
                      {...getRootProps({ className: "dropzone" })}
                    >
                      <input {...getInputProps()} />
                      <Text color='#8989c7'>Choose image +</Text>
                    </Box>
                  </Flex>
                  <Flex my={3} alignItems={"center"}>
                    <Text mr={5}>Name:</Text>
                    <Field
                      name='name'
                      label='Full Name'
                      variant='flushed'
                      as={Input}
                      className='input-border'
                    />
                    <Text className='error'>
                      <ErrorMessage name='name' />
                    </Text>
                  </Flex>

                  <Flex mt={5}>
                    <Text mr={10}>Bio:</Text>
                    <Field
                      name='description'
                      label='Bio'
                      as={Textarea}
                      height='150px'
                      className='input-border'
                    />
                    <Text className='error'>
                      <ErrorMessage name='description' />
                    </Text>
                  </Flex>
                </Box>
                <FieldArray name='links'>
                  {({ push, remove }) => (
                    <div>
                      <div>
                        <Text fontSize='2xl' mt={5}>
                          Social Links
                        </Text>
                      </div>
                      {values.links.map((_, index) => (
                        <Box
                          padding='10px'
                          outline={index === 0 ? "2px black solid" : undefined}
                          backgroundColor={
                            index === 0 ? "rgba(0, 0, 0, 0.1);" : undefined
                          }
                        >
                          {index === 0 && (
                            <Box className='chooseAnimation'>Favorite Link</Box>
                          )}
                          <Flex
                            flexDirection={{ base: "column", md: "row" }}
                            key={index}
                            mt={2}
                            alignItems={{ base: "end", md: "center" }}
                          >
                            <Box w={{ base: "100%", md: "45%" }}>
                              <Text>Link Label</Text>
                              <Field
                                name={`links.${index}.label`}
                                label='Link Name'
                                as={Input}
                                className='input-border'
                              />

                              <Text className='error'>
                                <ErrorMessage name={`links.${index}.label`} />ㅤ
                              </Text>
                            </Box>
                            <Spacer />
                            <Box w={{ base: "100%", md: "45%" }}>
                              <Text>Link URL</Text>
                              <Field
                                className='input-border'
                                name={`links.${index}.redirectUrl`}
                                label='Link URL'
                                as={Input}
                              />
                              <Text className='error'>
                                <ErrorMessage
                                  name={`links.${index}.redirectUrl`}
                                />
                                ㅤ
                              </Text>
                            </Box>
                            <Spacer />
                            {index === 0 ? (
                              <div>
                                {/* You can put the Tooltip back here */}
                              </div>
                            ) : (
                              <div>
                                <IconButton
                                  rounded='full'
                                  icon={<DeleteIcon />}
                                  colorScheme='red'
                                  mr={-3}
                                  marginBottom='10px'
                                  alignSelf={{ base: "flex-end", lg: "" }}
                                  onClick={() => remove(index)}
                                />
                              </div>
                            )}
                          </Flex>
                          {index === 0 && (
                            <>
                              <Box>
                                <Select
                                  placeholder='None'
                                  onChange={handleOptionChange}
                                  value={userData?.animation}
                                >
                                  <option value='fade-in'>Fade</option>
                                  <option value='pulse'>Pulse</option>
                                  <option value='spin'>Spin</option>
                                  <option value='bounce'>Bounce</option>
                                  <option value='rainbow'>Rainbow</option>
                                </Select>
                                <Center>
                                  <Button mt={5} className={choosenAnimation}>
                                    Example!
                                  </Button>
                                </Center>
                              </Box>
                            </>
                          )}
                        </Box>
                      ))}
                      <Button
                        mt={4}
                        leftIcon={<AddIcon />}
                        color='var(--koii-white)'
                        rounded='full'
                        borderColor='var(--koii-white)'
                        variant='outline'
                        onClick={() => push(linksGroup)}
                        _hover={{
                          backgroundColor: "var(--koii-white)",
                          color: "var(--koii-blue)",
                        }}
                      >
                        Add Link
                      </Button>
                      {/* Other "Add Link" buttons go here */}
                    </div>
                  )}
                </FieldArray>

                <Box mt={10}>
                  <Text fontSize='2xl' mt={5}>
                    Linktree Username
                  </Text>

                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Text fontSize='m' mr={2}>
                      linktree.koii.network/
                    </Text>
                    <Field
                      name='linktreeAddress'
                      label='Linktree Address'
                      variant='flushed'
                      as={Input}
                      className='input-border'
                      value={userData?.linktreeAddress}
                    />
                  </Box>

                  <Text className='error'>
                    <ErrorMessage name='linktreeAddress' />
                  </Text>
                </Box>

                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight={{ base: "bold", md: "normal" }}
                  my={5}
                >
                  Change theme
                </Text>

                <Flex justifyContent={"space-between"}>
                  <Flex
                    alignItems={"center"}
                    bg='#e5e5e5'
                    py={2}
                    px={6}
                    borderRadius={10}
                    cursor={"pointer"}
                    outline={
                      choosenTheme === "Dark" ? "3px solid #6bdd6b" : undefined
                    }
                    onClick={() => handleThemeSelection("Dark")}
                  >
                    <Box
                      background='#171753'
                      boxSize='2rem'
                      borderRadius='full'
                      mr='12px'
                    />
                    <Text color={"#171753"}>Koii Dark</Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    bg='#e5e5e5'
                    py={2}
                    px={6}
                    borderRadius={10}
                    cursor={"pointer"}
                    outline={
                      choosenTheme === "Mint" ? "3px solid #6bdd6b" : undefined
                    }
                    onClick={() => handleThemeSelection("Mint")}
                  >
                    <Box
                      background='#5ED9D1'
                      boxSize='2rem'
                      borderRadius='full'
                      mr='12px'
                    />
                    <Text color={"#171753"}>Koii Mint</Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    bg='#e5e5e5'
                    py={2}
                    px={6}
                    borderRadius={10}
                    cursor={"pointer"}
                    onClick={() => handleThemeSelection("Gradient")}
                    outline={
                      choosenTheme === "Gradient"
                        ? "3px solid #6bdd6b"
                        : undefined
                    }
                  >
                    <Box
                      background='linear-gradient(90deg, rgba(212,141,160,1) 0%, rgba(155,38,142,0.46406687675070024) 100%, rgba(046,161,165,1) 100%)'
                      boxSize='2rem'
                      borderRadius='full'
                      mr='12px'
                    />
                    <Text color={"#171753"}>Koii Grad</Text>
                  </Flex>
                </Flex>

                <Button
                  w='full'
                  rounded='full'
                  color='var(--koii-blue)'
                  bg='var(--koii-white)'
                  my={10}
                  type='submit'
                >
                  {isLoading ? <Spinner /> : "Save"}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
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
