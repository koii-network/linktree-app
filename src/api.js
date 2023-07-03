import axios from "axios";
import bs58 from "bs58";
import { TASK_ADDRESS } from "./config";

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
    let nodeListIndex = 1;
    let result;

    while (result?.value) {
      result = await axios
        .get(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/list`)
        .then((res) => res.data)
        .catch((error) => console.log(`Error fetching authlist:`, error));
      nodeListIndex++;
    }

    if (result?.value) {
      const linktrees = [...result.value];
      const total = linktrees.length;
      return total;
    }
    return;
  } catch (error) {
    console.log("Error getting node list:", error);
  }
}

export async function getLinktreeWithUsername(username, nodeList) {
  try {
    let nodeListIndex = 1;
    let result = {
      value: [],
    };

    while (result?.value || result?.value?.length === 0) {
      result = await axios
        .get(
          `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/get/username/${username}`
        )
        .then((res) => res.data)
        .catch((error) => console.log(`Error fetching authlist:`, error));
      nodeListIndex++;
    }

    if (result && result?.length !== 0) {
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
    let nodeListIndex = 1;
    let result = {
      value: [],
    };

    while (result?.value || result?.value?.length === 0) {
      result = await axios
        .get(
          `${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/linktree/get/${publicKey}`
        )
        .then((res) => res.data)
        .catch((error) => console.log(`Error fetching authlist:`, error));
      nodeListIndex++;
    }

    if (result && result?.length !== 0) {
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
