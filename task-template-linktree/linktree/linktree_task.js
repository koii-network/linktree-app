const {
  namespaceWrapper,
  taskNodeAdministered,
} = require('../environment/namespaceWrapper');
const dotenv = require('dotenv');
dotenv.config();
const { Web3Storage } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const db = require('../database/db_model');
const { Keypair } = require('@solana/web3.js'); // TEST For local testing

/**
 * @function linktree_task
 * @description
 * This is the main Linktree task function
 * It will call the database to get the linktree list
 * Then it will sign the list with the node's keypair
 * Then it will upload the signed list to IPFS and reture the CID
 */
const main = async () => {
  console.log('******/  IN Linktree Task FUNCTION /******');

  // Load node's keypair from the JSON file
  let keypair;
  if (taskNodeAdministered) {
    keypair = await namespaceWrapper.getSubmitterAccount();
  } else {
    // TEST For local testing, hardcode the keypair
    keypair = Keypair.generate();
  }

  // Get linktree list fron localdb
  const proofs_list_object = await db.getAllProofs();

  // Use the node's keypair to sign the linktree list
  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(proofs_list_object)),
  );

  const signedMessage = nacl.sign(messageUint8Array, keypair.secretKey);
  const signature = signedMessage.slice(0, nacl.sign.signatureLength);

  const submission_value = {
    proofs: proofs_list_object,
    node_publicKey: keypair.publicKey,
    node_signature: bs58.encode(signature),
  };

  // upload the proofs of the linktree on web3.storage
  try {
    const filename = `proofs.json`;

    // Uploading the image to IPFS
    const gameSalesJson = JSON.stringify(submission_value);
    const file = new File([gameSalesJson], filename, {
      type: 'application/json',
    });
    const proof_cid = await storageClient.put([file]);
    console.log('User Linktrees proof uploaded to IPFS: ', proof_cid);

    return proof_cid;
  } catch (err) {
    console.log('Error submission_value', err);
    return null;
  }
};

module.exports = main;
