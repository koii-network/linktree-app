const { default: axios } = require('axios');
const { v4: uuidv4 } = require('uuid');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');
const crypto = require('crypto');

// This test submits linktrees from differnet publicKey to the service and stored in localdb
async function main() {
  try {
    const keyPair = nacl.sign.keyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
    // const {publicKey, secretKey} = nacl.sign.keyPair.fromSecretKey(
    //   new Uint8Array(JSON.parse(fs.readFileSync("./test_wallet.json", 'utf-8')))
    // );
    // console.log('publicKey', bs58.encode(publicKey));
    const data = {
      uuid: uuidv4(),
      linktree: {
        name: 'Saim Iqbal',
        description: 'Koii network',
        image:
          'https://bafybeifqlmydsok6qfg3vo33qsat4wswrjdneummyj7mc7w7sinziknriu.ipfs.w3s.link/Saim.jpg',
        background: '',
        links: [
          {
            key: 'telegram',
            label: 'Telegram',
            redirectUrl: 'https://t.me/saimkoii',
          },
          {
            key: 'twitter',
            label: 'Twitter',
            redirectUrl: 'https://twitter.com/s1mplecoder',
          },
          {
            key: 'instagram',
            label: 'Instagram',
            redirectUrl: 'https://www.instagram.com/saimiiqbal7/',
          },
          {
            key: 'official',
            label: 'Koii Network',
            redirectUrl: 'https://www.koii.network/',
          },
          {
            key: 'website',
            label: 'Koii Docs',
            redirectUrl: 'https://docs.koii.network/',
          },
        ],
      },
      timestamp: Date.now(),
    };
    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(data)));
    const signedMessage = nacl.sign(messageUint8Array, privateKey);
    const signature = signedMessage.slice(0, nacl.sign.signatureLength);
    const payload = {
      data,
      publicKey: bs58.encode(publicKey),
      signature: bs58.encode(signature),
    };

    // Check payload
    // console.log(payload);

    await axios
      .post('http://localhost:10000/linktree', { payload })
      .then(e => {
        if (e.status != 200) {
          console.log(e);
        }
        console.log(e.data);
      })
      .catch(e => {
        console.error(e);
      });
  } catch (e) {
    console.error(e);
  }
}

main();

module.exports = main;
