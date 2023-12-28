import React, { useState } from "react";
import magic from "./magic";
import { Connection, PublicKey } from "@_koi/web3.js";
import { Input, Button, Box, Spinner } from "@chakra-ui/react";
import { useWalletContext } from "../../../contexts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMetadata, setUserMetadata] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [loginState, setLoginState] = useState(null);

  const {
    magicData,
    setMagicData,
    publicKey,
    setPublicKey,
    magicConnection,
    setMagicConnection,
  } = useWalletContext();

  const handleLogin = async () => {
    setLoginState("INITIAL");

    try {
      const magicInstance = await magic.auth.loginWithMagicLink({ email });
      const metadata = await magic.user.getMetadata();
      setMagicData(metadata);
      setPublicKey(metadata.publicAddress);
      setMagicConnection(magicInstance);
      setUserMetadata(metadata);
      fetchWalletAddress(metadata.publicAddress);
      setLoginState("FINAL");
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };

  const fetchWalletAddress = async (publicAddress) => {
    try {
      const publicKey = new PublicKey(publicAddress);
      setWalletAddress(publicKey.toString());
      // Additional wallet functionalities can be added here
    } catch (error) {
      console.error("Error fetching wallet address", error);
    }
  };

  return (
    <div>
      {!userMetadata ? (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            w="100%"
            bgColor={"white"}
            color={"black"}
          />

          <Button
            onClick={handleLogin}
            fontFamily="Sora, sans-serif"
            w="80%"
            backgroundColor={"#8989C7"}
            color={"white"}
            borderRadius={20}
            border="1.5px solid #8989C7"
            boxShadow="0px 4px 4px 0px #17175380"
            mt={5}
          >
            Connect via Magic
          </Button>
          {loginState === "INITIAL" && <Spinner mt={5} />}
        </Box>
      ) : (
        <div>
          <p>Logged in as: {userMetadata.email}</p>
          <p>Wallet Address: {walletAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
