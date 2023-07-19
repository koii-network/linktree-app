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

    const data = {
      uuid: uuidv4(),
      linktree: {
        name: 'Linktree test',
        description: 'Linktree test description',
        image:
          'https://www.koii.network/_next/image?url=%2FKoiiNetwork-logo_128.png&w=48&q=75',
        background: '',
        links: [
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
    const pubkey = bs58.encode(publicKey);
    const sign = bs58.encode(signature);
    const payload = {
      data,
      publicKey: pubkey,
      signature: sign,
    };
    // console.log(pubkey)

    // Check payload
    // console.log(payload);

    await axios
      .post(
        'https://k2-tasknet-ports-2.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
        { payload },
      )
      .then(e => {
        if (e.status != 200) {
          console.log(e);
        }
        console.log(e.data);
      })
      .catch(e => {
        console.error(e);
      });
    await axios
      .post(
        'https://k2-tasknet-ports-1.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
        { payload },
      )
      .then(e => {
        if (e.status != 200) {
          console.log(e);
        }
        console.log(e.data);
      })
      .catch(e => {
        console.error(e);
      });
    await axios
      .post(
        'https://k2-tasknet.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
        { payload },
      )
      .then(e => {
        if (e.status != 200) {
          console.log(e);
        }
        console.log(e.data);
      })
      .catch(e => {
        console.error(e);
      });
    await axios
      .post(
        'https://k2-tasknet-ports-3.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
        { payload },
      )
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
