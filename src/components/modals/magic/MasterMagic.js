import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../../../contexts";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@_koi/web3.js";
import { Box, Text, Button, Flex, Heading } from "@chakra-ui/react";
import bs58 from "bs58";
import axios from "axios";
const rpcUrl = "https://testnet.koii.live";

const magic = new Magic("pk_live_CBCF36F8BBB76143", {
  extensions: {
    solana: new SolanaExtension({
      rpcUrl,
    }),
  },
});

export default function MasterMagic() {
  const { magicPayload } = useWalletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState(
    "8s15YxED2sTZn2WB7N1rhh9q5oE66JTXtJh3Aqmx9Uzp"
  );
  const [sendAmount, setSendAmount] = useState(4000000000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [txHash, setTxHash] = useState("");
  const [sendingTransaction, setSendingTransaction] = useState(false);

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const metadata = await magic.user.getMetadata();
        setPublicAddress(metadata.publicAddress);
        setUserMetadata(metadata);
      }
    });
  }, [isLoggedIn]);

  const login = async () => {
    await magic.auth.loginWithEmailOTP({ email });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  const handleSignTransaction = async () => {
    setSendingTransaction(true);
    const metadata = await magic.user.getMetadata();
    const recipientPubKey = new web3.PublicKey(destinationAddress);
    const payer = new web3.PublicKey(metadata.publicAddress);
    const connection = new web3.Connection(rpcUrl);

    const hash = await connection.getRecentBlockhash();

    let transactionMagic = new web3.Transaction({
      feePayer: payer,
      recentBlockhash: hash.blockhash,
    });

    const transaction = web3.SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipientPubKey,
      lamports: sendAmount,
    });

    transactionMagic.add(...[transaction]);

    const serializeConfig = {
      requireAllSignatures: false,
      verifySignatures: true,
    };

    const signedTransaction = await magic.solana.signTransaction(
      transactionMagic,
      serializeConfig
    );
    setSendingTransaction(false);

    setTxHash("Check your Signed Transaction in console!");

    console.log("Signed transaction", signedTransaction);

    //now time to send
    const tx = web3.Transaction.from(signedTransaction.rawTransaction);
    const signature = await connection.sendRawTransaction(tx.serialize());

    console.log(signature);
  };

  const handleSignMessage = async (data) => {
    try {
      /* data = {
        uuid: "27c2c465-f80c-488c-65b6-3834ed9b14d2",
        linktree: {
          name: "Example Test",
          description: "Test example test",
          image:
            "https: //bafybeide7e4di2yfzn7escwqwemh4beee7jzr4mwes5rqxaumrx2ckl7vu.ipfs.dweb.link/photo.jpg",
          background: "",
          links: [
            {
              label: "https: //www.youtube.com/",
              redirectUrl: "https: //www.youtube.com/",
              key: "57fb402d-276c-766c-50c0-e7e77b9d132e",
              isFavorite: true,
            },
          ],
          linktreeAddress: "potatokingdom31",
          theme: "Mint",
          choosenLabelTheme: "label-one",
        },
        timestamp: 1703802587522,
      }; */

      data = magicPayload;

      const metadata = await magic.user.getMetadata();
      const payer = new web3.PublicKey(metadata.publicAddress);

      const messageString = JSON.stringify(data);

      // Use Magic to sign the message
      const signedMessage = await magic.solana.signMessage(
        new TextEncoder().encode(messageString)
      );

      console.log(signedMessage);

      // Prepare the payload
      const payload = {
        data,
        publicKey: payer,
        signature: bs58.encode(signedMessage),
        username: magicPayload.linktree.linktreeAddress,
      };

      let result = await axios
        .post(
          `https://tasknet.koii.live/task/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/linktree`,
          { payload }
        )
        .then((res) => res.data)
        //After 5 seconds, navigate to www.google.com
        .then(() => {
          setTimeout(function () {
            navigate("/" + magicPayload.linktree.linktreeAddress);
          }, 5000);
        })
        .catch((error) => {
          console.log(`Error:`, error);
          return null;
        });

      if (result?.message) {
        return result;
      }
    } catch (error) {
      console.error("Error in handleSignMessage:", error);
    }
  };

  /*   const handleSignMessage = async () => {
    setSendingTransaction(true);
    const metadata = await magic.user.getMetadata();
    const recipientPubKey = new web3.PublicKey(destinationAddress);
    const payer = new web3.PublicKey(metadata.publicAddress);
    const connection = new web3.Connection(rpcUrl);

    const hash = await connection.getRecentBlockhash();

    let transactionMagic = new web3.Transaction({
      feePayer: payer,
      recentBlockhash: hash.blockhash,
    });

    const payload = {
      uuid: "27c2c465-f80c-488c-65b6-3834ed9b14d0",
      linktree: {
        name: "Example Test",
        description: "Test example test",
        image:
          "https: //bafybeide7e4di2yfzn7escwqwemh4beee7jzr4mwes5rqxaumrx2ckl7vu.ipfs.dweb.link/photo.jpg",
        background: "",
        links: [
          {
            label: "https: //www.youtube.com/",
            redirectUrl: "https: //www.youtube.com/",
            key: "57fb402d-276c-766c-50c0-e7e77b9d132e",
            isFavorite: true,
          },
        ],
        linktreeAddress: "testtesttets",
        theme: "Mint",
        choosenLabelTheme: "label-one",
      },
      timestamp: 1703802587522,
    };

    transactionMagic.add(payload);

    const serializeConfig = {
      requireAllSignatures: false,
      verifySignatures: true,
    };

    const signedTransaction = await magic.solana.signTransaction(
      transactionMagic,
      serializeConfig
    );
    setSendingTransaction(false);

    setTxHash("Check your Signed Transaction in console!");

    console.log("Signed transaction", signedTransaction);

    //now time to send
    const tx = web3.Transaction.from(signedTransaction.rawTransaction);
    const signature = await connection.sendRawTransaction(tx.serialize());

    console.log(signature);
  }; */

  return (
    <Box>
      {!isLoggedIn ? (
        <div className="container">
          {/*    <h1>Please sign up or login</h1>
          <input
            type="email"
            name="email"
            required="required"
            placeholder="Enter your email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <button onClick={login}>Send</button> */}
        </div>
      ) : (
        <Flex
          flexDirection={"column"}
          textAlign={"center"}
          alignItems={"center"}
          mb={5}
          mt={5}
        >
          {/*      <Text>Current user: {userMetadata.email}</Text> */}
          {/*         <Button w={"30%"} onClick={logout}>
            Logout
          </Button> */}

          {/*      <Box>
            <Heading>Koii address</Heading>
            <Text className="info">
              <a
                href={`https://explorer.koii.live/address/${publicAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                {publicAddress}
              </a>
            </Text>
            <button></button>
          </Box> */}

          {txHash ? (
            <div>
              <div>Sign transaction success</div>
              <div className="info">{txHash}</div>
            </div>
          ) : sendingTransaction ? (
            <div className="sending-status">Sending transaction</div>
          ) : (
            <div />
          )}
          {/*     <input
            type="text"
            name="destination"
            className="full-width"
            required="required"
            placeholder="Destination address"
            onChange={(event) => {
              setDestinationAddress(event.target.value);
            }}
          /> */}
          {/*     <input
            type="text"
            name="amount"
            className="full-width"
            required="required"
            placeholder="Amount in LAMPORTS"
            onChange={(event) => {
              setSendAmount(event.target.value);
            }}
          /> */}

          {magicPayload && (
            <>
              {/*             <Button
                onClick={handleSignTransaction}
                color="white"
                bgColor={"#353570"}
                minWidth={"35%"}
              >
                Step 2: Send 4.00 KOII Fee
              </Button> */}
              <Button
                onClick={handleSignMessage}
                mt={5}
                color={"white"}
                bgColor={"#353570"}
                minWidth={"35%"}
              >
                Confirm and Publish
              </Button>
            </>
          )}
        </Flex>
      )}
    </Box>
  );
}
