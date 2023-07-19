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
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Formik, ErrorMessage, Field, FieldArray } from "formik";
import { array, object, string, mixed, boolean } from "yup";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import "../../css/ButtonAnimations.css";
import UploadSvg from "../icons/upload";

function LinktreeEditForm({
  choosenLabelTheme,
  choosenTheme,
  linksGroup,
  handleSubmit,
  userData,
  isLoading,
  handleLabelSelection,
  handleThemeSelection,
  files,
  getInputProps,
  getRootProps,
}) {
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
              <Box
                maxWidth={{ base: "auto", md: "20%" }}
                mx={{ base: "auto", md: "0" }}
                width='100%'
              >
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
                display='flex'
                alignItems='center'
                justifyContent='center'
                maxW={{ md: "80%" }}
                width='100%'
              >
                <Flex flexDirection={"column"} width='100%'>
                  <Box mb={3}>
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

                  <div>
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
                            <label
                              class='custom-file-upload'
                              {...getRootProps({
                                className: "dropzone custom-file-upload",
                              })}
                            >
                              <input
                                type='file'
                                required
                                {...getInputProps()}
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
                  </div>
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
              <Field
                name='linktreeAddress'
                style={{
                  color: "black",
                  background: "white",
                  borderRadius: "20px",
                }}
                type='text'
                className='input-border input-container'
                required
                value={userData?.linktreeAddress}
              />
            </Flex>
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
                          mb={5}
                          color={
                            choosenTheme === "Gradient-Two"
                              ? "#353570"
                              : "var(--koii-border-color)"
                          }
                          fontSize='12px'
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
                        key={index}
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
                              color='black'
                              backgroundColor='white'
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
                              color='black'
                              backgroundColor='white'
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
            Personalize Your Linktree
          </Text>

          <Flex
            color='white'
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "flex-end" }}
            width='100%'
          >
            <Box maxW={{ base: "100%", md: "280px" }}>
              <Text
                fontSize='12px'
                fontFamily='Sora'
                fontStyle='normal'
                fontWeight={400}
                lineHeight='21px'
                letterSpacing='0.36px'
                color='var(--koii-create-text)'
                alignItems='center'
              >
                Background color themes
              </Text>
              <Text
                fontSize='12px'
                fontFamily='Sora'
                fontStyle='normal'
                fontWeight={400}
                lineHeight='16px'
                color='var(--koii-create-text)'
                alignItems='center'
                mt='10px'
              >
                This will determine your background color, buttons and other
                graphic elements.
              </Text>
            </Box>
            <Box
              width={{ base: "100%", md: "auto" }}
              mt={{ base: "20px", md: "0px" }}
            >
              <Stack spacing={5}>
                <RadioGroup
                  onChange={handleThemeSelection}
                  value={choosenTheme}
                >
                  <Stack direction='row'>
                    <Radio
                      value='Mint'
                      colorScheme='teal'
                      size='lg'
                      borderColor='var(--koii-border-color)'
                    >
                      <Box
                        p='4'
                        width={50}
                        borderRadius={20}
                        color='black'
                        borderWidth={choosenTheme === "Mint" ? "2px" : "1px"}
                        borderColor={
                          choosenTheme === "Mint"
                            ? "black"
                            : "var(--koii-border-theme-color)"
                        }
                        backgroundColor='#C7F2EF'
                      ></Box>
                    </Radio>

                    <Radio
                      value='Dark'
                      colorScheme='purple'
                      size='lg'
                      borderColor='var(--koii-border-color)'
                    >
                      <Box
                        p='4'
                        width={50}
                        borderRadius={20}
                        color='white'
                        borderWidth={choosenTheme === "Dark" ? "2px" : "1px"}
                        borderColor={
                          choosenTheme === "Dark"
                            ? "white"
                            : "var(--koii-border-theme-color)"
                        }
                        backgroundColor='#171753'
                      ></Box>
                    </Radio>

                    <Radio
                      value='Gradient'
                      colorScheme='pink'
                      size='lg'
                      borderColor='var(--koii-border-color)'
                    >
                      <Box
                        width={50}
                        borderRadius={20}
                        p='4'
                        color='white'
                        borderWidth={
                          choosenTheme === "Gradient" ? "2px" : "1px"
                        }
                        borderColor={
                          choosenTheme === "Gradient"
                            ? "pink"
                            : "var(--koii-border-theme-color)"
                        }
                        background='linear-gradient(180deg, #8989C7 0%, #5ED9D1 100%);'
                      ></Box>
                    </Radio>
                    <Radio
                      value='Gradient-Two'
                      colorScheme='teal'
                      size='lg'
                      borderColor='var(--koii-border-color)'
                    >
                      <Box
                        p='4'
                        width={50}
                        borderRadius={20}
                        color='black'
                        borderWidth={
                          choosenTheme === "Gradient-Two" ? "2px" : "1px"
                        }
                        borderColor={
                          choosenTheme === "Gradient-Two"
                            ? "black"
                            : "var(--koii-border-theme-color)"
                        }
                        background='linear-gradient(180deg, #FFEE81 0.01%, #FFA6A6 100%)'
                      ></Box>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
            </Box>
          </Flex>
          <Box
            display='flex'
            alignItems={{ base: "flex-start", md: "center" }}
            justifyItemsItems={{ base: "flex-start", md: "center" }}
            gap={{ base: "10px", md: "30px" }}
            flexDirection={{ base: "column", md: "row" }}
            width='100%'
            mt='30px'
          >
            <Text
              fontSize='12px'
              fontFamily='Sora'
              fontStyle='normal'
              fontWeight={400}
              lineHeight='21px'
              letterSpacing='0.36px'
              color='var(--koii-create-text)'
              width='50%'
            >
              Choose Your Primary Link Style
            </Text>
            <Flex gap='10'>
              <RadioGroup
                onChange={handleLabelSelection}
                value={choosenLabelTheme}
              >
                <Stack direction='row'>
                  <Radio
                    value='label-one'
                    colorScheme='teal'
                    size='lg'
                    borderColor='var(--koii-label-one-border-color)'
                  >
                    <Button
                      backgroundColor='var(--koii-label-one-color)'
                      background='var(--koii-label-one-color)'
                      color='var(--koii-label-two-text-color)'
                      width={100}
                      borderRadius={30}
                      mr={10}
                      borderWidth='2px'
                      borderColor='var(--koii-label-one-border-color)'
                    >
                      {values?.links[0]?.label || "Label"}
                    </Button>
                  </Radio>

                  <Radio
                    value='label-two'
                    colorScheme='purple'
                    size='lg'
                    borderColor='var(--koii-label-two-border-color)'
                  >
                    <Button
                      width={100}
                      backgroundColor='var(--koii-label-two-color)'
                      background='var(--koii-label-two-color)'
                      color='var(--koii-label-two-text-color)'
                      borderRadius={30}
                      mr={10}
                      borderWidth='2px'
                      borderColor='var(--koii-label-two-border-color)'
                    >
                      {values?.links[0]?.label || "Label"}
                    </Button>
                  </Radio>

                  <Radio
                    value='label-three'
                    colorScheme='pink'
                    size='lg'
                    borderColor='var(--koii-label-three-border-color)'
                  >
                    <Button
                      width={100}
                      backgroundColor='var(--koii-label-three-color)'
                      background='var(--koii-label-three-color)'
                      color='var(--koii-label-three-text-color)'
                      borderRadius={30}
                      borderWidth='2px'
                      borderColor='var(--koii-label-three-border-color)'
                    >
                      {values?.links[0]?.label || "Label"}
                    </Button>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </Box>
          <Flex w='100%' alignItems='center'>
            <Button
              w='full'
              maxW='254px'
              rounded='full'
              mx='auto'
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
              my={10}
              type='submit'
            >
              {isLoading ? <Spinner /> : "Save Changes"}
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
}

export default LinktreeEditForm;