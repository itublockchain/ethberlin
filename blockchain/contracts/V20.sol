// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Merkle.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract VoteToken is ERC20 {
    using BitMaps for BitMaps.BitMap;

    bytes32 public merkleRoot;
    address public voteContract;
    uint48 public claimDeadline;
    BitMaps.BitMap private claimed;

    constructor(
        uint256 voterAmount,
        bytes32 root,
        uint48 deadline,
        address _voteContract
    ) ERC20("VoteToken", "VT") {
        mint(address(this), voterAmount);
        merkleRoot = root;
        claimDeadline = deadline;
        voteContract = _voteContract;
    }

    function claim(bytes32[] calldata merkleProof) external isDeadline {
        bytes32 leafNode = keccak256(abi.encodePacked(msg.sender));
        (bool v, uint256 i) = MerkleProof.verify(
            merkleProof,
            merkleRoot,
            leafNode
        );

        require(v, "Not matching.");
        require(!claimed.get(i), "Already minted.");
        claimed.set(i);

        _transfer(address(this), msg.sender, 1);
    }

    function findIndex(bytes32[] calldata _merkleProof)
        external
        view
        returns (uint256)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        (bool v, uint256 i) = MerkleProof.verify(
            _merkleProof,
            merkleRoot,
            leaf
        );
        require(v, "Not matching request.");
        return i;
    }

    function checkDistributed(uint256 _i) public view returns (bool) {
        return claimed.get(_i);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual override {
        uint256 currentAllowance = allowance(owner, spender);
        if ((currentAllowance != type(uint256).max) || spender != voteContract) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function mint(address to, uint256 amount) private {
        _mint(to, amount);
    }

    modifier isDeadline() {
        require(uint48(block.timestamp) < claimDeadline, "Deadline is over.");
        _;
    }
}
