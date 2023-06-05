/**
 * unitTest.js
 * @description
 * This file gonna test the whole linktree task logic in one go.
 * In the delay time the REST API is working and the task is running.
 * During this time the user can submit the data to the task.
 * After the delay time the submission function will start.
 */

const dotenv = require('dotenv');
require('dotenv').config();
const Linktree = require('../linktree');
dotenv.config();

async function test_coreLogic() {
  // Set up the number of times the task is repeated.
  let repeat = 10;

  // Set up the delay time in milliseconds. During this time the REST API is working and can receive data.
  let delay = 10000;

  // Instead of calling the task node, hardcode ther round number.
  let round = 5;

  // Instead of calling the task node, hardcode the task state.
  const _dummyTaskState = {
    stake_list: {
      '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': 20000000000,
      '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': 10000000000,
    },
    bounty_amount_per_round: 1000000000,

    submissions: {
      1: {
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cd',
          slot: 1889700,
          round: 1,
        },
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cc',
          slot: 1890002,
          round: 1,
        },
      },
    },
    submissions_audit_trigger: {
      1: {
        // round number
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          // Data Submitter (send data to K2)
          trigger_by: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH', // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: false, // Submission is invalid(Slashed)
              voter: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ', // Voter
              slot: 1890003,
            },
          ],
        },
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': {
          // Data Submitter (send data to K2)
          trigger_by: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL', // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: true, // Submission is valid
              voter: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ', // Voter
              slot: 1890003,
            },
          ],
        },
      },
    },
  };

  // Start the task
  var linktreeTask = null;
  linktreeTask = new Linktree();
  console.log('started a new linktree test');

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let i = 0; i < repeat; i++, round++) {

    console.log('new round started at ', round)
    // Wait for the delay time
    await sleep(delay);

    console.log('round', round);

    // Main function of the task
    await linktreeTask.task(round);
    console.log('task completed');

    // Fetch the submission CID
    let proof_cid = await linktreeTask.generateSubmissionCID(round);
    console.log('got round result', proof_cid);

    // TEST in case upload to Web3Storage many times, use the hardcode CID below
    // let proof_cid ='bafybeiatlrlmpnzt6jqrj2rvfkc3n377kswwmwpzxst3awl6sgutwo6miy';

    // Validate the submission CID
    let vote = await linktreeTask.validateSubmissionCID(proof_cid, round);

    // TEST in case the submission is not valid, set the vote to true
    // let vote = true;
    console.log('validated round result', vote);

    // Generate the distribution list
    if (vote == true) {
      console.log('Submission is valid, generating distribution list');
      const distributionList = await linktreeTask.generateDistribution(
        1,
        _dummyTaskState,
      );
      console.log('distributionList', distributionList);
    } else {
      console.log('Submission is invalid, not generating distribution list');
    }
  }
  
  console.log('test completed')
}

test_coreLogic();
