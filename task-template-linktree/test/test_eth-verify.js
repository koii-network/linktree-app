const Web3 = require('web3');
const web3 = new Web3();
const bs58 = require('bs58');
const ethUtil = require('ethereumjs-util');

function verifySignature(payload) {
    try {
        const { data, publicKey, signature } = payload;
    
        // Decode the signature
        const signatureBuffer = bs58.decode(signature);
        const r = signatureBuffer.slice(0, 32);
        const s = signatureBuffer.slice(32, 64);
        const v = signatureBuffer.slice(64);
    
        // Hash the message
        const message = JSON.stringify(data);
        const messageHash = web3.utils.keccak256(message);
    
        // Recover the signer's public key
        const publicKeyRecovered = ethUtil.ecrecover(
          ethUtil.toBuffer(messageHash),
          v[0],
          r,
          s
        );
    
        // Convert the recovered public key to an Ethereum address
        const recoveredAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKeyRecovered));
    
        // Check if the recovered address matches the provided public key
        if (recoveredAddress.toLowerCase() === publicKey.toLowerCase()) {
          console.log('Payload signature is valid');
          return true;
        } else {
          console.log('Payload signature is invalid');
          return false;
        }
      } catch (error) {
        console.error('Error while verifying payload:', error);
        return false;
      }
  }
const data = {
    uuid: "235e8e0e-5689-488a-98aa-930a4594d15c",
    linktree: [
      {
        key: 'official',
        label: 'Official Website',
        redirectUrl: 'https://spheron.network/',
      },
      {
        key: 'twitter',
        label: 'Twitter',
        redirectUrl: 'https://twitter.com/blockchainbalak',
      },
      {
        key: 'github',
        label: 'GitHub',
        redirectUrl: 'https://github.com/spheronFdn/',
      },
    ],
    timestamp: 1682450104081,
  };
const payload = {
    data,
    publicKey: '0x80e291ff7e5587942bb22cf0f63faaa34820ac59',
    signature: '7uY2UX4nsg6dqXKLqdnuLE22HT7HhA97g9NXNgHwR5fte3Tjwo3h5zzHQYzGgmxH8oTTAg8poHFH44T9A6PF1QVkP'
  };
  
verifySignature(payload);