const { namespaceWrapper } = require('./environment/namespaceWrapper');
const db = require('./database/db_model');
const linktree_task = require('./linktree/linktree_task');
const linktree_validate = require('./linktree/linktree_validate');

/**
 * @class Linktree
 * @description
 * Linktree is a class that contains all the logic for a task.
 * It is instantiated by the task runner, and is passed a database to store data in.
 *
 *
 * 1. task() -> generates submission data to local db
 * 2. generateSubmissionCID() -> uploads submission data to IPFS and returns CID
 * 3. validateSubmissionCID() -> validates submission data by replicating the process of creating it
 * 4. generateDistribution() -> scores submissions and distributes rewards
 * */
class Linktree {
  // Tasks produce submissions and log them to a LOCAL database
  task = async round => {
    // run linktree task
    console.log('*********task() started*********');

    const proof_cid = await linktree_task();

    if (proof_cid) {
      await db.setNodeProofCid(round, proof_cid); // store CID in levelDB
      // console.log('Node Proof CID stored in round', round);
    } else {
      console.log('CID NOT FOUND');
    }

    console.log('*********task() completed*********');
  };

  // To prove work, each node will submit it's 'submission' at the end of the round, by collecting data from it's Local Database and uploading to IPFS
  generateSubmissionCID = async round => {
    // The logic to fetch the submission values and return the cid string

    // fetching round number to store work accordingly

    console.log('***********IN FETCH SUBMISSION**************');
    // The code below shows how you can fetch your stored value from level DB

    let proof_cid = await db.getNodeProofCid(round); // retrieves the cid
    // console.log('Linktree proofs CID', proof_cid, 'in round', round);

    return proof_cid;
  };

  // Each submission can be validated by replicating the process of creating it
  validateSubmissionCID = async (submission_value, round) => {
    // console.log('Received submission_value', submission_value, round);

    // import the linktree validate module
    const vote = await linktree_validate(submission_value, round);
    // console.log('Vote', vote);
    return vote;
  };

  // Once all submissions have been audited, they can be scored to distribute rewards
  generateDistribution = async (round, _dummyTaskState) => {
    try {
      // console.log('GenerateDistributionList called');
      // console.log('I am selected node');
      // console.log('Round', round, 'Task State', _dummyTaskState);
      // The logic to generate the distribution list here

      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();

      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;

      // console.log('Task Account Data', taskAccountDataJSON);

      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];

      if (submissions == null) {
        // console.log('No submisssions found in N-2 round');
        return distributionList;
      } else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;
        // console.log('Submissions from last round: ', keys, values, size);

        // Logic for slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            // console.log(
            //   'distributions_audit_trigger votes ',
            //   submissions_audit_trigger[candidatePublicKey].votes,
            // );
            const votes = submissions_audit_trigger[candidatePublicKey].votes;
            if (votes.length === 0) {
              // slash 70% of the stake as still the audit is triggered but no votes are casted
              // Note that the votes are on the basis of the submission value
              // to do so we need to fetch the stakes of the candidate from the task state
              const stake_list = taskAccountDataJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              // console.log('Candidate Stake', candidateStake);
            } else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskAccountDataJSON.stake_list;
                const candidateStake = stake_list[candidatePublicKey];
                const slashedStake = candidateStake * 0.7;
                distributionList[candidatePublicKey] = -slashedStake;
                // console.log('Candidate Stake', candidateStake);
              }

              if (numOfVotes > 0) {
                distributionCandidates.push(candidatePublicKey);
              }
            }
          } else {
            distributionCandidates.push(candidatePublicKey);
          }
        }
      }

      // now distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward

      const reward =
        taskAccountDataJSON.bounty_amount_per_round /
        distributionCandidates.length;
      // console.log('REWARD RECEIVED BY EACH NODE', reward);
      for (let i = 0; i < distributionCandidates.length; i++) {
        distributionList[distributionCandidates[i]] = reward;
      }

      // console.log('Distribution List', distributionList);

      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
    }
    // This function indexes a list of submissions, scores each of them, and returns a final reward for each submitter pubkey
    let distributionList = [];

    return distributionList;
  };

  // NOTE: There is no need for a 'validateDistribution' function, as distributions are fully deterministic based on the data submitted on-chain
  // In some cases a distribution may require special validation, in which case coreLogic.js can be edited directly
}

module.exports = Linktree;
