import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLinktree } from "./api";
import { useDisconnect } from "wagmi";
import { Oval } from "react-loader-spinner";
import { Box } from "@chakra-ui/react";

function LinksComponent() {
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState([]);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    async function getUserData() {
      const response = await getLinktree(query);
      setUserData(response);
    }
    getUserData();
  }, [query]);

  return (
    <div className='container'>
      {userData?.length === 0 ? (
        <Message>
          {" "}
          <Oval
            height={80}
            width={80}
            color='#ffffff'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#ffffff'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </Message>
      ) : userData === "Error" ? (
        <Message>
          <span>User Data not Found</span>{" "}
          <a href='/' onClick={() => disconnect()} className='text-mint'>
            Go Home
          </a>
        </Message>
      ) : (
        <Box minHeight='70vh'>
          {" "}
          {userData?.image && (
            <img
              src={userData?.image}
              alt={userData?.name}
              className='user-image'
            />
          )}
          {/* <img
            src={"/images/twitter_LCtIAZQN_400x400 1.png"}
            alt={userData?.name}
            className='user-image'
          /> */}
          <p className='user-name'> {userData?.name} </p>
          <p className='user-desc'> {userData?.description} </p>
          <div className='links'>
            {userData?.links?.map((link, index) => (
              <a
                className='link'
                key={index}
                href={link?.redirectUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                {link.label}
              </a>
            ))}
          </div>
        </Box>
      )}
      <div className='footer'>
        Link tree by{" "}
        <a href='https://www.koii.network/' className='by-koii'>
          Koii Network
        </a>
      </div>
    </div>
  );
}

export default LinksComponent;

const Message = ({ children }) => {
  return <div className='message-container'>{children}</div>;
};
