import React from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

export const PersonalizeLinktree = ({
  colorScheme,
  choosenTheme,
  handleThemeSelection,
  handleLabelSelection,
  values,
  choosenLabelTheme,
}) => {
  return (
    <>
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
        gap={{ base: "10px", md: "5px" }}
      >
        <Box maxW={{ base: "100%", md: "40%" }}>
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
            This will determine your background color, buttons and other graphic
            elements.
          </Text>
        </Box>
        <Box
          width={{ base: "100%", md: "60%" }}
          mt={{ base: "20px", md: "0px" }}
        >
          <Stack width='100%'>
            <RadioGroup
              onChange={handleThemeSelection}
              value={choosenTheme}
              width='100%'
            >
              <Stack
                direction='row'
                gap='10px'
                justifyContent='space-between'
                width='100%'
              >
                <Radio
                  value='Mint'
                  colorScheme={colorScheme}
                  size='lg'
                  borderColor='var(--koii-border-color)'
                >
                  <Box
                    p='4'
                    width='70px'
                    borderRadius={20}
                    color='black'
                    borderWidth={choosenTheme === "Mint" ? "2px" : "1px"}
                    borderColor={"var(--koii-border-color)"}
                    backgroundColor='#C7F2EF'
                  ></Box>
                </Radio>

                <Radio
                  value='Dark'
                  colorScheme={colorScheme}
                  size='lg'
                  borderColor='var(--koii-border-color)'
                >
                  <Box
                    p='4'
                    width='70px'
                    borderRadius={20}
                    color='white'
                    borderWidth={choosenTheme === "Dark" ? "2px" : "1px"}
                    borderColor={"var(--koii-border-color)"}
                    backgroundColor='#171753'
                  ></Box>
                </Radio>

                <Radio
                  value='Gradient'
                  colorScheme={colorScheme}
                  size='lg'
                  borderColor='var(--koii-border-color)'
                >
                  <Box
                    width='70px'
                    borderRadius={20}
                    p='4'
                    color='white'
                    borderWidth={choosenTheme === "Gradient" ? "2px" : "1px"}
                    borderColor={"var(--koii-border-color)"}
                    background='linear-gradient(180deg, #8989C7 0%, #5ED9D1 100%)'
                  ></Box>
                </Radio>

                <Radio
                  value='Gradient-Two'
                  colorScheme={colorScheme}
                  size='lg'
                  borderColor='var(--koii-border-color)'
                >
                  <Box
                    p='4'
                    width='70px'
                    borderRadius={20}
                    color='black'
                    borderWidth={
                      choosenTheme === "Gradient-Two" ? "2px" : "1px"
                    }
                    borderColor={"var(--koii-border-color)"}
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
        gap={{ base: "10px", md: "5px" }}
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
          width={{ md: "40%" }}
        >
          Choose Your Primary Link Style
        </Text>
        <Flex gap='10' width={{ base: "100%", md: "60%" }}>
          <RadioGroup
            onChange={handleLabelSelection}
            value={choosenLabelTheme}
            width='100%'
          >
            <Stack
              direction='row'
              gap='10px'
              justifyContent='space-between'
              width='100%'
            >
              <Radio
                value='label-one'
                colorScheme={colorScheme}
                size={{ base: "md", md: "lg" }}
                borderColor='var(--koii-label-one-border-color)'
              >
                <Button
                  backgroundColor='var(--koii-label-one-color)'
                  background='var(--koii-label-one-color)'
                  color='var(--koii-label-one-text-color)'
                  width='100px'
                  borderRadius={30}
                  borderWidth='2px'
                  borderColor='var(--koii-label-one-border-color)'
                >
                  {values?.links[0]?.label || "Label"}
                </Button>
              </Radio>

              <Radio
                value='label-two'
                colorScheme={colorScheme}
                size={{ base: "md", md: "lg" }}
                borderColor='var(--koii-label-two-border-color)'
              >
                <Button
                  width='100px'
                  backgroundColor='var(--koii-label-two-color)'
                  background='var(--koii-label-two-color)'
                  color='var(--koii-label-two-text-color)'
                  borderRadius={30}
                  borderWidth='2px'
                  borderColor='var(--koii-label-two-border-color)'
                >
                  {values?.links[0]?.label || "Label"}
                </Button>
              </Radio>

              <Radio
                value='label-three'
                colorScheme={colorScheme}
                size={{ base: "md", md: "lg" }}
                borderColor='var(--koii-label-three-border-color)'
              >
                <Button
                  width='100px'
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
    </>
  );
};
