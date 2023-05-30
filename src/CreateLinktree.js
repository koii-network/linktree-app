import React, { useState } from "react";
import { Formik, ErrorMessage, Field, FieldArray } from "formik";
import { array, object, string, mixed } from "yup";
import { Web3Storage, File } from "web3.storage";
import { Buffer } from "buffer";
import {
  Box,
  Button,
  Flex,
  Input,
  IconButton,
  Text,
  Textarea,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

function makeStorageClient() {
  return new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_TOKEN });
}

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    setPreview(reader.result);
  };

  return (
    <Box mt={5} display={"flex"} justifyContent={"center"}>
      <img src={preview} alt={"User"} className="user-image" />
    </Box>
  );
};

const CreateLinktree = () => {
  const [image, setImage] = useState(null);
  const linksGroup = { label: "", redirectUrl: "" };

  const uploadToIPFS = async (values) => {
    console.log(values);
    try {
      const buffer = Buffer.from(JSON.stringify(values));
      const files = [new File([buffer], "data.json"), image];
      const client = makeStorageClient();
      const cid = await client.put(files);
      console.log(cid);
      if (cid !== undefined) {
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box py={{ base: '8rem', md: '5rem' }} px={8} className="createLinktree">
      <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight={{ base: "bold", md: "normal" }} my={5}>
        Create Your Koii Linktree Profile
      </Text>
      <Formik
        initialValues={{
          public_key: "",
          firstname: "",
          lastname: "",
          bio: "",
          profile_image: null,
          links: [linksGroup],
        }}
        validationSchema={object({
          public_key: string()
            .required("Public Key is required")
            .max(42, "Public Key must be at least 42 characters")
            .min(42, "Public Key must be at least 42 characters"),
          firstname: string().required("First name is required"),
          lastname: string().required("Last name is required"),
          bio: string()
            .min(5, "Bio is too short!")
            .max(400, "Bio is too Long")
            .required("A short bio is required"),
          profile_image: mixed().nullable().required("Upload a profile image"),
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
            .min(1, "Atleast one link is required!")
            .required("Add a social link"),
        })}
        onSubmit={async (values, actions) => {
          console.log("called");
          await uploadToIPFS(values);
        }}
      >
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Box mb={3}>
                <Text>
                  Public Key<span className="error">*</span>
                </Text>
                <Field
                  fullWidth
                  name="public_key"
                  label="PublicKey"
                  as={Input}
                />
                <Text className="error">
                  <ErrorMessage name={"public_key"} />
                </Text>
              </Box>
              <Flex flexDirection={{ base: "column", md: "row" }} mb={3}>
                <Box w={{ base: "100%", md: "48%" }}>
                  {" "}
                  <Text>
                    First Name<span className="error">*</span>
                  </Text>
                  <Field name="firstname" label="First Name" as={Input} />
                  <Text className="error">
                    <ErrorMessage name={"firstname"} />
                  </Text>
                </Box>
                <Spacer />
                <Box w={{ base: "100%", md: "48%" }}>
                  <Box>
                    {" "}
                    <Text>
                      Last Name<span className="error">*</span>
                    </Text>
                  </Box>
                  <Field name="lastname" label="Last Name" as={Input} />
                  <Text className="error">
                    <ErrorMessage name={"lastname"} />
                  </Text>
                </Box>
              </Flex>

              <div>
                <Text>
                  Short Bio<span className="error">*</span>
                </Text>
                <Field name="bio" label="Bio" as={Textarea} height="150px" />
                <Text className="error">
                  <ErrorMessage name={"bio"} />
                </Text>
              </div>
              {image ? (
                <PreviewImage
                  className={{ margin: "auto" }}
                  width={100}
                  height={100}
                  file={image}
                />
              ) : null}
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
                <Field name="profile_image">
                  {({ form, field }) => {
                    const { setFieldValue } = form;
                    return (
                      <input
                        type="file"
                        className="form-control"
                        required
                        onChange={(e) => {
                          setFieldValue(
                            "profile_image",
                            e.target.files[0].name
                          );
                          setImage(e.target.files[0]);
                        }}
                      />
                    );
                  }}
                </Field>
                <Text className="error">
                  <ErrorMessage name={"profile_image"} />
                </Text>
              </div>
            </div>
            <FieldArray name="links">
              {({ push, remove }) => (
                <div>
                  <div>
                    <Text fontSize={"2xl"} mt={5}>
                      Add Social Links
                    </Text>
                  </div>
                  {values.links.map((_, index) => (
                    <Flex
                      flexDirection={{ base: "column", md: "row" }}
                      key={index}
                      mt={2}
                      alignItems={"center"}
                    >
                      <Box w={{ base: "100%", md: "45%" }}>
                        <Text>
                          Link Label<span className="error">*</span>
                        </Text>
                        <Field
                          name={`links.${index}.label`}
                          label="Link Name"
                          as={Input}
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
                          name={`links.${index}.redirectUrl`}
                          label="Link URL"
                          as={Input}
                        />
                        <Text className="error">
                          <ErrorMessage name={`links.${index}.redirectUrl`} />
                        </Text>
                      </Box>
                      {index === 0 && (
                        <>
                          <Spacer />
                          <IconButton
                            isDisabled
                            alignSelf={"flex-end"}
                            rounded={"full"}
                            icon={<DeleteIcon />}
                            colorScheme="red"
                          />
                        </>
                      )}
                      {index > 0 && (
                        <>
                          <Spacer />
                          <IconButton
                            alignSelf={"flex-end"}
                            rounded={"full"}
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            onClick={() => remove(index)}
                          />
                        </>
                      )}
                    </Flex>
                  ))}{" "}
                  <Button
                    mt={4}
                    leftIcon={<AddIcon />}
                    color="#5ed9d1"
                    rounded={"full"}
                    borderColor={"#5ed9d1"}
                    variant="outline"
                    onClick={() => push(linksGroup)}
                  >
                    Add Link
                  </Button>
                </div>
              )}
            </FieldArray>
            <Button
              w="full"
              rounded="full"
              color="#171753"
              bg="#5ed9d1"
              my={10}
              type="submit"
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateLinktree;
