import axios from "axios";
import bs58 from "bs58";
import {
  Transaction,
  Connection,
  clusterApiUrl,
  SystemProgram,
} from "@_koi/web3.js";
import { Transfer_AMOUNT, RECIPIENT_ADDRESS } from "./config";
import { getNodeList } from "./helpers";

export async function getLinktrees(publicKey, apiUrl) {
  try {
    const res = await axios.get(`${apiUrl}/linktree/list`);
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

export async function getLinktree(publicKey, apiUrl) {
  try {
    const res = await axios.get(`${apiUrl}/linktree/get/${publicKey}`);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function setLinktree(data, publicKey, apiUrl) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
  };
  try {
    const res = await axios.post(`${apiUrl}/linktree`, {
      payload,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAuthList(publicKey, apiUrl) {
  try {
    const nodeList = await getNodeList();
    const requests = nodeList.map(node =>
      axios.get(`${node}/task/6FgtEX6qd4XCuycUfJGuJTr41qcfvM59ueV2L17eSdan/authlist/get/${publicKey}`)
        .then(res => res.data)
        .catch(error => console.log(`Error fetching authlist from ${node}:`, error))
    );

    const results = await Promise.allSettled(requests);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value === publicKey) {
        return true;
      }
    }
  } catch (error) {
    console.log('Error getting node list:', error);
  }

  return false;
}

export async function transferKoii(apiUrl) {
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
        toPubkey: new window.solanaWeb3.PublicKey(RECIPIENT_ADDRESS),
        lamports: Number(Transfer_AMOUNT),
      })
    );

    const payload = transaction.serializeMessage();
    await window.k2.signAndSendTransaction(payload);
    const authdata = {
      pubkey: window.k2.publicKey,
    };
    const res = await axios.post(`${apiUrl}/authlist`, {
      authdata,
    });
    return res.data === window.k2.publicKey;
  } catch (error) {
    console.log(error);
  }
}
