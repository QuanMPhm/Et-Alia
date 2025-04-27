// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CommitStorage {
    event CommitSaved(string fileName, bytes20 parentHash, bytes20 commitHash, string authorName, uint64 commitDate);

    function alertNewCommit(string calldata fileName, bytes20 parentHash, bytes20 commitHash, string calldata authorName, uint64 commitDate
    ) public {
        emit CommitSaved(fileName, parentHash, commitHash, authorName, commitDate);
    }
}
