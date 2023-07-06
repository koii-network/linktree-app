import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { DOWNLOAD_FINNIE_URL } from "../../config";

function GetFinnieModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        fontFamily='Sora, sans-serif'
        maxWidth='225px'
        w='100%'
        backgroundColor={"#5ED9D1"}
        color={"white"}
        borderRadius={20}
        boxShadow='0px 4px 4px 0px #17175380'
        marginTop='16px'
        border='1.5px solid #5ED9D1'
        onClick={onOpen}
      >
        I don’t have Finnie
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent
          maxW='660px'
          width='100%'
          dropShadow='2px 7px 10px 0px #17175340'
          bgColor='#6B5FA5'
          color='#FFFFFF'
        >
          <ModalHeader padding='0px'>
            <Box
              padding='21px'
              width='100%'
              position='relative'
              justifyContent='center'
              justifyItems='center'
              display='flex'
              boxShadow='0px 2px 8px 0px #00000029;'
              fontFamily='sora'
              fontSize='20px'
              lineHeight='24px'
              fontWeight='600'
            >
              <p>Create your Finnie Wallet</p>
              <Button
                onClick={onClose}
                position='absolute'
                right='16px'
                top='16px'
                cursor='pointer'
                bg='transparent'
                _hover={{
                  bg: "transparent",
                }}
              >
                <svg
                  width='25'
                  height='24'
                  viewBox='0 0 36 35'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M17.8 1.39586C8.90288 1.39586 1.69591 8.60283 1.69591 17.5C1.69591 26.3972 8.90288 33.6041 17.8 33.6041C26.6972 33.6041 33.9042 26.3972 33.9042 17.5C33.9042 8.60283 26.6972 1.39586 17.8 1.39586ZM0.300049 17.5C0.300049 7.83192 8.13196 0 17.8 0C27.4681 0 35.3 7.83192 35.3 17.5C35.3 27.1681 27.4681 35 17.8 35C8.13196 35 0.300049 27.1681 0.300049 17.5Z'
                    fill='white'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M11.6661 11.5736C11.9386 11.301 12.3806 11.301 12.6531 11.5736L24.0268 22.9473C24.2994 23.2198 24.2994 23.6617 24.0268 23.9343C23.7543 24.2069 23.3124 24.2069 23.0398 23.9343L11.6661 12.5606C11.3935 12.288 11.3935 11.8461 11.6661 11.5736Z'
                    fill='white'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M24.0268 11.5736C24.2994 11.8461 24.2994 12.288 24.0268 12.5606L12.6531 23.9343C12.3806 24.2069 11.9386 24.2069 11.6661 23.9343C11.3935 23.6617 11.3935 23.2198 11.6661 22.9473L23.0398 11.5736C23.3124 11.301 23.7543 11.301 24.0268 11.5736Z'
                    fill='white'
                  />
                </svg>
              </Button>
            </Box>
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody maxW='416px' mx='auto' padding='20px 24px 40px'>
            explain why you should get finnie and how linktree will be so cool
            when you do! Hello
          </ModalBody>
          <ModalFooter>
            <Box
              width='100%'
              display='flex'
              alignItems='center'
              justifyItems='center'
              justifyContent='center'
              pb='10px'
            >
              <Button
                fontFamily='Sora, sans-serif'
                maxWidth='163px'
                w='100%'
                backgroundColor={"#5ED9D1"}
                color={"#4D3D8D"}
                fontWeight='600px'
                borderRadius={20}
              >
                <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
                  Get finnie
                </a>
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GetFinnieModal;
