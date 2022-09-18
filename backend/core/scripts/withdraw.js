// Imports
const fs = require("fs");
const hre = require("hardhat");
const assert = require("assert")
const ethers = hre.ethers;
const buildGroth16 = require("websnark/src/groth16");
const websnarkUtils = require("websnark/src/utils");
const snarkjs = require("snarkjs");
const bigInt = snarkjs.bigInt;
const MerkleTree = require("fixed-merkle-tree").default;
console.log(MerkleTree);
const BigNumber = ethers.BigNumber;
// Imports End

// Config
const DeployedBlockNumber = 7612644;
const MerkleTreeHeight = 16;
// Config End

// Helpers
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/** BigNumber to hex string of specified length */
function toHex(number, length = 32) {
  const str =
    number instanceof Buffer
      ? number.toString("hex")
      : bigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}
// Helpers End

// Globals
let groth16;
let proving_key;
let circuit;
// Globals End

async function main() {
  // Init
  groth16 = await buildGroth16();
  proving_key = fs.readFileSync(
    __dirname + "/../build/circuits/withdraw_proving_key.bin"
  ).buffer;
  circuit = require(__dirname + "/../build/circuits/withdraw.json");

  // Get contract
  const mixer_abi = [
    "function deposit(bytes32 _commitment) external payable",
    "event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp)",
    "event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)",
  ];
  const mixer_address = "0xac2f3c55f44fac9ca32e11a46ee9790da06b46d0";
  const mixer = new hre.ethers.Contract(
    mixer_address,
    mixer_abi,
    await ethers.getSigner()
  );

  const depositData =
  {
    nullifier: 371839601167009314117309640826339991277441053082062354110933543632372513517n,
    secret: 112268577333654903174567806180167052506933415890239378559457047922052292052n,
    commitment: 10140178519925903096712234613841084324931422023578738186947636903596878089128n,
    commitmentHex: '0x166b233d5a0e0373b7f3cf132134df66496e336acbcc109fa504fb1011424ba8',
    nullifierHash: 4087611838739482122979981117543334589731235617885010914398158185361008534505n,
    nullifierHex: '0x0909819dbd1edb1235c10a79707ee17ff96a459fab4c2f3b3e18d34b124ca3e9'
  }  

  // Withdraw
  console.log(
    await withdraw({
      mixer,
      deposit: depositData,
      currency: "test",
      amount: 1,
      recipient: "0x11d81326480CCee08d08CF0048B1868d1f43A1B0"
    })
  );
}

/**
 * Do an ETH withdrawal
 * @param noteString Note to withdraw
 * @param recipient Recipient address
 */
async function withdraw({ mixer, deposit, currency, amount,recipient }) {
  // using private key
  const { proof } = await generateProof({
    mixer,
    deposit,
    currency,
    amount,
    recipient
  });
  return { proof };
}

/**
 * Generate SNARK proof for withdrawal
 * @param deposit Deposit object
 * @param recipient Funds recipient
 * @param relayer Relayer address
 * @param fee Relayer fee
 * @param refund Receive ether for exchanged tokens
 */
async function generateProof({ mixer, deposit, currency, amount, recipient }) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = await generateMerkleProof(
    mixer,
    deposit,
    currency,
    amount
  );

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(0),
    fee: bigInt(0),
    refund: bigInt(0),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: pathElements.map(x => bigInt(x)),
    pathIndices: pathIndices,
  };

  console.log("Generating SNARK proof");
  console.time("Proof time");
  console.log(groth16);
  console.log(input);
  const proofData = await websnarkUtils.genWitnessAndProve(
    groth16,
    input,
    circuit,
    proving_key
  );
  const { proof } = websnarkUtils.toSolidityInput(proofData);
  console.timeEnd("Proof time");

  return { proof };
}

/**
 * Generate merkle tree for a deposit.
 * Download deposit events from the tornado, reconstructs merkle tree, finds our deposit leaf
 * in it and generates merkle proof
 * @param deposit Deposit object
 */
async function generateMerkleProof(mixer, deposit, currency, amount) {
  let leafIndex = -1;
  // Get all deposit events from smart contract and assemble merkle tree from them
  const cachedEvents = await fetchEvents({
    mixer,
    type: "deposit",
    currency,
    amount,
  });

  const leaves = cachedEvents
    .sort((a, b) => a.leafIndex - b.leafIndex) // Sort events in chronological order
    .map((e) => {
      const index = BigNumber.from(e.leafIndex).toNumber();

      if (
        BigNumber.from(e.commitment).eq(BigNumber.from(deposit.commitmentHex))
      ) {
        leafIndex = index;
      }
      return BigNumber.from(e.commitment).toString();
    });
   
   console.log(leaves);
  const tree = new MerkleTree(MerkleTreeHeight, leaves);

  console.log(tree);
  // Validate that our data is correct
  const root = tree.root();
  // let isValidRoot, isSpent;

  // isValidRoot = await mixer.isKnownRoot(toHex(root));
  // isSpent = await mixer.isSpend(toHex(deposit.nullifierHash));

  // assert(isValidRoot === true, "Merkle tree is corrupted");
  // assert(isSpent === false, "The note is already spent");
  assert(leafIndex >= 0, "The deposit is not found in the tree");

  // Compute merkle proof of our commitment
  const { pathElements, pathIndices } = tree.path(leafIndex);
  console.log(pathElements.length);
  return { root, pathElements, pathIndices };
}

async function fetchEvents({ mixer, type, currency, amount }) {
  if (type === "withdraw") {
    type = "withdrawal";
  }

  let allEvents = [];
  const startBlock = DeployedBlockNumber + 1;

  console.log("Fetching", amount, currency.toUpperCase(), type, "events for");

  async function syncEvents() {
    try {
      // Somehow two times of the original value is returned
      // let targetBlock = Math.floor(
      //   (await ethers.getDefaultProvider().getBlockNumber()) / 2
      // );
      // TODO: Replace it
      const targetBlock = 7616644;
      console.log(targetBlock);

      let chunks = 1000;
      console.log("Querying latest events from RPC");

      for (let i = startBlock; i < targetBlock; i += chunks) {
        let fetchedEvents = [];

        function mapDepositEvents() {
          fetchedEvents = fetchedEvents.map(
            (values) => {
              if (values?.args == undefined)
                throw new Error("Args undefined for event");

              const { commitment, leafIndex, timestamp } = values.args;
              console.log(values);
              return {
                blockNumber: values.blockNumber,
                transactionHash: values.transactionHash,
                commitment,
                leafIndex: Number(leafIndex),
                timestamp,
              };
            }
            //   ({ blockNumber, transactionHash, returnValues }) => {
            //     const { commitment, leafIndex, timestamp } = returnValues;
            //     return {
            //       blockNumber,
            //       transactionHash,
            //       commitment,
            //       leafIndex: Number(leafIndex),
            //       timestamp,
            //     };
            //   }
          );
        }

        function mapWithdrawEvents() {
          fetchedEvents = fetchedEvents.map(
            (values) => {
              if (values?.args == undefined)
                throw new Error("Args undefined for event");

              const { nullifierHash, to, fee } = values.args;
              console.log(values);
              return {
                blockNumber: values.blockNumber,
                transactionHash: values.transactionHash,
                nullifierHash,
                to,
                fee,
              };
            }
            // ({ blockNumber, transactionHash, returnValues }) => {
            //   const { nullifierHash, to, fee } = returnValues;
            //   return {
            //     blockNumber,
            //     transactionHash,
            //     nullifierHash,
            //     to,
            //     fee,
            //   };
            // }
          );
        }

        async function fetchWeb3Events(i) {
          let j;
          if (i + chunks - 1 > targetBlock) {
            j = targetBlock;
          } else {
            j = i + chunks - 1;
          }
          // TODO: Here
          const filter = mixer.filters[capitalizeFirstLetter(type)]();
          const pastEvents = await mixer.queryFilter(filter, i, j);
          console.log(i, j, pastEvents);

          pastEvents.forEach(
            (r) => {
              fetchedEvents = fetchedEvents.concat(r);
              console.log(
                "Fetched",
                amount,
                currency.toUpperCase(),
                type,
                "events to block:",
                j
              );
            },
            (err) => {
              console.error(
                i + " failed fetching",
                type,
                "events from node",
                err
              );
              process.exit(1);
            }
          );

          if (type === "deposit") {
            mapDepositEvents();
          } else {
            mapWithdrawEvents();
          }
        }

        await fetchWeb3Events(i);

        allEvents.push(...fetchedEvents);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error while updating cache");
    }
  }

  await syncEvents();
  return allEvents;
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(-1);
  });
