import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchData, truncateAddress } from "./helpers";

function LinksComponent() {
  const location = useLocation();
  const query = location.pathname.slice(10);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function getUserData() {
      const response = await fetchData(query);
      setUserData(response);
      console.log(response);
    }
    getUserData();
  }, [query]);

  return (
    <div className="container">
      <p className="public-key"> {truncateAddress(query || "")} </p>
      {userData === [] ? (
        <Message message={"Fetching User Data..."} />
      ) : userData === undefined ? (
        <Message message={"User Data not Found"} />
      ) : (
        <>
          {" "}
          <img
            src={userData?.image}
            alt={userData?.name}
            className="user-image"
          />
          <p className="user-name"> {userData?.name} </p>
          <p className="user-desc"> {userData?.description} </p>
          <div className="links">
            {userData?.links?.map((link, index) => (
              <a
                className="link"
                key={index}
                href={link?.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
      <div className="footer">
        Link Tree{" "}
        <a href="https://www.koii.network/" className="by-koii">
          By Koii Network
        </a>
      </div>
    </div>
  );
}

export default LinksComponent;

const Message = ({ message }) => {
  return (
    <div className="message-container">
      <p>{message}</p>
    </div>
  );
};
