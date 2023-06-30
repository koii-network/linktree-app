import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Text, Button, Box, Image } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree } from "../api";
import koiiChatFish from "./images/koiiChat.svg";

const HomePage = () => {
  //Force dark theme by default
  document.documentElement.setAttribute("data-theme", "light");
  const navigate = useNavigate();
  const toast = useToast();
  const { setPublicKey, apiUrl, nodeList } = useWalletContext();
  const { isFinnieDetected, connect } = useK2Finnie();
  const [total, setTotal] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  function animatedSection() {
    let images = ["/images/o3_saim.png", "/images/o1_al.png"];
    let currentIndex = 0;
    document.head.appendChild(document.createElement("style")).innerHTML =
      "#animated-image-frame { animation: rotateAnimation 5s infinite linear; animation-delay: 0s; }";

    let imgElement = document.getElementById("animated-image-frame");
    if (imgElement) imgElement.src = images[currentIndex++];

    // Define the image swapping function
    function preSwapImage() {
      function swapImage() {
        imgElement = document.getElementById("animated-image-frame");

        if (!imgElement) return;

        imgElement.src = images[currentIndex % images.length];
        currentIndex++;
        setTimeout(swapImage, 2500);
      }

      setTimeout(swapImage, 1250);
    }
    preSwapImage();
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
        setIsMobile(false);
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
          const username =
            linktree?.data?.data?.linktree?.linktreeAddress ||
            linktree?.data?.linktree?.linktreeAddress;
          if (linktree.status === true && !linktree?.data) {
            setTimeout(() => {
              navigate("/createlinktree");
            }, 2000);
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
    <a rel="noreferrer" target="_blank" href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <div className="Home">
      <div className="psuedoBackground"></div>
      <div className="container public-key-input-container">
        <div className="auth-user">
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
              <Box display="flex" flexDirection="column">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  marginTop={50}
                >
                  <div
                    id="animated-image-container"
                    style={{ marginRight: "100px" }}
                  >
                    <img
                      id="animated-image-frame"
                      src="/images/o1_al.png"
                      alt="frame"
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
                      alt="Koii Chat Fish"
                      maxW="60px" // Set the maximum width to control the size
                      h="auto" // Allow the height to adjust automatically
                    />
                    <Text
                      fontSize="52px"
                      textAlign="center"
                      maxWidth="600px"
                      fontFamily="Sora, sans-serif"
                      fontWeight="600"
                      color="#8989C7"
                    >
                      Welcome to
                    </Text>
                    <Text
                      fontSize="64px"
                      textAlign="center"
                      maxWidth="600px"
                      fontFamily="Sora, sans-serif"
                      fontWeight="500"
                      color="#171753"
                      marginTop={"-20px"}
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
                      marginBottom="20px"
                      fontSize="22px"
                      textAlign="center"
                      maxWidth="600px"
                      fontFamily="Sora, sans-serif"
                      fontWeight="500"
                      className="typewriterText"
                    >
                      The first community powered linktree
                    </Text>

                    <Button
                      onClick={handleConnectFinnie}
                      fontFamily="Sora, sans-serif"
                      width="200px"
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
        <div className="footer">
          <Text>
            Total{" "}
            <a className="by-koii" href="https://www.koii.network/">
              Koii
            </a>{" "}
            Linktrees created: {total}{" "}
          </Text>
        </div>
      )}
    </div>
  );
};

export default HomePage;
