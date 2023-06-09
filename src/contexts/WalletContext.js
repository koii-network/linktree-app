import { createContext, useState, useContext, useEffect } from "react";
import { getNodeList, getBackUpNodeList } from "../helpers";

export const WalletContext = createContext(undefined);

export const WalletContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [backUpNodeList, setBackUpNodeList] = useState("");
  useEffect(() => {
    async function getRandomeNode() {
      try {
        const nodeList = await getNodeList();
        const randomIndex = Math.floor(Math.random() * nodeList.length);
        const randomNode = nodeList[randomIndex];
        const backUpNodeList = getBackUpNodeList(randomIndex, nodeList);
        setBackUpNodeList(backUpNodeList);

        return randomNode;
      } catch (error) {
        console.log(error);
      }
    }
    async function generateRandomNode() {
      const randomNode = await getRandomeNode();
      const url = `${randomNode}/task/6FgtEX6qd4XCuycUfJGuJTr41qcfvM59ueV2L17eSdan`;
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
        backUpNodeList,
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
