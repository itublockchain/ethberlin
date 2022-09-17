// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Merkle.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract VoteToken is ERC20 {
    using BitMaps for BitMaps.BitMap;

    bytes32 public merkleRoot;
    uint48 public claimDeadline;
    BitMaps.BitMap private claimed;

    constructor(
        uint256 voterAmount,
        bytes32 root,
        uint48 deadline
    ) ERC20("VoteToken", "VT") {
        mint(address(this), voterAmount);
        merkleRoot = root;
        claimDeadline = deadline;
    }

    function claim(bytes32[] calldata merkleProof) external isDeadline {
        bytes32 leafNode = keccak256(abi.encodePacked(msg.sender, "1"));
        (bool v, uint256 i) = MerkleProof.verify(
            merkleProof,
            merkleRoot,
            leafNode
        );

        require(v, "Not matching.");
        require(!claimed.get(i), "Already minted.");
        claimed.set(i);

        transfer(msg.sender, 1);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(address to, uint256 amount) private {
        _mint(to, amount);
    }

    modifier isDeadline() {
        require(uint48(block.timestamp) < claimDeadline, "Deadline is over.");
        _;
    }
}
