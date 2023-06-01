import React, { useState, useEffect } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useNavigate } from "react-router-dom";
import { fetchData } from "./helpers";
import { useAccount } from "wagmi";
import { useToast } from "@chakra-ui/react";

const HomePage = () => {
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();
  const toast = useToast();

  useEffect(() => {
    address && navigate(`/linktree/${address}`);
  }, [address, navigate]);

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

  return (
    <>
      <div className="container public-key-input-container">
        <div className="auth-user">
          <ConnectWallet />

          <p className="title-1">OR</p>
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              required
              className="public-key-input"
              placeholder="Enter Public Key Address"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />
            <input
              type="submit"
              value="Go"
              className="public-key-input submit"
            />
          </form>
          {error && <p className="error">Public Key length must be 42!</p>}
        </div>
      </div>
    </>
  );
};

export default HomePage;
