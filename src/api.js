import axios from "axios";
import bs58 from "bs58";
import {
  Transaction,
  Connection,
  clusterApiUrl,
  SystemProgram,
} from "@_koi/web3.js";
import { API_URL } from "./config";

export async function getLinktrees(publicKey) {
  try {
    const res = await axios.get(`${API_URL}/linktree/list`);
    const profile = res.data.filter((item) => {
      return item.publicKey === publicKey;
    });
    return {
      data: profile[0],
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: "",
      status: true,
    };
  }
}

export async function getLinktree(publicKey) {
  try {
    const res = await axios.get(`${API_URL}/linktree/get/${publicKey}`);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function setLinktree(data, publicKey) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
  };
  try {
    const res = await axios.post(`${API_URL}/linktree`, {
      payload,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAuthList(publicKey) {
  try {
    const res = await axios.get(`${API_URL}/authlist/get/${publicKey}`);
    return res?.data === publicKey;
  } catch (error) {
    console.log(error);
  }
}

export async function transferKoii() {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));
    const blockHash = await connection.getRecentBlockhash();
    const feePayer = window.k2.publicKey;

    const transaction = new Transaction();
    transaction.recentBlockhash = blockHash.blockhash;
    transaction.feePayer = feePayer;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.k2.publicKey,
        toPubkey: new window.solanaWeb3.PublicKey(
          "HdVLjiwWcX8RWCLgZnNzeMt48JB6MJYan7q2qt3NLfZW"
        ),
        lamports: Number(10000000000),
      })
    );

    const payload = transaction.serializeMessage();
    await window.k2.signAndSendTransaction(payload);
    const authdata = {
      pubkey: window.k2.publicKey,
    };
    await axios.post(`${API_URL}/authlist`, {
      authdata,
    });
  } catch (error) {
    console.log(error);
  }
}
