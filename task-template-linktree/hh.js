const gg = e => {
  console.log(e.map(d => d.linktree.data)[2]);
};
const Datastore = require('nedb-promises');

const db = new Datastore('./KOIIDB');
db.find({
  username: 'PexelSoft',
}).then(gg);

