# Et Alia 
Polkadot-backed Version Control System

## Overview
This project is a simplified GitHub-style system for uploading, committing, and tracking markdown documents. 
It uses a blockchain backend (Hardhat local node) to store commit metadata and allows different user roles 
(uploader, approver) with authentication.

## Tech Stack

- **Frontend**: 
  - Vanilla HTML, CSS, and JavaScript
- **Backend**: 
  - Python (Flask)
- **Blockchain**: 
  - Hardhat (Ethereum local node)
  - Solidity Smart Contract (CommitStorage)
- **Database**:
  - SQLite (for user authentication)
- **Authentication**:
  - Simple Email, Password, and Role system with `Flask-SQLAlchemy`
  - Passwords hashed using `werkzeug.security`
- **Version Control**:
  - Git (for local markdown commits)

## Key Features

- Upload and commit `.md` files
- Auto-git commit for each upload
- Store commit hashes and metadata (author, message, timestamp) on blockchain
- Login and signup system with user roles (Uploader, Approver)
- Approvers can view documents but not upload new ones
- Hardhat node used for local Ethereum simulation

## Smart Contract

Every time a commit is created, our backend will make a call to our [smart contract](./hardhat-blockchain/contracts/CommitStorage.sol) deployed on the Westend Asset Hub. Specifically, the backend calls [`alertNewCommit()`](./hardhat-blockchain/contracts/CommitStorage.sol#L7) with the commit's metadata, and the contract will emit an event contain this metadata. This allows the commit metadata to be stored on the blockchain, and therefore allows any user to verify the authenticity and accuracy of any file changes by fetching the commit metadata from the blockchain themselves.

You can find our contract on the Westend Asset Hut Block Explorer [here](https://blockscout-asset-hub.parity-chains-scw.parity.io/address/0x031a0698CCcB123504d0320b5edC01128529901A)

## Screenshots of our UI

## Figma Mockups
https://www.figma.com/design/HKqvOkKSrs8Fgd4tigzxXD/author-collab-project?node-id=0-1&t=TjTgae4VlDGyKlRZ-1

## Demo Video

- insert link here

## How to Run

Set the environment variable `SERVER_PK` to the private key the server will use to sign blockchain transactions

1. Clone the repo.
2. Navigate to `webserver/` and install dependencies:

```bash
pip install -r requirements.txt

To run the program, 'cd hardhat-blockchain' 'npm install'
run webserver.py in webserver directory otherwise wont work


