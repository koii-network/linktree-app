import axios from "axios";
import bs58 from "bs58";
import { TASK_ADDRESS, RECIPIENT_ADDRESS, TRANSFER_AMOUNT } from "./config";
import {
  SystemProgram,
  Transaction,
  Connection,
  clusterApiUrl,
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
    let nodeListIndex = 0;
    let result;

    if (nodeList.length) {
      while (!result && nodeList[nodeListIndex]) {
        result = await axios
          .get(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/list`)
          .then((res) => res.data)
          .catch((error) => console.log(`Error fetching authlist:`, error));
        console.log(
          `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/list`,
          result
        );
        nodeListIndex++;
      }

      if (result) {
        const linktrees = [...result];
        const total = linktrees.length;
        return total;
      }
      return;
    }
  } catch (error) {
    console.log("Error getting node list:", error);
  }
}

export async function getLinktreeWithUsername(username, nodeList) {
  try {
    let nodeListIndex = 0;
    let result = {
      value: [],
    };

    console.log(nodeList);
    while (
      (result?.value || result?.value?.length === 0) &&
      nodeList[nodeListIndex]
    ) {
      const data = await axios
        .get(
          `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/get/username/${username}`
        )
        .then((res) => res.data)
        .catch((error) =>
          console.log(
            `Error fetching linktree with username from ${nodeList[nodeListIndex]}:`,
            error
          )
        );
      console.log(
        `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/get/username/${username}`,
        nodeList[nodeListIndex],
        data
      );
      if (data && data?.length !== 0) {
        result = data;
      }
      nodeListIndex++;
    }

    if (result && result?.length !== 0) {
      console.log(result);
      return {
        data: result,
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

  return false;
}

export async function getLinktree(publicKey, nodeList) {
  try {
    console.log(nodeList);
    let nodeListIndex = 0;
    let result = {
      value: [],
    };

    while (
      (!result || result?.value || result?.value?.length === 0) &&
      nodeList[nodeListIndex]
    ) {
      const data = await axios
        .get(
          `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/get/${publicKey}`
        )
        .then((res) => res.data)
        .catch((error) =>
          console.log(
            `Error fetching linktree with public Key from ${nodeList[nodeListIndex]}:`,
            error
          )
        );
      if (data && data?.length !== 0) result = data;
      nodeListIndex++;
    }

    if (result && result?.length !== 0 && !result.value) {
      return {
        data: result,
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

  return false;
}

export async function setLinktree(data, publicKey, nodeList, username) {
  const messageString = JSON.stringify(data);
  try {
    // await transferKoii(nodeList);
    const signatureRaw = await window.k2.signMessage(messageString);
    const payload = {
      data,
      publicKey: publicKey,
      signature: bs58.encode(signatureRaw.signature),
      username,
    };
    let nodeListIndex = 1;
    let result;

    while (!result && nodeList[nodeListIndex]) {
      result = await axios
        .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree`, {
          payload,
        })
        .then((res) => res.data)
        .catch((error) => console.log(`Error setting linktree:`, error));
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
  try {
    const signatureRaw = await window.k2.signMessage(messageString);
    const payload = {
      data,
      publicKey: publicKey,
      signature: bs58.encode(signatureRaw.signature),
      username,
    };
    let nodeListIndex = 1;
    let result;

    while (!result && nodeList[nodeListIndex]) {
      result = await axios
        .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree`, {
          payload,
        })
        .then((res) => res.data)
        .catch((error) => console.log(`Error updating linktree:`, error));
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

// export async function getAuthList(publicKey, nodeList) {
//   try {
//     const requests = nodeList.map((node) =>
//       axios
//         .get(`${node}/task/${TASK_ADDRESS}/authlist/get/${publicKey}`)
//         .then((res) => res.data)
//         .catch((error) =>
//           console.log(`Error fetching authlist from ${node}:`, error)
//         )
//     );

//     const results = await Promise.allSettled(requests);

//     for (const result of results) {
//       if (result.status === "fulfilled" && result.value === publicKey) {
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     console.log("Error getting node list:", error);
//   }
// }

// export async function transferKoii(nodeList) {
//   try {
//     const connection = new Connection(clusterApiUrl("devnet"));
//     const blockHash = await connection.getRecentBlockhash();
//     const feePayer = window.k2.publicKey;

//     const transaction = new Transaction();
//     transaction.recentBlockhash = blockHash.blockhash;
//     transaction.feePayer = feePayer;

//     transaction.add(
//       SystemProgram.transfer({
//         fromPubkey: window.k2.publicKey,
//         toPubkey: new window.solanaWeb3.PublicKey(RECIPIENT_ADDRESS),
//         lamports: Number(
//           TRANSFER_AMOUNT +
//             (await connection.getMinimumBalanceForRentExemption(100)) +
//             1000
//         ),
//       })
//     );

//     const payload = transaction.serializeMessage();
//     const signature = await window.k2.signAndSendTransaction(payload);

//     if (signature) {
//       const authdata = {
//         pubkey: window.k2.publicKey.toString(),
//       };
//       let nodeListIndex = 1;
//       let result;
//       while (!result) {
//         result = await axios
//           .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/authlist`, {
//             authdata,
//           })
//           .then((res) => res.data === window.k2.publicKey.toString())
//           .catch((error) =>
//             console.log(
//               `Error fetching authlist from ${nodeList[nodeListIndex]}:`,
//               error
//             )
//           );
//         nodeListIndex++;
//         if (result) return result;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
