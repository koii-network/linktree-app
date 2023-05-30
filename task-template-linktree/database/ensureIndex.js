const {namespaceWrapper} = require('../environment/namespaceWrapper');

// TODO Please put a line about what this function does here

async function ensureIndex() {
  const db = await namespaceWrapper.getDb();
    db.ensureIndex(
      { fieldName: 'linktreeId', sparse: true },
      function (err) {
        if (err) console.error('Index creation error:', err);
      },
    );
    db.ensureIndex(
      { fieldName: 'proofsId', sparse: true },
      function (err) {
        if (err) console.error('Index creation error:', err);
      },
    );
    db.ensureIndex(
      { fieldName: 'NodeProofsCidId', unique: true, sparse: true },
      function (err) {
        if (err) console.error('Index creation error:', err);
      },
    );
    db.ensureIndex(
      { fieldName: 'authListId', unique: true, sparse: true },
      function (err) {
        if (err) console.error('Index creation error:', err);
      },
    );
  }



module.exports = { ensureIndex };