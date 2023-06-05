# Koii Linktree Task


Welcome to the Koii Linktree

  

This is an application that runs as a [Koii task](https://docs.koii.network/develop/koii-task-101/what-are-tasks/).

  

The linktree app is divided into two parts:

  

- Front-end
- Task

  

## The Front-end
This app has been built using React and serves as a front-end interface. Its primary functionality revolves around connecting the user's Finnie wallet, a wallet designed for the Koii network.

### Connecting the Finnie Wallet

Once the user connects their Finnie wallet, the app retrieves the public address associated with the user's wallet. This address serves as a unique identifier.

### Retrieving and Displaying Linktree

After obtaining the user's public address, the app checks if the database contains a linktree associated with that address. If a linktree exists, the app proceeds to make a GET request to the task node endpoint, retrieving the relevant linktree data. This data is then displayed to the user, providing an organized collection of links.

### Creating a Linktree

In cases where a linktree does not exist for the user's public address, the app redirects the user to the "Create Linktree" page. Here, users can enter their details and customize their linktree according to their preferences. Once the user submits the required information, the app proceeds to make a POST request to the endpoint, storing the newly created linktree in the database.

By employing this flow, the app seamlessly enables users to connect their Finnie wallet, retrieve existing linktree data, and create new personalized linktrees. This enhances user experience and allows for efficient organization and sharing of important links and resources.

# The Task

The task is present in the nested folder **task-template-linktree**. This folder takes the [K2 Task template](https://docs.koii.network/develop/write-a-koii-task/task-development-guide/k2-task-template/#docusaurus_skipToContent_fallback) and turns it into the Linktree. More information on the linktree task can be found [here](https://docs.koii.network/develop/task-tutorials/linktree-task/intro#docusaurus_skipToContent_fallback).
## Testing locally
