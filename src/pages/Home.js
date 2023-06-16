import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Text, Button, Stack, Box } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree, getAuthList, transferKoii } from "../api";
import pirateShipImage from "./pirate-ship.svg";

const HomePage = () => {
  //Force dark theme by default
  document.documentElement.setAttribute("data-theme", "dark");

  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { setPublicKey, apiUrl, nodeList } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();
  const [total, setTotal] = useState(null);

  //Checks if the user is logged in or not
  const [isLogged, setIsLogged] = useState(false);
  //Used to store the public key ("local public key")
  const [localpk, setLocalpk] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  //Used for the typewriter animation logic (Unused)
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [letter, setLetter] = useState("");

  function animatedSection() {
    let images = [
      "/images/o2_soma.png",
      "/images/o3_saim.png",
      "/images/o1_al.png",
    ];
    let currentIndex = 0;
    document.head.appendChild(document.createElement("style")).innerHTML =
      "#animated-image-frame { animation: rotateAnimation 5s infinite; }";

    let intervalId = setInterval(function () {
      let imgElement = document.getElementById("animated-image-frame");
      if (!imgElement) {
        clearInterval(intervalId); // Break the loop if imgElement doesn't exist
        return;
      }
      imgElement.src = images[currentIndex];
      currentIndex = (currentIndex + 1) % images.length;
    }, 5000);
  }

  useEffect(() => {
    animatedSection();
    allLinktrees(nodeList)
      .then((number) => {
        setTotal(number);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiUrl, setPublicKey]);

  const handleConnectFinnie = async () => {
    setIsLoading(true);
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);

          const linktree = await getLinktree(pubKey, nodeList);
          if (linktree.status === true && !linktree?.data?.data) {
            toast({
              title: "No Linktree profile for this public key",
              description: "You'll be redirected to create a profile",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate("/createlinktree");
            }, 3000);
          } else if (linktree.data) {
            toast({
              title: "Linktree profile successfully fetched!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            setLocalpk(pubKey);
            setTimeout(() => {
              navigate(`linktree/${pubKey}`);
            }, 2000);
            //setIsLogged(true);
          } else {
            toast({
              title: "Error fetching Linktree data",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate("/createlinktree");
            }, 3000);
          }
        }
      } catch (err) {
        toast({
          title: "Error fetching Linktree data",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
    setIsLoading(false);
  };

  const handleTransferKoii = async () => {
    try {
      const isTransfer = await transferKoii(apiUrl);
      if (isTransfer) {
        toast({
          title: "Koii Transfer Successful",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/createlinktree");
        }, 3000);
      } else {
        throw new Error("An Error Occurred");
      }
    } catch {
      toast({
        title: "Error transferring koii",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  useEffect(() => {
    function handleResize() {
      if (document.documentElement.clientWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className='Home'>
      <div className='psuedoBackground'></div>

      <div className='container public-key-input-container'>
        {isLogged ? (
          <Box height={"60vh"}>
            <Text
              marginBottom='10px'
              fontSize='25px'
              textAlign='center'
              maxWidth='600px'
            >
              Linktree Control Panel
            </Text>

            <Text
              marginBottom='10px'
              fontSize='12px'
              textAlign='center'
              maxWidth='600px'
            >
              User: {localpk}
            </Text>
            <Stack direction='column' spacing={4} align='center'>
              <Button
                onClick={() => navigate(`linktree/${localpk}`)}
                colorScheme='blue'
              >
                Show my Linktree
              </Button>
              <Button
                onClick={() => navigate(`createlinktree`)}
                colorScheme='blue'
              >
                Redesign Linktree
              </Button>
            </Stack>
          </Box>
        ) : (
          <div className='auth-user'>
            {isAuth ? (
              <>
                {isMobile ? (
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                  >
                    <Text
                      marginBottom='5px'
                      fontSize='22px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='500'
                    >
                      Welcome to
                    </Text>
                    <Text
                      marginBottom='10px'
                      fontSize='24px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='500'
                      color='#FFEE81'
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
                      className='typewriterText'
                      marginBottom='20px'
                      fontSize='14px'
                      textAlign='center'
                      maxWidth='600px'
                      fontFamily='Sora, sans-serif'
                      fontWeight='300'
                    >
                      The first community powered linktree
                    </Text>

                    <div id='animated-image-container'>
                      <img
                        id='animated-image-frame'
                        src='/images/o1_al.png'
                        alt='background-image'
                      />
                    </div>

                    <Button
                      onClick={handleConnectFinnie}
                      className='connect-wallet-button'
                      fontFamily='Sora, sans-serif'
                      width='300px'
                    >
                      {connectButtonText}
                    </Button>
                  </Box>
                ) : (
                  <Box display='flex' flexDirection='column'>
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent=''
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%", // You can adjust this based on your layout
                        }}
                      >
                        <Text
                          marginBottom='5px'
                          fontSize='52px'
                          textAlign='center'
                          maxWidth='600px'
                          fontFamily='Sora, sans-serif'
                          fontWeight='500'
                        >
                          Welcome to
                        </Text>
                        <Text
                          marginBottom='10px'
                          fontSize='64px'
                          textAlign='center'
                          maxWidth='600px'
                          fontFamily='Sora, sans-serif'
                          fontWeight='500'
                          color='#FFEE81'
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
                          fontWeight='300'
                          className='typewriterText'
                        >
                          The first community powered linktree
                        </Text>

                        <Button
                          onClick={handleConnectFinnie}
                          className='connect-wallet-button'
                          fontFamily='Sora, sans-serif'
                          width='300px'
                        >
                          {connectButtonText}
                        </Button>
                      </div>
                      <div
                        id='animated-image-container'
                        style={{ marginLeft: "100px" }}
                      >
                        <img
                          id='animated-image-frame'
                          src='/images/o1_al.png'
                          alt='Image'
                        />
                      </div>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Text
                  marginBottom='10px'
                  fontSize='30px'
                  textAlign='center'
                  maxWidth='600px'
                >
                  You are not authorized to create and access Linktree profiles
                </Text>
                <Text
                  marginBottom='20px'
                  fontSize='18px'
                  textAlign='center'
                  maxWidth='600px'
                >
                  Transfer 10 Koii to
                  stakepotaccountuQLBn4bsxKgSLedRTxsnZUQ9aCBR by clicking the
                  button below to create and access linktree profiles:{" "}
                </Text>
                <Button
                  onClick={handleTransferKoii}
                  className='connect-wallet-button'
                >
                  Transfer Koii
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {total !== null && (
        <div className='footer'>
          <p>
            Total{" "}
            <a className='by-koii' href='https://www.koii.network/'>
              Koii
            </a>{" "}
            linktrees created: <span className='by-koii total'> {total} </span>{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
