const { SERVICE_URL, TASK_ID } = require('../environment/init');
const { default: axios } = require('axios');
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

//
//
//

/**
 * @function share
 * @description
 * This function is called when the node is selected to share the linktree with other nodes.
 * It will fetch the linktrees from other nodes and store them locally.
 */
const share = async () => {
  try {
    console.log('start dbSharing');

    // find another node
    const nodesUrl = `${SERVICE_URL}/nodes/${TASK_ID}`;

    // check if the node is online
    const res = await axios.get(nodesUrl);
    if (res.status != 200) {
      console.error('Error', res.status);
      return;
    }

    if (!res.data) {
      console.error('No valid nodes running');
      return;
    }

    let nodeUrlList = res.data.map(e => {
      return e.data.url;
    });

    console.log('node List: ', nodeUrlList);

    // fetch local linktrees
    let allLinktrees = await db.getAllLinktrees();
    allLinktrees = allLinktrees || '[]';

    // for each node, get all linktrees
    for (let url of nodeUrlList) {
      console.log(url);
      const res = await axios.get(`${url}/task/${TASK_ID}/linktree/list`);
      if (res.status != 200) {
        console.error('ERROR', res.status);
        continue;
      }
      const payload = res.data;

      if (!payload || payload.length == 0) continue;
      for (let i = 0; i < payload.length; i++) {
        const value = payload[i];
        // Verify the signature
        try {
          const isVerified = nacl.sign.detached.verify(
            new TextEncoder().encode(JSON.stringify(value.data)),
            bs58.decode(value.signature),
            bs58.decode(value.publicKey),
          );

          if (!isVerified) {
            console.warn(`${url} is not able to verify the signature`);
            continue;
          } else {
            console.log('[IN DBSHARING] Signature Verified');
          }

          let localExistingLinktree = allLinktrees.find(e => {
            return e.uuid == value.data.uuid;
          });
          if (localExistingLinktree) {
            if (localExistingLinktree.data.timestamp < value.data.timestamp) {
              console.log('Updating linktree data');
              let proofs = {
                publicKey: value.publicKey,
                signature: value.signature,
              };
              await db.setLinktree(value.publicKey, value);
              await db.setProofs(value.publicKey, proofs);
            }
          } else {
            console.log('Linktree data already updated');
          }
        } catch (e) {
          console.error('ERROR', e);
        }
      }
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
};

module.exports = { share };
