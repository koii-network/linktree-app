import React from "react";
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
} from "@chakra-ui/react";
import { Formik, ErrorMessage, Field, FieldArray } from "formik";
import { array, object, string, mixed, boolean } from "yup";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import "../../css/ButtonAnimations.css";
import { PreviewImage } from "./preview-image";
import UploadSvg from "../icons/upload";
import ProfileImageSvg from "../icons/profile-image";
import { PersonalizeLinktree } from "./personalize-linktree";

function LinktreeForm({
  choosenLabelTheme,
  choosenTheme,
  linksGroup,
  image,
  handleSubmit,
  setFiles,
  setImage,
  setImageName,
  handleChangeUserName,
  usernameError,
  disabled,
  isLoading,
  handleLabelSelection,
  handleThemeSelection,
  colorScheme,
}) {
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        image: null,
        background: "",
        links: [linksGroup],
        linktreeAddress: "",
      }}
      validationSchema={object({
        name: string().required("Name is required"),
        description: string()
          .min(5, "Bio is too short!")
          .max(400, "Bio is too Long")
          .required("A bio is required"),
        linktreeAddress: string()
          .min(5, "Address is too short!")
          .max(200, "Address is too Long")
          .required("An address is required."),
        image: mixed().nullable().required("Upload a profile image"),
        links: array(
          object({
            label: string().required("Link label is required"),
            redirectUrl: string().required("Link URL is required").matches(
              "^(http(s)://.)",

              "Enter correct url!"
            ),
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
          <Box width='100%'>
            <Box
              mt={5}
              display='flex'
              width='100%'
              gap={{ base: "20px", md: "40px" }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box maxWidth={{ base: "auto", md: "20%" }} width='100%'>
                {image ? (
                  <PreviewImage width={100} height={100} file={image} />
                ) : (
                  <div className='user-image'>
                    <ProfileImageSvg />
                  </div>
                )}
              </Box>

              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                maxW={{ md: "80%" }}
                width='100%'
              >
                <Flex
                  flexDirection={{ base: "column-reverse", md: "column" }}
                  width='100%'
                >
                  <Box mb={{ base: 3 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
                      }}
                    >
                      <Text
                        wordBreak='keep-all'
                        color='var(--koii-create-text)'
                        width={{ base: "120px", md: "auto" }}
                      >
                        Your Name
                      </Text>
                      <Box width={{ base: "100%", md: "75%" }}>
                        <Field
                          name='name'
                          label='Full Name'
                          color='var(--koii-blue)'
                          as={Input}
                          className='input-border'
                          style={{
                            borderRadius: "30px",
                            backgroundColor: "white",
                          }}
                          border='1.5px solid #6B5FA5'
                        />
                      </Box>
                    </div>

                    <Text className='error'>
                      <ErrorMessage name='name' />
                    </Text>
                  </Box>

                  <Box mb={{ base: 3, md: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
                      }}
                    >
                      <Text
                        wordBreak='keep-all'
                        color='var(--koii-create-text)'
                      >
                        Profile Photo
                      </Text>
                      <Field name='image'>
                        {({ form, field }) => {
                          const { setFieldValue } = form;
                          return (
                            <label class='custom-file-upload'>
                              <input
                                type='file'
                                required
                                onChange={async (e) => {
                                  setFiles(e.target.files);
                                  setImage(e.target.files[0]);
                                  setImageName(e.target.files[0].name);
                                  setFieldValue(
                                    "image",
                                    e.target.files[0].name
                                  );
                                }}
                                style={{
                                  display: "none",
                                }}
                              />
                              <UploadSvg />
                              Upload Photo
                            </label>
                          );
                        }}
                      </Field>
                    </div>
                    <Text className='error'>
                      <ErrorMessage name='image' />
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box
              display='flex'
              gap='12px'
              justifyContent='flex-start'
              alignItems='flex-start'
              marginTop='40px'
            >
              <Text color='var(--koii-create-text)'>Bio</Text>
              <Field
                borderRadius='30px'
                name='description'
                label='Bio'
                background='var(--koii-input-bg-color)'
                color='var(--koii-create-text)'
                as={Textarea}
                height='150px'
                className='input-border'
                border='1.5px solid #6B5FA5'
              />
            </Box>
            <Text className='error'>
              <ErrorMessage name='description' />
            </Text>

            <Text fontSize='m' mt={10} mr={2} color='var(--koii-create-topic)'>
              Linktree URL:
            </Text>
            <Flex alignItems={"center"}>
              <Text mr={3} color='var(--koii-create-text)'>
                linktree.koii.network/
              </Text>
              <Field name='linktreeAddress'>
                {({ form, field }) => {
                  const { setFieldValue } = form;
                  return (
                    <input
                      style={{
                        color: "black",
                        background: "white",
                        borderRadius: "20px",
                      }}
                      type='text'
                      className='input-border input-container'
                      required
                      name='linktreeAddress'
                      borderWidth='1.5px'
                      onChange={async (e) => {
                        // handleChangeUserName(e);
                        setFieldValue("linktreeAddress", e.target.value);
                      }}
                      onKeyUp={handleChangeUserName}
                    />
                  );
                }}
              </Field>
            </Flex>
            <Box mt={5}>
              <Text className='error'>
                <ErrorMessage name='linktreeAddress' />
              </Text>
              <Text className='error'>{usernameError}</Text>
            </Box>
          </Box>

          <FieldArray name='links'>
            {({ push, remove }) => (
              <div>
                <div>
                  <Text
                    fontSize='18px'
                    fontFamily='Sora'
                    fontStyle='normal'
                    fontWeight={600}
                    lineHeight='21px'
                    letterSpacing='0.36px'
                    mt={5}
                    mb={3}
                    color='var(--koii-create-topic)'
                  >
                    Add Your Links
                  </Text>
                </div>
                {values.links.map((_, index) => (
                  <Box>
                    {values.links.length > 1 && index > 0 && (
                      <Text
                        padding='0px 0px 10px'
                        color='var(--koii-create-text)'
                      >
                        Link #{index + 1}
                      </Text>
                    )}
                    {index === 0 && (
                      <Box className='chooseAnimation'>
                        <Text
                          fontSize='16px'
                          fontFamily='Sora'
                          fontStyle='normal'
                          fontWeight={400}
                          lineHeight='20px'
                          letterSpacing='-0.16px'
                          color='var(--koii-create-text)'
                        >
                          Your Primary Link
                        </Text>

                        <Text
                          fontSize='12px'
                          mb={5}
                          color={
                            choosenTheme === "Gradient-Two"
                              ? "#353570"
                              : "var(--koii-border-color)"
                          }
                        >
                          Your primary link will stand out with a different
                          color{" "}
                        </Text>
                      </Box>
                    )}
                    <Box width='100%'>
                      <Flex
                        width='100%'
                        flexDirection={{ base: "column", md: "row" }}
                        key={index + 1}
                        mt={2}
                        alignItems={{ base: "end", md: "center" }}
                      >
                        <Box w={{ base: "100%", md: "40%" }}>
                          <Box
                            w='100%'
                            display='flex'
                            alignItems='center'
                            gap='10px'
                          >
                            <Text
                              color='var(--koii-create-text)'
                              width={{ base: "150px", md: "auto" }}
                            >
                              Link “Label”
                            </Text>
                            <Field
                              color='var(--koii-create-text)'
                              background='var(--koii-input-bg-color)'
                              style={{
                                borderRadius: "20px",
                                color: "var(--koii-create-text)",
                              }}
                              name={`links.${index}.label`}
                              label='Link Name'
                              as={Input}
                              className='input-border'
                              borderRadius={30}
                              width={{ base: "100%", md: "60%" }}
                            />
                          </Box>
                          <Box
                            w={{ base: "100%", md: "40%" }}
                            display={{ base: "flex", md: "none" }}
                          >
                            <Text className='error'>
                              <ErrorMessage name={`links.${index}.label`} />
                            </Text>
                          </Box>
                        </Box>
                        <Spacer />
                        <Box
                          w={{ base: "100%", md: "58%" }}
                          mt={{ base: "24px", md: "0px" }}
                        >
                          <Box
                            w='100%'
                            display='flex'
                            alignItems='center'
                            gap='10px'
                          >
                            <Text
                              color='var(--koii-create-text)'
                              width={{ base: "150px", md: "auto" }}
                            >
                              Link “URL”
                            </Text>
                            <Field
                              color='var(--koii-create-text)'
                              background='var(--koii-input-bg-color)'
                              style={{
                                borderRadius: "20px",
                                color: "var(--koii-create-text)",
                              }}
                              className='input-border'
                              name={`links.${index}.redirectUrl`}
                              label='Link URL'
                              as={Input}
                              borderRadius={30}
                              width={{
                                base: "100%",
                                md: `70%`,
                              }}
                            />
                          </Box>
                          <Box
                            w={{ base: "100%", md: "58%" }}
                            display={{ base: "flex", md: "none" }}
                          >
                            <Text className='error'>
                              <ErrorMessage
                                name={`links.${index}.redirectUrl`}
                              />
                            </Text>
                          </Box>
                        </Box>
                        {index === 0 ? (
                          <div>
                            {" "}
                            <IconButton
                              rounded='full'
                              icon={<DeleteIcon />}
                              opacity={0}
                              colorScheme='red'
                              alignSelf={{ base: "flex-end", lg: "" }}
                            />
                          </div>
                        ) : (
                          <div>
                            <IconButton
                              rounded='full'
                              icon={<DeleteIcon />}
                              colorScheme='red'
                              alignSelf={{ base: "flex-end", lg: "" }}
                              onClick={() => remove(index)}
                            />
                          </div>
                        )}
                      </Flex>
                      <Flex
                        width='100%'
                        flexDirection={{ base: "column", md: "row" }}
                        key={index}
                        mt='4px'
                        display={{ base: "none", md: "flex" }}
                        alignItems={{ base: "end", md: "center" }}
                      >
                        <Box w={{ base: "100%", md: "40%" }}>
                          <Text className='error'>
                            <ErrorMessage name={`links.${index}.label`} />
                          </Text>
                        </Box>
                        <Spacer />
                        <Box w={{ base: "100%", md: "58%" }}>
                          <Text className='error'>
                            <ErrorMessage name={`links.${index}.redirectUrl`} />
                          </Text>
                        </Box>
                      </Flex>
                      <Spacer />
                    </Box>
                    {index === 0 && <></>}
                    {values.links.length > 1 && index === 0 && (
                      <Text padding='30px 0px 30px'>Other Links</Text>
                    )}
                  </Box>
                ))}
                <Button
                  mt={4}
                  leftIcon={<AddIcon />}
                  rounded='full'
                  borderColor='var(--koii-border-color)'
                  color={
                    choosenTheme === "Gradient-Two"
                      ? "#353570"
                      : "var(--koii-border-color)"
                  }
                  variant='outline'
                  onClick={() => push(linksGroup)}
                  padding={6}
                  opacity='1'
                  backgroundColor={"var(--koii-input-bg-color)"}
                >
                  Add Link
                </Button>
                {/* Other "Add Link" buttons go here */}
              </div>
            )}
          </FieldArray>

          <PersonalizeLinktree
            colorScheme={colorScheme}
            choosenTheme={choosenTheme}
            handleThemeSelection={handleThemeSelection}
            handleLabelSelection={handleLabelSelection}
            values={values}
            choosenLabelTheme={choosenLabelTheme}
          />
          <Flex w='100%' alignItems='center' flexDirection='column'>
            <Button
              w='full'
              maxW='254px'
              rounded='full'
              color={
                choosenTheme === "Gradient-Two"
                  ? "#353570"
                  : "var(--koii-button-upload)"
              }
              bg={
                choosenTheme === "Gradient-Two"
                  ? "#FFEE81"
                  : "var(--koii-button-upload-bg)"
              }
              mx='auto'
              my={10}
              type='submit'
              isDisabled={disabled}
              alignSelf='center'
            >
              {isLoading ? <Spinner /> : "Register My KoiiLink"}
            </Button>
            <Text
              color={
                choosenTheme === "Gradient-Two"
                  ? "#353570"
                  : "var(--koii-border-color)"
              }
            >
              4 KOII would be withdrawn to create a linktree profile
            </Text>
          </Flex>
        </form>
      )}
    </Formik>
  );
}

export default LinktreeForm;
