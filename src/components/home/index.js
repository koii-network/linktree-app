import React from "react";
import "../../App.css";
import { Text, Button, Box, Image } from "@chakra-ui/react";
import koiiChatFish from "../../pages/images/koiiChat.svg";

const HomeComponent = ({
  isMobile,
  handleConnectFinnie,
  connectButtonText,
  total,
}) => {
  console.log(total);
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
                >
                  <div
                    id='animated-image-container'
                    style={{ marginRight: "100px" }}
                  >
                    <img
                      id='animated-image-frame'
                      src='/images/o1_al.png'
                      alt='frame'
                    />
                  </div>
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
                      width='200px'
                      backgroundColor={"#8989C7"}
                      color={"white"}
                      borderRadius={20}
                    >
                      {connectButtonText}
                    </Button>
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
