import axios from "axios";

export const truncateAddress = (address) => {
  const firstSlice = address.slice(0, 6);
  const lastSlice = address.slice(38);

  return `${firstSlice}...${lastSlice}`;
};

export const fetchData = async (publicKey) => {
  let nodeList = []
  let nodeResponse = await axios.get(
    'https://tasknet.koii.live/nodes/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP'
  );
  for (let i = 0; i < nodeResponse.data.length; i++) {
    nodeList.push(nodeResponse.data[i].data.url);
    }
  console.log(nodeList)

  for (let i = 0; i < nodeList.length; i++) {
  try {
    const response = await axios.get(`${nodeList[i]}/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree/get/${publicKey}`);
    if (response.data && response.data.data) {
      console.log(`Data found in node ${i}:`, response.data.data);
      const userData = response.data.data.linktree;
      return userData;
    }
  } catch (error) {
    return 'Error'
  }
}
  return "Error";

};
