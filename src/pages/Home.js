import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Text, Button, Box } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree } from "../api";

const HomePage = () => {
  //Force dark theme by default
  document.documentElement.setAttribute("data-theme", "dark");

  const navigate = useNavigate();
  const toast = useToast();
  const { setPublicKey, apiUrl, nodeList } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();
  const [total, setTotal] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

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
  }, [apiUrl, nodeList]);

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

  const handleConnectFinnie = async () => {
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);

          const linktree = await getLinktree(pubKey, nodeList);
          const username = linktree?.data?.linktree?.linktreeAddress;
          if (linktree.status === true && !linktree?.data) {
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
          } else if (linktree.data && username) {
            toast({
              title: "Linktree profile successfully fetched!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate(`/linktree/${username}`);
            }, 3000);
          } else {
            toast({
              title: "Error fetching Linktree data",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
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
  };

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <div className='Home'>
      <div className='psuedoBackground'></div>
      <div className='container public-key-input-container'>
        <div className='auth-user'>
          <>
            {isMobile ? (
              <Box display='flex' flexDirection='column' alignItems='center'>
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
                    alt='frame'
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
                      alt='frame'
                    />
                  </div>
                </Box>
              </Box>
            )}
          </>
        </div>
      </div>

      {total !== null && total && (
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
