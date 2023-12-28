import React, { useState } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js"; // Ensure you're importing from the correct package

// Set Buffer globally if it's not already available

const TransferTokens = () => {
  const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const magic = new Magic("pk_live_CBCF36F8BBB76143", {
    extensions: [
      new SolanaExtension({
        rpcUrl: "https://testnet.koii.live",
      }),
    ],
  });

  const sendTransaction = async () => {
    setIsLoading(true);

    try {
      const rpcUrl = "https://testnet.koii.live";
      const connection = new web3.Connection(rpcUrl);

      // Get the public key of the sender (and fee payer)
      const senderPublicKey = magic.solana.publicKey;

      // Create a new transaction
      let transaction = new web3.Transaction();

      // Fetch the recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Set the transaction's fee payer
      transaction.feePayer = senderPublicKey;

      // Add an instruction to the transaction
      const recipientAddress = new web3.PublicKey(
        "8s15YxED2sTZn2WB7N1rhh9q5oE66JTXtJh3Aqmx9Uzp"
      );
      const lamports = web3.LAMPORTS_PER_SOL; // Number of lamports in 1 SOL
      transaction.add(
        web3.SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientAddress,
          lamports,
        })
      );

      // Sign the transaction
      const signedTransaction = await magic.solana.signTransaction(transaction);

      // Send the transaction
      const rawTransaction = signedTransaction.serialize();
      const txSignature = await connection.sendRawTransaction(rawTransaction);

      console.log(txSignature);
      setSignature(txSignature);
    } catch (error) {
      console.error("Error sending transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendTransaction} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send 1 SOL"}
      </button>
      {signature && <p>Transaction Signature: {signature}</p>}
    </div>
  );
};

export default TransferTokens;
