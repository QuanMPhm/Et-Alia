Hi gang
before u run the things, you need to do
'cd hardhat-blockchain'
'npm install'

run webserver.py in webserver directory otherwise wont work


# GitBooks Blockchain-backed Document System

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

## How to Run

1. Clone the repo.
2. Navigate to `webserver/` and install dependencies:

```bash
pip install -r requirements.txt
