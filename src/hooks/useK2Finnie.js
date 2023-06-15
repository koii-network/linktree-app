import { useEffect, useState } from "react";

export const useK2Finnie = () => {
  const [isFinnieDetected, setIsFinnieDetected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [k2PubKey, setK2PubKey] = useState(null);
  const [doesK2AccountExist, setDoesK2AccountExist] = useState(null);

  useEffect(() => {
    const handler = () => {
      setIsFinnieDetected(true);
    };

    window.addEventListener("finnieWalletLoaded", handler);

    return () => {
      window.removeEventListener("finnieWalletLoaded", handler);
    };
  }, []);

  const connect = async () => {
    if (window?.k2) {
      if (window.k2.isConnected) {
        const publicKey = window?.k2?.publicKey;
        setK2PubKey(publicKey.toString());
        setDoesK2AccountExist(true);
        return publicKey.toString();
      } else {
        return await window?.k2
          .connect()
          .then((pubKey) => {
            setIsConnected(true);
            setK2PubKey(pubKey.toString());
            setDoesK2AccountExist(true);
            return pubKey.toString();
          })
          .catch((error) => {
            if (error.code === 4001) {
              setDoesK2AccountExist(false);
            }
          });
      }
    }
    return Promise.reject(
      "Finnie is detected but K2 features are missing - is your Finnie up to date? "
    );
  };

  return {
    isFinnieDetected,
    isConnected,
    k2PubKey,
    doesK2AccountExist,
    connect,
    connected: !!window?.k2?.publicKey,
  };
};
