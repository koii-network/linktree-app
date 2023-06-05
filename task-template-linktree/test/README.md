# Test code for linktree task

Under test folder, you will find several files that are used for testing the task. The most important file is `unitTest.js`. This file is used to test the core logic functions of the task. The file contains a set of test cases that can be used to test the core logic functions. 

# Testing Steps Locally

1. Install the dependencies
```bash
npm install or yarn install
```
2. create a .env file in the root directory and add the following variables
```env
SECRET_WEB3_STORAGE_KEY="<your_web3stroage_key>" 
```

3. Run the test
```bash
npm run test or yarn test
```

The linktree task will start running on the local machine. The test will start from round 5 and run 10 rounds. Before each round main task called it has 10s delay. You can change the round number, repeat time and delay time in the `unitTest.js` file.


# Testing File Explanation

## unitTest.js

This is the main test file. It provide a set of test cases that can be used to test the core logic functions. The test cases are divided into 3 parts: `linktree`, `generateSubmissionCID`, `validateSubmissionCID` and `generateDistribution`. Each part contains several test cases. You can add more test cases to test the core logic functions.

## check_task-status.js

This file is used to check the task status. It will check the task status and return the result. The result will be the task status that running on the K2.

## test_dbmodel.js

This file is used to test the database model. You can customize the database model to fit your task logic. The file contains a set of test cases that can be used to test the database model.

 - `dbmodel.getLinktree(PublicKey)`
 - `dbmodel.getAllLinktrees();`
 - `dbmodel.setLinktree(PublicKey, data);`
 - ...

Check `database/db_model.js` for more details that you can test on. Include linktree, proofs, node_proofs and authlist.

## test_endpoint.js

Use this file to test the GET endpoint. It will call the nodes endpoint and return the result. The endpoint url format is `<nodeurl>/task/<taskID>/<endpoint>`.

For example: use `https://k2-tasknet.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree/list` to get the list of linktree. For more endpoint and usage, you can check the `routes.js` file.

## test_nacl.js

This file is used to test the nacl module. It will generate the keypair and sign the message. It will return the result. The result will be the boolean of signature.


