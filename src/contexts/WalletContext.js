import { createContext, useState, useContext } from "react";

export const WalletContext = createContext(undefined);

export const WalletContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        setPublicKey,
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
