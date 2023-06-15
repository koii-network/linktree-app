import axios from "axios";
import bs58 from "bs58";
import { Transaction, Connection, SystemProgram } from "@_koi/web3.js";
import { Transfer_AMOUNT, RECIPIENT_ADDRESS, TASK_ADDRESS } from "./config";
import { getNodeList } from "./helpers";

export async function getLinktrees(apiUrl) {
  try {
    const res = await axios.get(`${apiUrl}/linktree/list`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteLinktree(apiUrl, publicKey) {
  try {
    const res = await axios.delete(`${apiUrl}/linktree/${publicKey}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getLinktreesFromBackUp(publicKey, backUpNodeList) {
  const res = await axios.get(`${backUpNodeList[0]}/linktree/get/${publicKey}`);
  if (!res.data) {
    const res = await axios.get(
      `${backUpNodeList[1]}/linktree/get/${publicKey}`
    );
    if (res.data) {
      return {
        data: res.data,
        status: true,
      };
    } else {
      return {
        data: "",
        status: false,
      };
    }
  } else {
    return {
      data: res.data,
      status: true,
    };
  }
}

export async function allLinktrees() {
  const res = await axios.get(
    `https://tasknet.koii.live/task/DyzjHaJe4KVUQJBCrW1bgmXB79ovAjSQGDYDKV8BiRL5/linktree/list`
  );
  if (res.data) {
    const total = res.data.length;
    return total;
  }
}

export async function getLinktree(publicKey, nodeList) {
  try {
    const res = await axios.get(
      `http://localhost:3000//linktree/get/${publicKey}`
    );
    if (res.data) {
      return {
        data: res.data,
        status: true,
      };
    }
    return {
      data: "",
      status: true,
    };
  } catch (error) {
    console.log("Error getting node list:", error);
  }

  // try {
  //   const requests = nodeList.map((node) =>
  //     axios
  //       .get(`${node}/task/${TASK_ADDRESS}/linktree/get/${publicKey}`)
  //       .then((res) => res.data)
  //       .catch((error) =>
  //         console.log(`Error fetching authlist from ${node}:`, error)
  //       )
  //   );

  //   const results = await Promise.allSettled(requests);

  //   for (const result of results) {
  //     console.log(result);
  //     if (result.status === "fulfilled" && result.value) {
  //       return {
  //         data: result.value,
  //         status: true,
  //       };
  //     }
  //   }
  //   return {
  //     data: "",
  //     status: true,
  //   };
  // } catch (error) {
  //   console.log("Error getting node list:", error);
  // }

  return false;
}

export async function setLinktree(data, publicKey, apiUrl, username) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
    username,
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
    const res = await axios.get(
      `http://localhost:3000/authlist/get/${publicKey}`
    );
    if (res.data && res.data === publicKey) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error getting node list:", error);
  }
  // try {
  //   const nodeList = await getNodeList();
  //   const requests = nodeList.map((node) =>
  //     axios
  //       .get(`${node}/task/${TASK_ADDRESS}/authlist/get/${publicKey}`)
  //       .then((res) => res.data)
  //       .catch((error) =>
  //         console.log(`Error fetching authlist from ${node}:`, error)
  //       )
  //   );

  //   const results = await Promise.allSettled(requests);

  //   for (const result of results) {
  //     if (result.status === "fulfilled" && result.value === publicKey) {
  //       return true;
  //     }
  //   }
  // } catch (error) {
  //   console.log("Error getting node list:", error);
  // }

  return false;
}

export async function transferKoii(apiUrl) {
  try {
    const connection = new Connection(`https://k2-testnet.koii.live`);
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

    const signature = await window.k2.signAndSendTransaction(payload);

    if (signature) {
      const authdata = {
        pubkey: window.k2.publicKey.toString(),
      };
      const res = await axios.post(`${apiUrl}/authlist`, {
        authdata,
      });
      return res.data === window.k2.publicKey.toString();
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}
