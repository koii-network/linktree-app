import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { TASK_NODES_URL } from "../config";

export const WalletContext = createContext(undefined);

export const WalletContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  useEffect(() => {
    async function getObjectCount() {
      try {
        const response = await axios.get(TASK_NODES_URL);
        const data = response.data;
        const objectCount = data.length;

        return objectCount;
      } catch (error) {
        console.log(error);
      }
    }
    async function generateRandomNode() {
      const count = await getObjectCount();
      const randomNode = Math.floor(Math.random() * count) + 1;
      const url = `https://tasknet-ports-${randomNode}.koii.live/task/6FgtEX6qd4XCuycUfJGuJTr41qcfvM59ueV2L17eSdan`;
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
