import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage, Field, FieldArray } from "formik";
import { array, object, string, mixed } from "yup";
import { Web3Storage } from "web3.storage";
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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import uuid from "react-uuid";
import { setLinktree } from "../api";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../contexts";

function makeStorageClient() {
  return new Web3Storage({
    token: process.env.REACT_APP_WEB3STORAGE_TOKEN,
  });
}

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    setPreview(reader.result);
  };

  return (
    <Box mt={5} display="flex" justifyContent="center">
      <img src={preview} alt="User" className="user-image" />
    </Box>
  );
};

const CreateLinktree = () => {
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [choosenTheme, setChoosenTheme] = useState("Mint");

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
    }
  }

  const linksGroup = { label: "", redirectUrl: "", key: "" };
  const toast = useToast();
  const navigate = useNavigate();
  const { publicKey, apiUrl } = useWalletContext();

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
    return links.map((item) => {
      return {
        ...item,
        key: uuid(),
      };
    });
  };

  useEffect(() => {
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
      },
      timestamp: Date.now(),
    };

    const res = await setLinktree(payload, publicKey, apiUrl);
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
        navigate(`/linktree/${publicKey}`);
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

  return (
    <Box py={{ base: "8rem", md: "5rem" }} px={8} className="createLinktree">
      <Text
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight={{ base: "bold", md: "normal" }}
        my={5}
      >
        Create Your Koii Linktree Profile
      </Text>

      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight={{ base: "bold", md: "normal" }}
        my={5}
      >
        Choose a theme
      </Text>
      <Flex color="white">
        <>
          <Card
            className="card"
            maxW="sm"
            marginRight="20px"
            backgroundColor="#C7F2EF"
            color="black"
            outline={choosenTheme === "Mint" ? '3px solid black' : undefined}
          >
            <CardBody>
              <Image
                borderRadius="10px"
                src="/images/Koii-Mint.png"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">Koii Mint</Heading>
                <Text>The default one.</Text>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  variant="solid"
                  backgroundColor="#8989C7"
                  borderRadius="5px"
                  onClick={() => handleThemeSelection("Mint")}
                >
                  Choose
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>

          <br />

          <Card
            className="card"
            maxW="sm"
            marginRight="20px"
            backgroundColor="#171753"
            color="white"
            outline={choosenTheme === "Dark" ? '3px solid white' : undefined}
          >
            <CardBody>
              <Image
                borderRadius="10px"
                src="/images/Koii-Dark.png"
                alt="Green double couch with wooden legs"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">Koii Dark</Heading>
                <Text>Secrets in shadows.</Text>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  variant="solid"
                  backgroundColor="#5ED9D1"
                  borderRadius="5px"
                  onClick={() => handleThemeSelection("Dark")}
                >
                  Choose
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>

          <br />

          <Card
            className="card"
            maxW="sm"
            marginRight="10px"
            background="linear-gradient(90deg, rgba(212,141,160,1) 0%, rgba(155,38,142,0.46406687675070024) 100%, rgba(046,161,165,1) 100%)"
            outline={choosenTheme === "Gradient" ? '3px solid pink' : undefined}
            color="white"
          >
            <CardBody>
              <Image
                borderRadius="10px"
                src="/images/Koii-Gradient.png"
                alt="Green double couch with wooden legs"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">Koii Gradient</Heading>
                <Text>Blending hues like a playful artist.</Text>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  variant="solid"
                  backgroundColor="#FFA6A6"
                  onClick={() => handleThemeSelection("Gradient")}
                >
                  Choose
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </>
      </Flex>

      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight={{ base: "bold", md: "normal" }}
        my={5}
      >
        Enter your details
      </Text>

      <Formik
        initialValues={{
          name: "",
          description: "",
          image: null,
          background: "",
          links: [linksGroup],
        }}
        validationSchema={object({
          name: string().required("Full name is required"),
          description: string()
            .min(5, "Bio is too short!")
            .max(400, "Bio is too Long")
            .required("A short bio is required"),
          linktreeAddress: string()
            .min(5, "Address is too short!")
            .max(200, "Address is too Long")
            .required("An address is required."),
          image: mixed().nullable().required("Upload a profile image"),
          links: array(
            object({
              label: string().required("Link label is required"),
              redirectUrl: string()
                .required("Link URL is required")
                .matches(
                  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                  "Enter correct url!"
                ),
            })
          )
            .min(1, "At least one link is required!")
            .required("Add a social link"),
        })}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Box mb={3}>
                <Text>
                  Full Name<span className="error">*</span>
                </Text>
                <Field
                  name="name"
                  label="Full Name"
                  as={Input}
                  className="input-border"
                />
                <Text className="error">
                  <ErrorMessage name="name" />
                </Text>
              </Box>

              <div>
                <Text>
                  Short Bio<span className="error">*</span>
                </Text>
                <Field
                  name="description"
                  label="Bio"
                  as={Textarea}
                  height="150px"
                  className="input-border"
                />
                <Text className="error">
                  <ErrorMessage name="description" />
                </Text>
              </div>

              {image && (
                <PreviewImage
                  className={{ margin: "auto" }}
                  width={100}
                  height={100}
                  file={image}
                />
              )}

              <div
                style={{
                  backgroundColor: "#efefef",
                  padding: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <Field name="image">
                  {({ form, field }) => {
                    const { setFieldValue } = form;
                    return (
                      <input
                        type="file"
                        className="form-control"
                        required
                        onChange={async (e) => {
                          setFiles(e.target.files);
                          setImage(e.target.files[0]);
                          setImageName(e.target.files[0].name);
                          setFieldValue("image", e.target.files[0].name);
                        }}
                      />
                    );
                  }}
                </Field>
                <Text className="error">
                  <ErrorMessage name="image" />
                </Text>
              </div>
            </div>

            <FieldArray name="links">
              {({ push, remove }) => (
                <div>
                  <div>
                    <Text fontSize="2xl" mt={5}>
                      Add Social Links
                    </Text>
                  </div>
                  {values.links.map((_, index) => (
                    <Flex
                      flexDirection={{ base: "column", md: "row" }}
                      key={index}
                      mt={2}
                      alignItems={{ base: "end", md: "center" }}
                    >
                      <Box w={{ base: "100%", md: "45%" }}>
                        <Text>
                          Link Label<span className="error">*</span>
                        </Text>
                        <Field
                          name={`links.${index}.label`}
                          label="Link Name"
                          as={Input}
                          className="input-border"
                        />
                        <Text className="error">
                          <ErrorMessage name={`links.${index}.label`} />
                        </Text>
                      </Box>
                      <Spacer />
                      <Box w={{ base: "100%", md: "45%" }}>
                        <Text>
                          Link URL<span className="error">*</span>
                        </Text>
                        <Field
                          className="input-border"
                          name={`links.${index}.redirectUrl`}
                          label="Link URL"
                          as={Input}
                        />
                        <Text className="error">
                          <ErrorMessage name={`links.${index}.redirectUrl`} />
                        </Text>
                      </Box>
                      <Spacer />
                      {index === 0 ? (
                        <div>
                          <IconButton
                            isDisabled
                            rounded="full"
                            alignSelf={{ base: "flex-end", lg: "" }}
                            marginTop="10px"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                          />
                        </div>
                      ) : (
                        <div>
                          <IconButton
                            rounded="full"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            marginTop="10px"
                            alignSelf={{ base: "flex-end", lg: "" }}
                            onClick={() => remove(index)}
                          />
                        </div>
                      )}
                    </Flex>
                  ))}
                  <Button
                    mt={4}
                    leftIcon={<AddIcon />}
                    color="var(--koii-white)"
                    rounded="full"
                    borderColor="var(--koii-white)"
                    variant="outline"
                    onClick={() => push(linksGroup)}
                  >
                    Add Link
                  </Button>

                  <Box mt={10}>
  
                      <Text fontSize="2xl" mt={5}>
                        Linktree Address
                      </Text>
                    
                    <Box display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="m" mr={2}>
                        linktree.koii.network/   
                      </Text>
                    <Field
                      name="linktreeAddress"
                      label="Linktree Address"
                      as={Input}
                      className="input-border"
                    />
                    </Box>

                    <Text className="error">
                      <ErrorMessage name="linktreeAddress" />
                    </Text>

                  </Box>
                </div>
              )}
            </FieldArray>

            <Button
              w="full"
              rounded="full"
              color="var(--koii-blue)"
              bg="var(--koii-white)"
              my={10}
              type="submit"
            >
              {isLoading ? <Spinner /> : "Submit"}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateLinktree;
