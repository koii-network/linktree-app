import React, { useState, useEffect } from "react";
import axios from "axios";
import { truncateAddress } from "./helpers";
import Web3 from 'web3';

function LinksComponent() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    // Check if Metamask is installed
    if (typeof window.ethereum !== 'undefined') {
      console.log('Metamask is installed!');
      const web3 = new Web3(window.ethereum);

      // Request permission to access accounts
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          // Accounts now exposed
          const userAddress = accounts[0];
          console.log('User address:', userAddress);
          setUserAddress(userAddress);
          fetchData(userAddress);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log('Metamask is not installed.');

      // Prompt the user to install Metamask
      alert('Please install Metamask to continue.');
    }
  }, []);


  function getUserAddressFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('id');
  }

  const fetchData = async (userAddress) => {
    const userPubkey = getUserAddressFromUrl();
    try {
      const response = await axios.get(
        `https://k2-tasknet-ports-3.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree/get/${userPubkey}`
      );
      const linktreeData = response.data.data.linktree;
      const publicKey = response.data.publicKey;
      const formattedLinks = linktreeData.map((link) => ({
        name: link.label,
        url: link.redirectUrl,
      }));
      console.log(response);
      setTitle(publicKey);
      setLinks(formattedLinks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <p className="public-key">{getUserAddressFromUrl() || userAddress}</p>
      <div className="links">
        {links.map((link, index) => (
          <>
            <a
              className="link"
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          </>
        ))}
      </div>
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
