import React from "react";
import { Box, Spinner, IconButton, Tooltip } from "@chakra-ui/react";
import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import "../../css/ButtonAnimations.css";

function SingleLinktree({
  isLoading,
  isProfileOwner,
  userData,
  handleDeleteLinktree,
  handleEditLinktree,
  publicKey,
  noProfileText,
  username,
}) {
  return (
    <Box className='container' position='relative'>
      <Box
        minHeight='70vh'
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyItems='center'
      >
        {isLoading ? (
          <Box
            height='100%'
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyItems='center'
          >
            <Spinner height='50px' width='50px' />
          </Box>
        ) : (
          <Box
            width='100%'
            display='flex'
            alignItems='center'
            flexDirection='column'
          >
            {isProfileOwner && userData && (
              <>
                <Box
                  position='absolute'
                  top={{ base: "20px", md: "30px" }}
                  left={{ base: "20px", md: "-5%" }}
                >
                  <Tooltip
                    hasArrow
                    label='Delete Your Linktree Profile'
                    bg='#ecfffe'
                    fontSize='sm'
                    color='#171753'
                  >
                    <IconButton
                      rounded='full'
                      alignSelf={{ base: "flex-end", lg: "" }}
                      marginTop='10px'
                      icon={<DeleteIcon />}
                      backgroundColor={"transparent"}
                      color={"dashboard-icon"}
                      onClick={handleDeleteLinktree}
                    />
                  </Tooltip>
                </Box>

                {
                  <Box
                    position='absolute'
                    top={{ base: "20px", md: "30px" }}
                    right={{ base: "20px", md: "-5%" }}
                  >
                    <Tooltip
                      hasArrow
                      label='Edit Linktree'
                      bg='#ecfffe'
                      fontSize='sm'
                      color='#171753'
                    >
                      <IconButton
                        rounded='full'
                        alignSelf={{ base: "flex-end", lg: "" }}
                        marginTop='10px'
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
                    className='user-image'
                  />
                )}
                <p className='user-name'> {userData?.name} </p>
                <p className='user-desc'>{userData?.description}</p>

                <div className='links'>
                  {userData?.links?.map((link, index) => (
                    <div className='link-container' key={link?.redirectUrl}>
                      <a
                        className={`link ${
                          index === 0 ? userData?.animation : ""
                        }`}
                        key={index}
                        href={link?.redirectUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ fontSize: index === 0 ? "18px" : "inherit" }}
                      >
                        {link.label}
                      </a>
                      {link.redirectUrl.startsWith("https://twitter.com/") && (
                        <div
                          className='hover-div'
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "transparent",
                          }}
                        >
                          <TwitterTimelineEmbed
                            sourceType='profile'
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
                      href={`https://linktree.koii.network/${username}`}
                      className='displayLink'
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
      <div className='footer'>
        Linktree by{" "}
        <a href='https://www.koii.network/' className='by-koii'>
          Koii Network
        </a>
      </div>
    </Box>
  );
}

export default SingleLinktree;