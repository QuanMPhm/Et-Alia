![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Made with Flask](https://img.shields.io/badge/Flask-Backend-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Polkadot%20Westend%20Asset%20Hub-29ABE2)

---

## Overview

**Et Alia** is a decentralized, blockchain-powered version control system for markdown documents.  
Built on **Polkadot's Westend Asset Hub** and leveraging **Hardhat** for local smart contract deployment,  
it provides a trustless, tamper-resistant alternative to traditional version control.

Designed with flexibility and transparency in mind, Et Alia allows users to **upload, review, approve, merge, and permanently record** document commits onto the blockchain — ensuring every change is **auditable, immutable, and verifiable**.

---

## Tech Stack

- **Frontend**:
  - Vanilla HTML, CSS, JavaScript, Tailwind
- **Backend**:
  - Python (Flask)
- **Blockchain**:
  - Solidity Smart Contract (CommitStorage.sol)
  - Hardhat Development Environment
  - Polkadot Westend Asset Hub (deployment target)
- **Database**:
  - SQLite (user management)
- **Authentication**:
  - Secure login system with hashed passwords (`werkzeug.security`)
  - Roles: Author / Editor
  - Simple Email, Password, and Role system with `Flask-SQLAlchemy`
  
- **Version Control**:
  - Local Git integration (for tracking and committing file changes)

---

## Core Features

- **Markdown Upload & Blockchain Commit**:
  - Upload `.md` documents and trigger Git commits automatically.
  - Commits are recorded both locally and immutably on the blockchain.
- **Blockchain Commit Metadata Storage**:
  - Commit hashes, authors, messages, and timestamps saved on-chain.
- **User Role System**:
  - **Authors** submit documents for review.
  - **Editors** approve, merge, or reject submissions through a UI.
- **Conflict Detection & Smart Merging**:
  - Detects conflicts in simultaneous submissions.
  - Offers editors "Keep Current", "Keep New", or "Smart Merge" options.
- **Auditability**:
  - Every commit is verifiable via the Westend blockchain explorer.

---

## Smart Contract Integration

Et Alia utilizes a Solidity-based smart contract called [CommitStorage](./hardhat-blockchain/contracts/CommitStorage.sol).

On every successful document commit, the backend triggers a call to [`alertNewCommit()`](./hardhat-blockchain/contracts/CommitStorage.sol#L7), emitting an event with:

- Git Commit Hash
- Author Name
- Commit Message
- Timestamp

This mechanism guarantees **traceable, decentralized proof** of each document update.

**Deployed Smart Contract Explorer Link:**  
[View Contract on Polkadot Westend Asset Hub](https://blockscout-asset-hub.parity-chains-scw.parity.io/address/0x031a0698CCcB123504d0320b5edC01128529901A)

---

## Figma Mockups
https://www.figma.com/design/HKqvOkKSrs8Fgd4tigzxXD/author-collab-project?node-id=0-1&t=TjTgae4VlDGyKlRZ-1

## UI Screenshots

*(Screenshots coming soon — you can upload files into `/screenshots` and link them.)*






