import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "./helpers";
import { useToast, Button } from "@chakra-ui/react";
import { useWalletContext } from "./contexts";
import { useK2Finnie } from "./hooks";
import { DOWNLOAD_FINNIE_URL } from "./config";

const HomePage = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { publicKey, setPublicKey } = useWalletContext();

  const { isFinnieDetected, k2PubKey, connect } = useK2Finnie();

  useEffect(() => {
    k2PubKey && navigate(`/linktree/${k2PubKey}`);
  }, [k2PubKey, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (publicKey.length !== 42) return setError(true);
    try {
      const res = await fetchData(publicKey);
      if (res === "Error") {
        setError(true);
        setPublicKey("");
      } else {
        navigate(`/linktree/${publicKey}`);
      }
    } catch (err) {
      if (err) {
        toast({
          title: "No Linktree profile for this public key",
          description: "You'll be re-directed to create a profile",
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
  };

  const handleConnectFinnie = async () => {
    console.log("isFinnie", isFinnieDetected);
    if (isFinnieDetected) {
      await connect();
      if (k2PubKey) {
        setPublicKey(k2PubKey);
        // navigate(`/linktree/${k2PubKey}`);
      }
    }
  };

  const linkToGetFinnie = (
    <a
      rel='noreferrer'
      target='_blank'
      href={DOWNLOAD_FINNIE_URL}
      className='w-full h-full flex items-center justify-center'
    >
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <>
      <div className='container public-key-input-container'>
        <div className='auth-user'>
          <Button
            backgroundColor='transparent'
            padding='35px 30px'
            border='1px solid #171753'
            fontSize='20px'
            borderRadius='35px'
            _hover={{
              backgroundColor: "#8989c7",
              color: "#FFFFFF",
              border: "none",
            }}
            onClick={handleConnectFinnie}
            className='connect-finnie'
          >
            {connectButtonText}
          </Button>

          <p className='title-1'>OR</p>
          <form className='input-container' onSubmit={handleSubmit}>
            <input
              required
              className='public-key-input'
              placeholder='Enter Public Key Address'
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />
            <input
              type='submit'
              value='Go'
              className='public-key-input submit'
            />
          </form>
          {error && <p className='error'>Public Key length must be 42!</p>}
        </div>
      </div>
    </>
  );
};

export default HomePage;
