import { createContext, useState, useContext, useEffect } from "react";
import { getNodeList } from "../helpers";
import { TASK_ADDRESS } from "../config";

export const WalletContext = createContext(undefined);

export const WalletContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [nodeList, setNodeList] = useState([]);
  const [isFinnieDetected, setIsFinnieDetected] = useState(false);
  useEffect(() => {
    async function getRandomeNode() {
      try {
        const nodeList = await getNodeList();
        setNodeList(nodeList);
        const randomIndex = Math.floor(Math.random() * nodeList.length);
        const randomNode = nodeList[randomIndex];

        return randomNode;
      } catch (error) {
        console.log(error);
      }
    }
    async function generateRandomNode() {
      const randomNode = await getRandomeNode();
      const url = `${randomNode}/task/${TASK_ADDRESS}`;
      setApiUrl(url);
    }
    generateRandomNode();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        setPublicKey,
        apiUrl,
        setApiUrl,
        nodeList,
        isFinnieDetected,
        setIsFinnieDetected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      `useWalletContext must be used inside WalletContextProvider`
    );
  }
  return context;
};
