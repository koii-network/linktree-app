import { createContext, useState, useContext, useEffect } from "react";
import { getNodeList } from "../helpers";

export const WalletContext = createContext(undefined);

export const WalletContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  
  useEffect(() => {
    async function getRandomeNode() {
      try {
        const nodeList = await getNodeList();
        const randomNode = nodeList[Math.floor(Math.random() * nodeList.length)];

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
