![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Made with Flask](https://img.shields.io/badge/Flask-Backend-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Polkadot%20Westend%20Asset%20Hub-29ABE2)

---

## Overview

Our project, Et Alia, is developing a decentralized version control system to help authors, scholars, and non-coders make collaboration easier for writing and review.

Oftentimes, when collaborating with multiple writers on a project, let that be a book, research paper, or something similar, there is a clash of ideas on what should make the final cut. Whereas a word processor like Google Docs or Microsoft Word only contains one version of the final draft that is shared among collaborators, Et Alia gives them a new version control system to check and approve additions and changes effortlessly. It offers more control and structure in the writing review process because it’s decentralized to ensure your information cannot be tampered with by a centralized source. Authors can upload a markdown document, or start with a blank one, and then commit changes for collaborators to approve, and the cycle continues as co-authors write their own versions of the document or chapter. Et Alia is user-friendly for non-technical audiences, specifically in the writing, research, and academic fields.

Decentralization is achieved by recording every file change on the blockchain. This is what distinguishes Et Alia from modern version control systems like Github. Whereas with Github, every commit is centrally stored on Github’s server, and Github itself is trusted as the source-of-truth for the user’s files through Trust-Of-First-Use. This means if Github is compromised, the user’s files can become compromised.
In contrast, with Et Alia, since every commit is stored on the blockchain, users no longer have to rely on a single entity to keep an accurate record of their file commits. Every user can instead verify the authenticity and integrity of their files by fetching the commit history from an untamperable and trusted blockchain.


---

## Tech Stack

- **Frontend**:
  - JavaScript, Tailwind CSS, Vite, React, TanStack Query, TanStack Router, MDX-Editor, Figma, Adobe Suite
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

<img width="1399" alt="Screenshot 2025-04-27 at 11 10 55 AM" src="https://github.com/user-attachments/assets/ddc517e2-c36f-4800-97cd-7f74f9b7b8ce" />

![image](https://github.com/user-attachments/assets/aa79adcb-7dca-4820-a562-749b829dfc07)

![image](https://github.com/user-attachments/assets/186f5392-ed69-49fa-bfa1-fc6546932102)

![image](https://github.com/user-attachments/assets/edc2e69f-170e-4a39-aff3-28d479232522)

![image](https://github.com/user-attachments/assets/089bee68-0fe8-49af-9780-46d85cf20f6f)





