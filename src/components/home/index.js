import React from "react";
import "../../App.css";
import { Text, Button, Box, Image } from "@chakra-ui/react";
import koiiChatFish from "../../pages/images/koiiChat.svg";
import GetFinnieModal from "../modals";

const HomeComponent = ({
  isMobile,
  handleConnectFinnie,
  connectButtonText,
  total,
}) => {
  return (
    <div className='Home'>
      <div className='psuedoBackground'></div>
      <div className='container public-key-input-container'>
        <div className='auth-user'>
          <>
            {isMobile ? (
              <> </>
            ) : (
              /*               <Box display="flex" flexDirection="column" alignItems="left">
                <Text
                  marginBottom="5px"
                  fontSize="22px"
                  textAlign="center"
                  maxWidth="600px"
                  fontFamily="Sora, sans-serif"
                  fontWeight="500"
                >
                  Welcome to
                </Text>
                <Text
                  marginBottom="10px"
                  fontSize="24px"
                  textAlign="center"
                  maxWidth="600px"
                  fontFamily="Sora, sans-serif"
                  fontWeight="500"
                  color="#FFEE81"
                >
                  <a
                    href="https://www.koii.network/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Koii
                  </a>{" "}
                  Linktree
                </Text>
                <Text
                  className="typewriterText"
                  marginBottom="20px"
                  fontSize="14px"
                  textAlign="center"
                  maxWidth="600px"
                  fontFamily="Sora, sans-serif"
                  fontWeight="300"
                >
                  The first community powered linktree
                </Text>

                <div id="animated-image-container">
                  <img
                    id="animated-image-frame"
                    src="/images/o1_al.png"
                    alt="frame"
                  />
                </div>

                <Button
                  onClick={handleConnectFinnie}
                  className="connect-wallet-button"
                  fontFamily="Sora, sans-serif"
                  width="300px"
                >
                  {connectButtonText}
                </Button>
              </Box> */
              <Box display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  marginTop={50}
                  justifyContent='center'
                  minHeight='500px'
                >
                  <Box
                    id='animated-image-container'
                    marginRight='100px'
                    height='500px'
                    display={{ base: "none", md: "block" }}
                  >
                    <img
                      id='animated-image-frame'
                      src='/images/o1_al.png'
                      alt='frame'
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      height: "100%", // You can adjust this based on your layout
                    }}
                  >
                    <Image
                      src={koiiChatFish}
                      alt='Koii Chat Fish'
                      maxW='60px' // Set the maximum width to control the size
                      h='auto' // Allow the height to adjust automatically
                    />
                    <Text
                      fontSize='52px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='600'
                      color='#8989C7'
                    >
                      Welcome to
                    </Text>
                    <Text
                      fontSize='64px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='500'
                      color='#171753'
                      marginTop={"-20px"}
                    >
                      <a
                        href='https://www.koii.network/'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Koii
                      </a>{" "}
                      Linktree
                    </Text>

                    <Text
                      marginBottom='20px'
                      fontSize='22px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='500'
                      className='typewriterText'
                    >
                      The first community powered linktree
                    </Text>

                    <Button
                      onClick={handleConnectFinnie}
                      fontFamily='Sora, sans-serif'
                      maxWidth='225px'
                      w='100%'
                      backgroundColor={"#8989C7"}
                      color={"white"}
                      borderRadius={20}
                      border='1.5px solid #8989C7'
                      boxShadow='0px 4px 4px 0px #17175380'
                    >
                      {connectButtonText}
                    </Button>
                    <GetFinnieModal />
                  </div>
                </Box>
              </Box>
            )}
          </>
        </div>
      </div>

      {total !== null && total !== 0 && (
        <div className='footer'>
          <Text>
            Total{" "}
            <a className='by-koii' href='https://www.koii.network/'>
              Koii
            </a>{" "}
            Linktrees created: {total}{" "}
          </Text>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
