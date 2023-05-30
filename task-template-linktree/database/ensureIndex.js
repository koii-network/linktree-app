const {namespaceWrapper} = require('../environment/namespaceWrapper');

/**
 * @function ensureIndex
 * @description
 * This function ensures that the database has the correct indexes for the task. 
 * It is called when the task is instantiated.
 * This function will make sure that the field has the unique property, and that the field is sparse.
 */

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