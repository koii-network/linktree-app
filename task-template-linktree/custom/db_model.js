const { namespaceWrapper } = require('../environment/namespaceWrapper');
const { ensureIndex } = require('./helpers/ensureIndex');

ensureIndex();


// db functions for linktree
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

// namespaceWrapper.levelDB functions for proofs
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

const setProofs = async (pubkey, proofs) => {
  const db = await namespaceWrapper.getDb();
  try {
    const proofsId = getProofsId(pubkey);
    await db.insert({ proofsId, proofs });
    return console.log("Proofs set");
  } catch (err) {
    return undefined;
  }
}

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

// db functions for node proofs
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

//db functions fro Auth list
const getAuthList = async (pubkey) => {
  const db = await namespaceWrapper.getDb();
  const authListId = getauthListid(pubkey);
  try {
    const resp = await db.findOne({ authListId });
    if (resp) {
      return resp.authList;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const setAuthList = async (pubkey) => {
  const db = await namespaceWrapper.getDb();
  try {
    const authListId = getauthListid(pubkey);
    await db.insert({ authListId, cid });
    return console.log('auth List CID set');
  } catch (err) {
    return undefined;
  }
}

const getAllAuthLists = async (values) => {
  const db = await namespaceWrapper.getDb();
  const authListRaw = await db.find({
    authList: { $exists: true },
  });
  let authList = authListRaw.map(authList => authList.authList);
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

const getAuthListId = (round) => {
  return `auth_list:${round}`;
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
  getAllAuthLists,
  getAuthListId
}