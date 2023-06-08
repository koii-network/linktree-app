const axios = require('axios');

async function getObjectCount() {
  try {
    const response = await axios.get('https://tasknet.koii.live/nodes/6FgtEX6qd4XCuycUfJGuJTr41qcfvM59ueV2L17eSdan/');
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
  return randomNode;
}

generateRandomNode()
  .then((randomNode) => {
    const url = `https://tasknet-ports-${randomNode}.koii.live/task/6FgtEX6qd4XCuycUfJGuJTr41qcfvM59ueV2L17eSdan`;
    console.log('Random URL:', url);

    // Export API_URL here
    module.exports = {
      API_URL: url
    };
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Other constants
export const DOWNLOAD_FINNIE_URL =
  "https://chrome.google.com/webstore/detail/finnie/cjmkndjhnagcfbpiemnkdpomccnjblmj";
export const RECIPIENT_ADDRESS = "stakepotaccount2YjJnz34eyunRGBNrAFdMM4Rmwop";
export const Transfer_AMOUNT = 10000000000;
