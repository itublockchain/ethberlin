// Imports
const hre = require("hardhat");
// Imports End

// Config
const TokenDenomination = 1;
const MerkleTreeHeight = 16;
const Hasher = "0xc93fafB0Ce23071a7e9c9506E8778Bc4F3D3bAbB";

async function main() {
  const Token = await hre.ethers.getContractFactory("TestToken");
  const token = await Token.deploy();

  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();

  const ERC20Mixer = await hre.ethers.getContractFactory("ERC20Tornado");
  const erc20Mixer = await ERC20Mixer.deploy(
    verifier.address,
    Hasher,
    TokenDenomination,
    MerkleTreeHeight,
    token.address
  );

  console.log(`Token deployed at ${token.address}`);
  console.log(`ERC20 Mixer deployed at ${erc20Mixer.address}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(-1);
  });
