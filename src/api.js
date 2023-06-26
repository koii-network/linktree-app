import axios from "axios";
import bs58 from "bs58";
import { TASK_ADDRESS, TRANSFER_AMOUNT, RECIPIENT_ADDRESS } from "./config";
import {
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
} from "@_koi/web3.js";

export async function deleteLinktree(nodeList, publicKey) {
  try {
    const requests = nodeList.map((node) =>
      axios
        .delete(`${node}/task/${TASK_ADDRESS}/linktree/${publicKey}`)
        .then((res) => res.data)
        .catch((error) =>
          console.log(`Error fetching authlist from ${node}:`, error)
        )
    );

    const results = await Promise.allSettled(requests);

    await axios.delete(
      `${nodeList[1]}/task/${TASK_ADDRESS}/linktree/${publicKey}`
    );
    for (const result of results) {
      if (result.status === "fulfilled" && result.value === publicKey) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}

export async function allLinktrees(nodeList) {
  try {
    const requests = nodeList.map((node) =>
      axios
        .get(`${node}/task/${TASK_ADDRESS}/linktree/list`)
        .then((res) => res.data)
        .catch((error) =>
          console.log(`Error fetching authlist from ${node}:`, error)
        )
    );
    const results = await Promise.allSettled(requests);
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        const linktrees = [...result.value];
        const total = linktrees.length;
        return total;
      }
    }
  } catch (error) {
    console.log("Error getting node list:", error);
  }
}

export async function getLinktreeWithUsername(username, nodeList) {
  try {
    const requests = nodeList.map((node) =>
      axios
        .get(`${node}/task/${TASK_ADDRESS}/linktree/get/username/${username}`)
        .then((res) => res.data)
        .catch((error) =>
          console.log(`Error fetching authlist from ${node}:`, error)
        )
    );

    const results = await Promise.allSettled(requests);

    for (const result of results) {
      if (
        result.status === "fulfilled" &&
        result.value &&
        result?.value?.length !== 0
      ) {
        return {
          data: result.value,
          status: true,
        };
      }
    }
    return {
      data: "",
      status: true,
    };
  } catch (error) {
    console.log("Error getting node list:", error);
  }

  return false;
}

export async function getLinktree(publicKey, nodeList) {
  try {
    const requests = nodeList.map((node) =>
      axios
        .get(`${node}/task/${TASK_ADDRESS}/linktree/get/${publicKey}`)
        .then((res) => res.data)
        .catch((error) =>
          console.log(`Error fetching authlist from ${node}:`, error)
        )
    );

    const results = await Promise.allSettled(requests);

    for (const result of results) {
      if (
        result.status === "fulfilled" &&
        result.value &&
        result?.value?.length !== 0
      ) {
        return {
          data: result.value,
          status: true,
        };
      }
    }
    return {
      data: "",
      status: true,
    };
  } catch (error) {
    console.log("Error getting node list:", error);
  }

  return false;
}

export async function setLinktree(data, publicKey, nodeList, username) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
    username,
  };
  try {
    let nodeListIndex = 1;
    let result;

    while (!result) {
      result = await axios
        .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree`, {
          payload,
        })
        .then((res) => res.data)
        .catch((error) => console.log(`Error fetching authlist:`, error));
      nodeListIndex++;
    }

    if (result?.message) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateLinktree(data, publicKey, nodeList, username) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
    username,
  };
  try {
    let nodeListIndex = 1;
    let result;

    while (!result) {
      result = await axios
        .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree`, {
          payload,
        })
        .then((res) => res.data)
        .catch((error) => console.log(`Error fetching authlist:`, error));
      nodeListIndex++;
    }

    await deleteLinktree(nodeList, publicKey);

    if (result?.message) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAuthList(publicKey, nodeList) {
  try {
    const requests = nodeList.map((node) =>
      axios
        .get(`${node}/task/${TASK_ADDRESS}/authlist/get/${publicKey}`)
        .then((res) => res.data)
        .catch((error) =>
          console.log(`Error fetching authlist from ${node}:`, error)
        )
    );

    const results = await Promise.allSettled(requests);

    for (const result of results) {
      if (result.status === "fulfilled" && result.value === publicKey) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log("Error getting node list:", error);
  }
}

export async function transferKoii(nodeList) {
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
        lamports: Number(
          TRANSFER_AMOUNT +
            (await connection.getMinimumBalanceForRentExemption(100)) +
            1000
        ),
      })
    );

    const payload = transaction.serializeMessage();
    const signature = await window.k2.signAndSendTransaction(payload);

    if (signature) {
      const authdata = {
        pubkey: window.k2.publicKey.toString(),
      };
      let nodeListIndex = 1;
      let result;
      while (!result) {
        result = await axios
          .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/authlist`, {
            authdata,
          })
          .then((res) => res.data === window.k2.publicKey.toString())
          .catch((error) =>
            console.log(
              `Error fetching authlist from ${nodeList[nodeListIndex]}:`,
              error
            )
          );
        console.log(result, "hi");
        nodeListIndex++;
        if (result) return result;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
