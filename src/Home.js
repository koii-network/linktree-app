import React, { useState, useEffect } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useNavigate } from "react-router-dom";
import { fetchData } from "./helpers";
import { useAccount } from "wagmi";

const HomePage = () => {
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();

  useEffect(() => {
    address && navigate(`/linktree/${address}`);
  }, [address, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchData(publicKey);
      if (res === "Error") {
        setError(true);
        setPublicKey("");
      } else {
        navigate(`/linktree/${publicKey}`);
      }
    } catch (error) {
      setError(true);
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
          {error && (
            <p className="error">
              Error in fetching data, make sure public key address is correct.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
