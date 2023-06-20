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

export async function deleteLinktree(nodeList, publicKey) {
  try {
    await window.k2.signMessage("Delete Linktree");
    const requests = nodeList.map((node) =>
      axios
        .delete(`${node}/task/${TASK_ADDRESS}/linktree/${publicKey}`)
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

export async function allLinktrees(nodeList) {
  // const res = await axios.get(
  //   `https://tasknet.koii.live/task/CxhjPZaBQ12eN3N8qv3pACPuAZmWHPZSqYPAcywkhzNX/linktree/list`
  // );
  // if (res.data) {
  //   const total = res.data.length;
  //   return total;
  // }

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
  // console.log(nodeList);
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
    console.log(results);

    for (const result of results) {
      if (result.status === "fulfilled" && result?.value?.data) {
        // console.log(result.value, "fulfilled");
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
  // const res = await axios.get(`${apiUrl}/linktree/get/${publicKey}`);
  // if (res.data) {
  //   return {
  //     data: res.data,
  //     status: true,
  //   };
  // }

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
      if (result.status === "fulfilled" && result.value.data) {
        // console.log("Hello", result.value);
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
    let nodeListIndex = 0;
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

export async function getAuthList(publicKey, apiUrl) {
  try {
    const nodeList = await getNodeList();
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
  } catch (error) {
    console.log("Error getting node list:", error);
  }

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

    // const signature = await window.k2.signAndSendTransaction(payload);

    if (true) {
      // const authdata = {
      //   pubkey: window.k2.publicKey.toString(),
      // };
      // const res = await axios.post(`${apiUrl}/authlist`, {
      //   authdata,
      // });
      // return res.data === window.k2.publicKey.toString();

      try {
        const nodeList = await getNodeList();
        const authdata = {
          pubkey: window.k2.publicKey.toString(),
        };
        const requests = nodeList.map((node) =>
          axios
            .post(`${node}/task/${TASK_ADDRESS}/authlist`, {
              authdata,
            })
            .then((res) => res.data === window.k2.publicKey.toString())
            .catch((error) =>
              console.log(`Error fetching authlist from ${node}:`, error)
            )
        );

        const results = await Promise.allSettled(requests);
        for (const result of results) {
          if (result.status === "fulfilled" && result.value) {
            return true;
          }
        }
        return false;
      } catch (error) {
        console.log("Error getting node list:", error);
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}
