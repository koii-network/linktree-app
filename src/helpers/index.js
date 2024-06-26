import axios from "axios";
import { TASK_ADDRESS } from "../config";

export const truncateAddress = (address) => {
  const firstSlice = address.slice(0, 6);
  const lastSlice = address.slice(38);

  return `${firstSlice}...${lastSlice}`;
};

export const fetchData = async (publicKey) => {
  let nodeList = await getNodeList();

  for (let i = 0; i < nodeList.length; i++) {
    try {
      const response = await axios.get(
        `${nodeList[i]}/task/${TASK_ADDRESS}/linktree/get/${publicKey}`
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
    `https://tasknet.koii.live/task/${TASK_ADDRESS}`,
    `https://tasknet-2.koii.live/task/${TASK_ADDRESS}`,
  ];

  try {
    let nodeResponse = await axios.get(
      `https://tasknet.koii.live/nodes/${TASK_ADDRESS}`
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

export function themeApplier(userTheme) {
  switch (userTheme) {
    case "Gradient":
      document.documentElement.setAttribute("data-theme", "gradient");
      break;
    case "Mint":
      document.documentElement.setAttribute("data-theme", "gradient_two");
      break;
    case "Dark":
      document.documentElement.setAttribute("data-theme", "dark");
      break;
    case "Gradient-Two":
      document.documentElement.setAttribute("data-theme", "gradient_two");
      break;
    default:
      break;
  }
}

export function createThemeApplier(theme) {
  switch (theme) {
    case "Dark":
      document.documentElement.setAttribute("data-theme", "dark_create");
      break;
    case "Mint":
      document.documentElement.setAttribute("data-theme", "light_create");
      break;
    case "Gradient":
      document.documentElement.setAttribute("data-theme", "gradient_create");
      break;
    case "Gradient-Two":
      document.documentElement.setAttribute(
        "data-theme",
        "gradient_two_create"
      );
      break;
    default:
      break;
  }
}

export function getRadioButtonScheme(theme) {
  if (theme === "Dark") {
    return "yellow";
  } else if (theme === "Gradient") {
    return "teal";
  } else if (theme === "Gradient-Two") {
    return "yellow";
  } else {
    return "purple";
  }
}
