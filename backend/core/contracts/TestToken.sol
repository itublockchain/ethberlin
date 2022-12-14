// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
  constructor() ERC20("TestToken", "TT") {}

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}