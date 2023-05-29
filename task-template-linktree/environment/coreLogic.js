const { namespaceWrapper } = require('./namespaceWrapper');
const linktree_task = require('../linktree/linktree_task');
const linktree_validate = require('../linktree/linktree_validate');
const crypto = require('crypto');
const dataFromCid = require("../helpers/dataFromCid");
const db = require('../database/db_model');
const Linktree = require('../linktree');
class CoreLogic {
  constructor() {
    this.linktree = new Linktree();
  }
  
  async task() {
    const round = await namespaceWrapper.getRound();
    await this.linktree.task(round);
  }

  async fetchSubmission() {
    const round = await namespaceWrapper.getRound();
    return await this.linktree.generateSubmissionCID(round);
  }

  async generateDistributionList(round, _dummyTaskState) {
    return await this.generateDistributionList(round, _dummyTaskState)
  }

  async submitDistributionList(round) {
    // This upload the generated dustribution List

    console.log('SubmitDistributionList called');

    try {
      const distributionList = await this.generateDistributionList(round);

      const decider = await namespaceWrapper.uploadDistributionList(
        distributionList,
        round,
      );
      console.log('DECIDER', decider);

      if (decider) {

        const response =
          await namespaceWrapper.distributionListSubmissionOnChain(round);
        console.log('RESPONSE FROM DISTRIBUTION LIST', response);
      }

    } catch (err) {
      console.log('ERROR IN SUBMIT DISTRIBUTION', err);
    }
  }

  // this function is called when a node is selected to validate the submission value
  async validateNode(submission_value, round) {
  return await this.linktree.validateSubmissionCID(submission_value, round);
  }

  async shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState,
  ) => {

    try {
      console.log('Distribution list Submitter', distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round,
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        fetchedDistributionList = _dummyDistributionList;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }

      console.log('FETCHED DISTRIBUTION LIST', fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState,
      );

      // compare distribution list

      const parsed = fetchedDistributionList;
      console.log('compare distribution list', parsed, generateDistributionList);
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log('RESULT', result);
      return result;
    } catch (err) {
      console.log('ERROR IN VALIDATING DISTRIBUTION', err);
      return false;
    }
  };
  // Submit Address with distributioon list to K2
  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      console.log('inside try');
      console.log(
        await namespaceWrapper.getSlot(),
        'current slot while calling submit',
      );
      const submission = await this.fetchSubmission();
      console.log('SUBMISSION', submission);
      // submit the submission to the K2
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );
      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async auditTask(roundNumber) {

    console.log('auditTask called with round', roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      'current slot while calling auditTask',
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber,
    );
  }

  async auditDistribution(roundNumber) {
    console.log('auditDistribution called with round', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber,
    );
  }
}
const coreLogic = new CoreLogic();

module.exports = coreLogic;
