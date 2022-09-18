// Imports
const hre = require("hardhat");
const snarkjs = require("snarkjs");
const circomlib = require("circomlib");
const crypto = require("crypto")
require("dotenv").config();
const bigInt = snarkjs.bigInt;
// Imports End

const netId = 5

// Helpers
/** Generate random number of specified byte length */
const rbigint = (nbytes) =>
  snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes));

/** Computes pedersen hash */
const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

/** BigNumber to hex string of specified length */
function toHex(number, length = 32) {
  const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16);
  return '0x' + str.padStart(length * 2, '0');
}

async function backupNote({ currency, amount, netId, note, noteString }) {
  try {
    await fs.writeFileSync(
      `./backup-tornado-${currency}-${amount}-${netId}-${note.slice(
        0,
        10
      )}.txt`,
      noteString,
      "utf8"
    );
    console.log(
      "Backed up deposit note as",
      `./backup-tornado-${currency}-${amount}-${netId}-${note.slice(0, 10)}.txt`
    );
  } catch (e) {
    throw new Error("Writing backup note failed:", e);
  }
}
// Helpers End

function createDeposit({ nullifier, secret }) {
  const deposit = { nullifier, secret };
  deposit.preimage = Buffer.concat([
    deposit.nullifier.leInt2Buff(31),
    deposit.secret.leInt2Buff(31),
  ]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);
  return deposit;
}

/**
 * Make a deposit
 * @param currency Сurrency
 * @param amount Deposit amount
 */
async function deposit({ mixer, currency, amount }) {
  let commitment, noteString;

  console.log("Creating new random deposit note");
  const deposit = createDeposit({
    nullifier: rbigint(31),
    secret: rbigint(31),
  });
  const note = toHex(deposit.preimage, 62);
  noteString = `tornado-${currency}-${amount}-${netId}-${note}`;
  console.log(`Your note: ${noteString}`);
//  await backupNote({ currency, amount, netId, note, noteString });
  commitment = toHex(deposit.commitment);

  console.log(commitment)
  return

  console.log("Submitting deposit transaction");
  const tx = await mixer.deposit(commitment);
  console.log(`Done, ${tx.hash}`);

  if (!commitmentNote) {
    return noteString;
  }
}

async function main() {
  const walletMnemonic = hre.ethers.Wallet.fromMnemonic(
    process.env.HACKER_MNEMONIC
  );
  const wallet = new hre.ethers.Wallet(
    walletMnemonic.privateKey,
    hre.ethers.getDefaultProvider()
  );

  const token_abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function mint(address to, uint256 amount) public",
  ];
  const token_address = "0x6323033246B03e08eEC5109F18D17C02e5B84210";
  const token = new hre.ethers.Contract(token_address, token_abi, wallet);

  const mixer_abi = ["function deposit(bytes32 _commitment) external payable"];
  const mixer_address = "0x4Ca6537DE10B87A620188a71F1309311c66e1dCe";
  const mixer = new hre.ethers.Contract(mixer_address, mixer_abi, wallet);

  await deposit({ mixer, currency: "test", amount: 1 });
  return;
  await token.mint(wallet.address, "1");
  await token.approve(mixer.address, "1");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(-1);
  });
