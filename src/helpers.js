import axios from "axios";

export const truncateAddress = (address) => {
  const firstSlice = address.slice(0, 6);
  const lastSlice = address.slice(38);

  return `${firstSlice}...${lastSlice}`;
};

export const fetchData = async (publicKey) => {
  try {
    const response = await axios.get(
      `https://k2-tasknet-ports-3.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree/get/${publicKey}`
    );
    const userData = response.data.data.linktree;
    return userData;
  } catch (error) {
    console.log(error);
  }
};
