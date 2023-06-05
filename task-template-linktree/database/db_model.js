const { namespaceWrapper } = require('../environment/namespaceWrapper');
const { ensureIndex } = require('./ensureIndex');

ensureIndex();


// Get a linktree from the database using the public key

const getLinktree = async (publicKey) => {
  const db = await namespaceWrapper.getDb();
  const linktreeId = getLinktreeId(publicKey);
  try {
    const resp = await db.findOne({linktreeId });
    if (resp) {
      return resp.linktree;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Store a linktree in the database using the public key

const setLinktree = async (publicKey, linktree) => {
  const db = await namespaceWrapper.getDb();
  try {
    const linktreeId = getLinktreeId(publicKey);
    await db.insert({ linktreeId, linktree });
    return console.log("Linktree set");
  } catch (err) {
    return undefined;
  }
}

// Get all linktrees from the database

const getAllLinktrees = async () => {
  const db = await namespaceWrapper.getDb();
  const linktreeListRaw = await db.find({
    linktree: { $exists: true },
  });
  let linktreeList = linktreeListRaw.map(linktreeList =>
    linktreeList.linktree
  );
  return linktreeList;
}

// Get proofs submited by a node given that node's public key

const getProofs = async (pubkey) => {
  const db = await namespaceWrapper.getDb();
  const proofsId = getProofsId(pubkey);
  try {
    const resp = await db.findOne({proofsId });
    if (resp) {
      return resp.proofs;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Store the proofs object in the database using the public key

const setProofs = async (pubkey, proofs) => {
  const db = await namespaceWrapper.getDb();
  try {
    const proofsId = getProofsId(pubkey);
    const result = await db.insert({ proofsId, proofs });
    console.log("Proofs set", result);
    return console.log("Proofs set");
  } catch (err) {
    return undefined;
  }
}

// Get all proofs from the database

const getAllProofs = async () => {
  const db = await namespaceWrapper.getDb();
  const proofsListRaw = await db.find({
    proofs: { $exists: true },
  });
  let proofsList = proofsListRaw.map(proofsList =>
    proofsList.proofs
  );
  return proofsList;
}

// Gets the CID associated with a given round of node proofs from the database.

const getNodeProofCid = async (round) => {
  const db = await namespaceWrapper.getDb();
  const NodeProofsCidId = getNodeProofCidid(round);
  try {
    const resp = await db.findOne({ NodeProofsCidId });
    if (resp) {
      return resp.cid;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Sets the CID associated with a given round of node proofs in the database.

const setNodeProofCid = async (round, cid) => {
  const db = await namespaceWrapper.getDb();
  try {
    const NodeProofsCidId = getNodeProofCidid(round);
    await db.insert({ NodeProofsCidId, cid });
    return console.log("Node CID set");
  } catch (err) {
    return undefined;
  }
}

// Gets all CIDs associated with node proofs from the database.

const getAllNodeProofCids = async () => {
  const db = await namespaceWrapper.getDb();
  const NodeproofsListRaw = await db.find({
    cid: { $exists: true },
  });
  let NodeproofsList = NodeproofsListRaw.map(NodeproofsList =>
    NodeproofsList.cid
  );
  return NodeproofsList;
}

// Get the AuthList from the database using the public key, if not found return null

const getAuthList = async (pubkey) => {
  const db = await namespaceWrapper.getDb();
  const authListId = getAuthListId(pubkey);  
  try {
    const resp = await db.findOne({ authListId });
    if (resp) {
      return resp.pubkey;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Store the AuthList in the database using the public key
// TODO: tx is the transaction of the public fund the bounty pool

const setAuthList = async (pubkey) => {
  const db = await namespaceWrapper.getDb();
  try {
    const authListId = getAuthListId(pubkey);
    await db.insert({ authListId, pubkey });
    return console.log('auth List pubkey set');
  } catch (err) {
    return undefined;
  }
}

// Gets all AuthList from the database.

const getAllAuthList = async () => {
  const db = await namespaceWrapper.getDb();
  const authListRaw = await db.find({
    authListId: { $exists: true },
  });
  let authList = authListRaw.map(authList => authList.pubkey);
  return authList;
}

const getNodeProofCidid = (round) => {
  return `node_proofs:${round}`;
}

const getLinktreeId = (publicKey) => {
  return `linktree:${publicKey}`;
}

const getProofsId = (pubkey) => {
  return `proofs:${pubkey}`;
}

const getAuthListId = (pubkey) => {
  return `auth_list:${pubkey}`;
}

module.exports = {
  getLinktree,
  setLinktree,
  getAllLinktrees,
  getProofs,
  setProofs,
  getAllProofs,
  getNodeProofCid,
  setNodeProofCid,
  getAllNodeProofCids,
  getAuthList,
  setAuthList,
  getAllAuthList,
  getAuthListId
}