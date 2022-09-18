// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./V20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Election {
    uint256 candidateAmount;
    bytes32 merkleRoot;
    uint48 deadline;
    VoteToken voteToken;
}

contract Vote is Ownable {
    Election[] public elections;
    mapping(uint256 => mapping (uint256 => uint256)) public votes;

    function createElection(
        uint256 voterAmount,
        uint256 candidateAmount,
        uint48 deadline,
        bytes32 root
    ) external onlyOwner {
        VoteToken vt = new VoteToken(voterAmount, root, deadline, address(this));
        elections.push(
            Election(candidateAmount, root, deadline, vt)
        );
    }

    function voteElection(uint256 id, uint256 to) external {
        // require(id < elections.length, "Election doesn't exists");
        require(
            uint48(block.timestamp) < elections[id].deadline,
            "Deadline is over."
        );
        require(to < elections[id].candidateAmount, "No candidate.");

        elections[id].voteToken.transferFrom(msg.sender, address(this), 1);
        votes[id][to]++;
    }

    function electionCount() external view returns(uint256){
        return elections.length;
    }
}
