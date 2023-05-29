const dotenv = require('dotenv');
require('dotenv').config();
const Linktree = require('../linktree');
const db = require('../database/db_model');

// warning, this doesn't really work that well, but it's a start

const run = async () => {
    let delay = 600;
    var linktreeTask = null;
    let round = 5

    linktreeTask = new Linktree ();
    console.log('started a new linktree test');
        

    setTimeout(async ()  =>   {
        // await linktreeTask.task(round);
        // console.log('task completed')
        // let proof_cid = await linktreeTask.generateSubmissionCID(round);
        // console.log('got round result', proof_cid);
        let proof_cid = "bafybeiatlrlmpnzt6jqrj2rvfkc3n377kswwmwpzxst3awl6sgutwo6miy"
        let output = await linktreeTask.validateSubmissionCID(proof_cid, round);
        console.log('validated round result', output);


    }, delay)

}


run ()