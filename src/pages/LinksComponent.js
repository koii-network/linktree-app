import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast, Box, Spinner, IconButton, Tooltip } from "@chakra-ui/react";
import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import { deleteLinktree, getLinktreeWithUsername, getLinktree } from "../api";
import { useWalletContext } from "../contexts";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { LinkedInEmbed, YouTubeEmbed } from "react-social-media-embed";
import { themeApplier } from "../helpers";
import "../css/ButtonAnimations.css";

function LinksComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isProfileOwner, setIsProfileOwner] = useState("");
  const [noProfileText, setNoProfileText] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState({});

  const { publicKey, apiUrl, nodeList } = useWalletContext();

  useEffect(() => {
    themeApplier(userData?.theme);
  }, [userData]); // Add userData as a dependency

  useEffect(() => {
    async function getUserData() {
      const userResponse = await getLinktreeWithUsername(query, nodeList);
      setUsername(query);
      const isProfileOwner =
        window?.k2 &&
        publicKey &&
        window?.k2?.publicKey?.toString() === userResponse.data.publicKey;
      setIsProfileOwner(isProfileOwner);
      setUserData(
        userResponse?.data?.linktree || userResponse?.data?.data?.linktree
      );
      return userResponse;
    }
    async function getData() {
      const userData = await getUserData();
      if (userData?.status) {
        setIsLoading(false);
      } else {
        toast({
          title: "Error fetching Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setNoProfileText("Error fetching Linktree profile");
      }
      if (userData.data && userData.status) {
        setNoProfileText("No Linktree profile for this Username");
      }
    }
    getData();
  }, [query, publicKey, toast, navigate, apiUrl, nodeList]);

  const handleDeleteLinktree = async () => {
    if (publicKey) {
      try {
        if (window?.k2) {
          await window.k2.signMessage("Delete Linktree");
        }
        const deletedProfile = await deleteLinktree(nodeList, publicKey);
        if (deletedProfile) {
          toast({
            title: "Linktree profile deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
          return;
        }
        throw Error("Error deleting profile");
      } catch (error) {
        toast({
          title: "Error deleting Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  async function handleEditLinktree() {
    try {
      if (window?.k2) {
        await window.k2.signMessage("Edit Linktree");
        navigate(`/editLinktree/${username}`);
      }
    } catch (error) {
      toast({
        title: "Error authorizing edit",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }
  return (
    <Box className="container" position="relative">
      <Box
        minHeight="70vh"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyItems="center"
      >
        {isLoading ? (
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyItems="center"
          >
            <Spinner height="50px" width="50px" />
          </Box>
        ) : (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            {isProfileOwner && userData && (
              <>
                <Box
                  position="absolute"
                  top={{ base: "20px", md: "30px" }}
                  left={{ base: "20px", md: "-5%" }}
                >
                  <Tooltip
                    hasArrow
                    label="Delete Your Linktree Profile"
                    bg="#ecfffe"
                    fontSize="sm"
                    color="#171753"
                  >
                    <IconButton
                      rounded="full"
                      alignSelf={{ base: "flex-end", lg: "" }}
                      marginTop="10px"
                      icon={<DeleteIcon />}
                      backgroundColor={"transparent"}
                      color={"dashboard-icon"}
                      onClick={handleDeleteLinktree}
                    />
                  </Tooltip>
                </Box>

                {
                  <Box
                    position="absolute"
                    top={{ base: "20px", md: "30px" }}
                    right={{ base: "20px", md: "-5%" }}
                  >
                    <Tooltip
                      hasArrow
                      label="Edit Linktree"
                      bg="#ecfffe"
                      fontSize="sm"
                      color="#171753"
                    >
                      <IconButton
                        rounded="full"
                        alignSelf={{ base: "flex-end", lg: "" }}
                        marginTop="10px"
                        icon={<SettingsIcon />}
                        backgroundColor={"transparent"}
                        color={"dashboard-icon"}
                        onClick={handleEditLinktree}
                      />
                    </Tooltip>
                  </Box>
                }
              </>
            )}
            {userData && (
              <>
                {userData?.image && (
                  <img
                    src={userData?.image}
                    alt={userData?.name}
                    className="user-image"
                  />
                )}
                <p className="user-name"> {userData?.name} </p>
                <p className="user-desc">{userData?.description}</p>

                <div className="links">
                  {userData?.links?.map((link, index) => (
                    <div className="link-container" key={link?.redirectUrl}>
                      <a
                        className={`link ${
                          index === 0 ? userData?.animation : ""
                        }`}
                        key={index}
                        href={link?.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: index === 0 ? "18px" : "inherit" }}
                      >
                        {link.label}
                      </a>
                      {link.redirectUrl.startsWith("https://twitter.com/") && (
                        <div
                          className="hover-div"
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "transparent",
                          }}
                        >
                          <TwitterTimelineEmbed
                            sourceType="profile"
                            screenName={link.redirectUrl
                              .replace(/\/$/, "")
                              .split("/")
                              .pop()}
                            options={{ height: 400, width: 400 }}
                          />
                        </div>
                      )}
                      {/* 
                      {link?.redirectUrl.startsWith("https://youtube.com/") && (
                        <div className="hover-div">
                          <YouTubeEmbed
                            url="https://www.youtube.com/watch?v=HpVOs5imUN0"
                            width={325}
                            height={220}
                          />
                        </div>
                      )}

                      {link?.redirectUrl.startsWith(
                        "https://linkedin.com/"
                      ) && (
                        <div className="hover-div">
                          <LinkedInEmbed
                            url="https://www.linkedin.com/embed/feed/update/urn:li:share:6898694772484112384"
                            postUrl="https://www.linkedin.com/posts/peterdiamandis_5-discoveries-the-james-webb-telescope-will-activity-6898694773406875648-z-D7"
                            width={400}
                            height={400}
                          />
                        </div>
                      )} */}
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      ></div>
                    </div>
                  ))}
                </div>

                {publicKey && (
                  <p>
                    <a
                      href={`https://linktree.koii.network/linktree/${username}`}
                      className="displayLink"
                    >
                      Your linktree profile Link
                    </a>
                  </p>
                )}
              </>
            )}
            {!userData && !isLoading && <p>{noProfileText}</p>}
          </Box>
        )}
      </Box>
      <div className="footer">
        Linktree by{" "}
        <a href="https://www.koii.network/" className="by-koii">
          Koii Network
        </a>
      </div>
    </Box>
  );
}

export default LinksComponent;
