/**
 * This is the main file for the task-template-linktree.
 * 
 * This task is a simple example of a task that can be run on the K2 network.
 * The task is to store the linktree data, which is a list of links to social media profiles.
 * The task is run in rounds, and each round, each node submits a linktree.
 * 
 * 
 */

const coreLogic = require("./environment/coreLogic");
const dbSharing = require("./database/dbSharing");
// const localShim = require("./localTestingShim"); // TEST to enable testing with K2 without round timers, enable this line and line 59
const { app, MAIN_ACCOUNT_PUBKEY, SERVICE_URL, TASK_ID } = require("./environment/init");
const express = require('express');
const { namespaceWrapper, taskNodeAdministered } = require("./environment/namespaceWrapper");
const {default: axios} = require('axios');
const bs58 = require('bs58');
const solanaWeb3 = require('@solana/web3.js');
const nacl = require('tweetnacl');
const fs = require('fs');
const db = require('./database/db_model');
const routes = require('./database/routes');
const path = require('path');

async function setup() {
  
  const originalConsoleLog = console.log;
  const logDir = './namespace';
  const logFile = 'logs.txt';
  const maxLogAgeInDays = 3;
  
  // Check if the log directory exists, if not, create it
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  // Create a writable stream to the log file
  const logPath = path.join(logDir, logFile);
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });
  
  // Function to remove logs older than specified age (in 3 days)
  async function cleanOldLogs(logDir, logFile, maxLogAgeInDays) {
    const currentDate = new Date();
    const logPath = path.join(logDir, logFile);
  
    if (fs.existsSync(logPath)) {
      const fileStats = fs.statSync(logPath);
      const fileAgeInDays = (currentDate - fileStats.mtime) / (1000 * 60 * 60 * 24);
  
      if (fileAgeInDays > maxLogAgeInDays) {
        fs.unlinkSync(logPath);
      }
    }
  }
  
  // Overwrite the console.log function to write to the log file
  console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    const message = args
      .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
      .join(' ') + '\n';
  
    // Write the message to the log file
    logStream.write(message);
  };
  
  // Clean old logs
  await cleanOldLogs(logDir, logFile, maxLogAgeInDays);

  console.log("setup function called");
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on("message", (m) => {
    console.log("CHILD got message:", m);
    if (m.functionCall == "submitPayload") {
      console.log("submitPayload called");
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == "auditPayload") {
      console.log("auditPayload called");
      coreLogic.auditTask(m.roundNumber);
    }
    else if(m.functionCall == "executeTask") {
      console.log("executeTask called");
      coreLogic.task(m.roundNumber);
    }
    else if(m.functionCall == "generateAndSubmitDistributionList") {
      console.log("generateAndSubmitDistributionList called");
      coreLogic.submitDistributionList(m.roundNumber);
    }
    else if(m.functionCall == "distributionListAudit") {
      console.log("distributionListAudit called");
      coreLogic.auditDistribution(m.roundNumber);
    }
  });

    // Code for the data replication among the nodes
    setInterval(() => {
      dbSharing.share();
    }, 20000);

    // localShim(); // TEST enable this to run the localShim for testing with K2 without timers

}

if (taskNodeAdministered){
  setup();
}


if (app) {
  app.use(express.json());
  app.use('/', routes)



}

