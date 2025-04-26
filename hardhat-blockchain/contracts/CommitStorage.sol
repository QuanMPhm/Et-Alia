// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommitStorage {
    struct Commit {
        string commitHash;
        string authorName;
        string commitMessage;
        string dateIso;
    }

    Commit[] public commits;

    event CommitSaved(string commitHash, string authorName, string commitMessage, string dateIso);

    function saveCommit(
        string memory _commitHash,
        string memory _authorName,
        string memory _commitMessage,
        string memory _dateIso
    ) public {
        commits.push(Commit(_commitHash, _authorName, _commitMessage, _dateIso));
        emit CommitSaved(_commitHash, _authorName, _commitMessage, _dateIso);
    }

    function getCommit(uint index) public view returns (Commit memory) {
        return commits[index];
    }

    function getCommitsCount() public view returns (uint) {
        return commits.length;
    }
}
