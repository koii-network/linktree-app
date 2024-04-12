const express = require('express');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const cors = require('cors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { namespaceWrapper } = require('../environment/namespaceWrapper');
const formidable = require('formidable');
const SpheronClient = require('@spheron/storage');
const ProtocolEnum = SpheronClient.ProtocolEnum;
const token = process.env['SPHERON_KEY'];
const path = require('path');
const uuid = require('uuid');
const fetch = require('node-fetch');
const a = import('./cidUtil.mjs');

router.use(cors());


// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

router.get('/taskState', async (req, res) => {
  const state = await namespaceWrapper.getTaskState();
  // console.log('TASK STATE', state);

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
    if (!linktree.publicKey && !linktree.signature && !linktree.username) {
      res.status(400).json({
        error: 'Missing publicKey or signature or linktree username',
      });
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
    const user = await db.getLinktreeWithUsername(linktree.username);
    console.log({ user });
    if (user) return res.sendStatus(406);
    const pubKey = await db.getLinktreeWithPubKey(pubkey);
    console.log(pubKey);
    if (pubKey) return res.sendStatus(406);

    await db.setLinktree(pubkey, linktree);

    await db.setProofs(pubkey, proofs);

    return res
      .status(200)
      .send({ message: 'Proof and linktree registered successfully' });
  } catch (e) {
    console.log(e);
  }
});

router.put('/linktree', async (req, res) => {
  const linktree = req.body.payload;
  if (!linktree.publicKey && !linktree.signature) {
    res.status(400).json({ error: 'Missing publicKey or signature' });
    return;
  } else {
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
      // Use the code below to sign the data payload
      let signature = linktree.signature;
      let pubkey = linktree.publicKey;

      let proofs = {
        publicKey: pubkey,
        signature: signature,
      };

      await db.updateLinktree(pubkey, linktree);

      await db.setProofs(pubkey, proofs);

      return res
        .status(200)
        .send({ message: 'Proof and linktree registered successfully' });
    } catch (e) {
      res.status(400).json({ error: 'Invalid signature' });
    }
    console.log('Signature verified');
  }
});

router.delete('/linktree/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let linktree = await db.deleteLinktree(publicKey);
  return res.status(200).send(publicKey);
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
router.get('/linktree/get/username/:username', async (req, res) => {
  const { username } = req.params;
  let linktree = await db.getLinktreeWithUsername(username);
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
  // console.log('publicKey req', publicKey);
  let authlist = await db.getAuthList(publicKey);
  // console.log('AUTHLIST', authlist);
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
const client = new SpheronClient.SpheronClient({ token });
const TASK_ID = 'GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L';
router.post('/upload', async (req, res) => {
  if (!fs.existsSync(`${__dirname}/../namespace/${TASK_ID}/uploads/`)) {
    fs.mkdirSync(`${__dirname}/../namespace/${TASK_ID}/uploads`, {
      recursive: true,
    });
  }
  console.log(formidable);
  console.log(
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
  );
  console.log(formidable.IncomingForm);
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(`${__dirname}/../namespace/${TASK_ID}/uploads`); // Directory to save uploaded files
  console.log(form.uploadDir);
  form.keepExtensions = true; // Keep file extension

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error during file upload:', err);
      res.status(500).send('An error occurred during the file upload.');
      return;
    }
    console.log(files);
    const oldPath = files.file[0].filepath;
    const tmpFolderName = uuid.v4();
    fs.mkdirSync(path.join(form.uploadDir, tmpFolderName));
    const newPath = path.join(form.uploadDir, tmpFolderName, 'avatar.jpeg');

    // Move the file to the desired directory
    fs.rename(oldPath, newPath, err => {});
    let jj;
    let b = await a;
    const CID = await b.getCID(
      form.uploadDir + '/' + tmpFolderName + '/avatar.jpeg',
    );
    console.log({ CID });
    res.json(CID);
    try {
      jj = await client.upload(
        form.uploadDir + '/' + tmpFolderName + '/avatar.jpeg',
        {
          protocol: ProtocolEnum.IPFS,
          name: 'avatar.jpeg',
          onUploadInitiated: uploadId => {
            console.log(`Upload with id ${uploadId} started...`);
          },
        },
      );
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
    console.log(jj);
    try {
      fs.renameSync(
        path.join(
          __dirname,
          `../namespace/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/uploads/${tmpFolderName}`,
        ),
        path.join(
          __dirname,
          `../namespace/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/uploads/${jj.cid}`,
        ),
      );
    } catch (e) {
      fs.rmSync(
        path.join(
          __dirname,
          `../namespace/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/uploads/${tmpFolderName}`,
        ),
        { recursive: true, force: true },
      );
    }
    // res.json(jj);
  });
});
router.get('/images/:id', async (req, res) => {
  let id = req.params.id;
  const file = path.join(
    __dirname,
    `../namespace/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/uploads/`,
    id,
    '/avatar.jpeg',
  );
  if (fs.existsSync(file)) {
    console.log(file);
    return res.sendFile(file);
  }
  try {
    const resp = await fetch(`https://${id}.ipfs.sphn.link/avatar.jpeg`);
    if (resp.ok) {
      const buff = await resp.buffer();
      fs.mkdirSync(
        path.join(
          __dirname,
          `../namespace/GkW95C7wt5CoWDPVbjDM9tL6pyQf3xDfCSG3VaVYho1L/uploads/`,
          id,
        ),
        { recursive: true },
      );
      fs.writeFileSync(file, buff);
      res.sendFile(file);
    } else return res.sendStatus(404);
  } catch (e) {
    res.sendStatus(404);
  }
});

module.exports = router;
