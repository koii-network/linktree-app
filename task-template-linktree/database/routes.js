const express = require('express');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const cors = require('cors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { namespaceWrapper } = require('../environment/namespaceWrapper');

router.use(cors());

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

router.get('/taskState', async (req, res) => {
  const state = await namespaceWrapper.getTaskState();
  console.log('TASK STATE', state);

  res.status(200).json({ taskState: state });
});

// API to register the linktree
router.post('/linktree', async (req, res) => {
  const linktree = req.body.payload;

  // Check data
  try {
    // Check req.body
    if (!linktree) {
      res.status(400).json({ error: 'Invalid request, missing data' });
      return;
    } else if (
      !linktree.data.uuid ||
      !linktree.data.linktree ||
      !linktree.data.timestamp
    ) {
      res.status(400).json({ error: 'Invalid request, missing data' });
      return;
    } else {
      console.log(linktree);
    }
  } catch (e) {
    console.log(e);
  }
  if (!linktree.publicKey && !linktree.signature) {
    res.status(400).json({ error: 'Missing publicKey or signature' });
    return;
  } else {
    // log the pubkey of the payload
    console.log('linktree', linktree.publicKey);
    try {
      // Verify the signature
      const isVerified = nacl.sign.detached.verify(
        new TextEncoder().encode(JSON.stringify(linktree.data)),
        bs58.decode(linktree.signature),
        bs58.decode(linktree.publicKey),
      );
      if (!isVerified) {
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }
    } catch (e) {
      res.status(400).json({ error: 'Invalid signature' });
    }
    console.log('Signature verified');
  }
  // Use the code below to sign the data payload
  let signature = linktree.signature;
  let pubkey = linktree.publicKey;

  let proofs = {
    publicKey: pubkey,
    signature: signature,
  };

  await db.setLinktree(pubkey, linktree);

  await db.setProofs(pubkey, proofs);

  return res
    .status(200)
    .send({ message: 'Proof and linktree registered successfully' });
});

router.get('/logs', async (req, res) => {
  const logs = fs.readFileSync('./namespace/logs.txt', 'utf8');
  res.status(200).send(logs);
});
// endpoint for specific linktree data by publicKey
router.get('/linktree/get', async (req, res) => {
  const log = 'Nothing to see here, check /:publicKey to get the linktree';
  return res.status(200).send(log);
});
router.get('/linktree/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let linktree = await db.getLinktree(publicKey);
  linktree = linktree || '[]';
  return res.status(200).send(linktree);
});

router.get('/linktree/list', async (req, res) => {
  let linktree = (await db.getAllLinktrees(true)) || '[]';
  return res.status(200).send(linktree);
});
router.get('/proofs/all', async (req, res) => {
  let linktree = (await db.getAllProofs()) || '[]';
  return res.status(200).send(linktree);
});
router.get('/proofs/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let proof = await db.getProofs(publicKey);
  proof = proof || '[]';
  return res.status(200).send(proof);
});
router.get('/node-proof/all', async (req, res) => {
  let linktree = (await db.getAllNodeProofCids()) || '[]';
  return res.status(200).send(linktree);
});
router.get('/node-proof/:round', async (req, res) => {
  const { round } = req.params;
  let nodeproof = (await db.getNodeProofCid(round)) || '[]';
  return res.status(200).send(nodeproof);
});
router.get('/authlist/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  console.log('publicKey req', publicKey);
  let authlist = await db.getAuthList(publicKey);
  console.log('AUTHLIST', authlist);
  authlist = authlist || '[]';
  return res.status(200).send(authlist);
});
router.get('/authlist/list', async (req, res) => {
  let authlist = (await db.getAllAuthList(false)) || '[]';
  authlist.forEach(authuser => {
    authuser = authuser.toString().split('auth_list:')[0];
  });
  return res.status(200).send(authlist);
});
router.post('/authlist', async (req, res) => {
  const pubkey = req.body.authdata.pubkey;
  // console.log("AUTHLIST", pubkey);
  //TODO Interprete the authdata value and set the authlist
  await db.setAuthList(pubkey);
  return res.status(200).send(pubkey);
});
router.get('/nodeurl', async (req, res) => {
  const nodeUrlList = await namespaceWrapper.getNodes();
  return res.status(200).send(nodeUrlList);
});
// router.post('/register-authlist', async (req, res) => {
//   const pubkey = req.body.pubkey;
//   await db.setAuthList(pubkey);
//   return res.status(200).send({message: 'Authlist registered successfully'});
// }
// )

module.exports = router;
