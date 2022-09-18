require("@nomiclabs/hardhat-ethers");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.7.0",
  networks: {
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_URL || "",
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};
