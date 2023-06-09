import axios from "axios";

export const truncateAddress = (address) => {
  const firstSlice = address.slice(0, 6);
  const lastSlice = address.slice(38);

  return `${firstSlice}...${lastSlice}`;
};

export const fetchData = async (publicKey) => {
  let nodeList = await nodeList();

  for (let i = 0; i < nodeList.length; i++) {
    try {
      const response = await axios.get(
        `${nodeList[i]}/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ/linktree/get/${publicKey}`
      );
      if (response.data && response.data.data) {
        console.log(`Data found in node ${i}:`, response.data.data);
        const userData = response.data.data.linktree;
        return userData;
      }
    } catch (error) {
      return "Error";
    }
  }
  return "Error";
};

export const getNodeList = async () => {
  let nodeList = [];
  const fallbackNodes = [
    "https://tasknet.koii.live/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ",
    "https://tasknet-ports-2.koii.live/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ",
    "https://tasknet-ports-2.koii.live/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ",
  ];

  try {
    let nodeResponse = await axios.get(
      "https://tasknet.koii.live/nodes/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ"
    );
    for (let i = 0; i < nodeResponse.data.length; i++) {
      nodeList.push(nodeResponse.data[i].data.url);
    }
  } catch (error) {
    console.error(
      "Failed to fetch node list from primary node. Falling back to fallback nodes..."
    );
    nodeList = fallbackNodes;
  }

  return nodeList;
};

export const getBackUpNodeList = (randomIndex, nodeList) => {
  if (randomIndex + 2 < nodeList.length) {
    return [
      `${
        nodeList[randomIndex + 1]
      }/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ`,
      `${
        nodeList[randomIndex + 2]
      }/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ`,
    ];
  } else {
    return [
      `${
        nodeList[randomIndex - 1]
      }/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ`,
      `${
        nodeList[randomIndex - 2]
      }/task/6N5s2YwMZfUQjjuS3z2JDKLkJczZDQDrEQtWYZrbVRQJ`,
    ];
  }
};
