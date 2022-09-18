/**
 * Generate merkle tree for a deposit.
 * Download deposit events from the tornado, reconstructs merkle tree, finds our deposit leaf
 * in it and generates merkle proof
 * @param deposit Deposit object
 */
 async function generateMerkleProof(deposit, currency, amount) {
  let leafIndex = -1;
  // Get all deposit events from smart contract and assemble merkle tree from them

  const cachedEvents = await fetchEvents({ type: 'deposit', currency, amount });

  const leaves = cachedEvents
    .sort((a, b) => a.leafIndex - b.leafIndex) // Sort events in chronological order
    .map((e) => {
      const index = toBN(e.leafIndex).toNumber();

      if (toBN(e.commitment).eq(toBN(deposit.commitmentHex))) {
        leafIndex = index;
      }
      return toBN(e.commitment).toString(10);
    });
  const tree = new merkleTree(MERKLE_TREE_HEIGHT, leaves);

  // Validate that our data is correct
  const root = tree.root();
  let isValidRoot, isSpent;
  if (!isTestRPC && !multiCall) {
    const callContract = await useMultiCall([[tornadoContract._address, tornadoContract.methods.isKnownRoot(toHex(root)).encodeABI()], [tornadoContract._address, tornadoContract.methods.isSpent(toHex(deposit.nullifierHash)).encodeABI()]])
    isValidRoot = web3.eth.abi.decodeParameter('bool', callContract[0]);
    isSpent = web3.eth.abi.decodeParameter('bool', callContract[1]);
  } else {
    isValidRoot = await tornadoContract.methods.isKnownRoot(toHex(root)).call();
    isSpent = await tornadoContract.methods.isSpent(toHex(deposit.nullifierHash)).call();
  }
  assert(isValidRoot === true, 'Merkle tree is corrupted');
  assert(isSpent === false, 'The note is already spent');
  assert(leafIndex >= 0, 'The deposit is not found in the tree');

  // Compute merkle proof of our commitment
  const { pathElements, pathIndices } = tree.path(leafIndex);
  return { root, pathElements, pathIndices };
}

/**
 * Generate SNARK proof for withdrawal
 * @param deposit Deposit object
 * @param recipient Funds recipient
 * @param relayer Relayer address
 * @param fee Relayer fee
 * @param refund Receive ether for exchanged tokens
 */
async function generateProof({ deposit, currency, amount, recipient, relayerAddress = 0, fee = 0, refund = 0 }) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = await generateMerkleProof(deposit, currency, amount);

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(relayerAddress),
    fee: bigInt(fee),
    refund: bigInt(refund),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: pathElements,
    pathIndices: pathIndices
  }

  console.log('Generating SNARK proof');
  console.time('Proof time');
  const proofData = await websnarkUtils.genWitnessAndProve(groth16, input, circuit, proving_key);
  const { proof } = websnarkUtils.toSolidityInput(proofData);
  console.timeEnd('Proof time');

  const args = [
    toHex(input.root),
    toHex(input.nullifierHash),
    toHex(input.recipient, 20),
    toHex(input.relayer, 20),
    toHex(input.fee),
    toHex(input.refund)
  ];

  return { proof, args };
}

/**
 * Do an ETH withdrawal
 * @param noteString Note to withdraw
 * @param recipient Recipient address
 */
async function withdraw({ deposit, currency, amount, recipient, relayerURL }) {
  // using private key

  const { proof, args } = await generateProof({
    deposit,
    currency,
    amount,
    recipient,
    refund,
  });
  console.log({ proof, args });

  console.log("Submitting withdraw transaction");
  await generateTransaction(
    contractAddress,
    tornado.methods.withdraw(tornadoInstance, proof, ...args).encodeABI()
  );
  console.log("Done withdrawal from Tornado Cash");
}

async function fetchEvents({ type, currency, amount }) {
  if (type === "withdraw") {
    type = "withdrawal";
  }

  const startBlock = cachedEvents.lastBlock + 1;

  console.log("Fetching",amount,currency.toUpperCase(),type,"events for",netName,"network");

  async function syncEvents() {
    try {
      let targetBlock = await web3.eth.getBlockNumber();
      let chunks = 1000;
      console.log("Querying latest events from RPC");

      for (let i = startBlock; i < targetBlock; i += chunks) {
        let fetchedEvents = [];

        function mapDepositEvents() {
          fetchedEvents = fetchedEvents.map(({ blockNumber, transactionHash, returnValues }) => {
            const { commitment, leafIndex, timestamp } = returnValues;
            return {
              blockNumber,
              transactionHash,
              commitment,
              leafIndex: Number(leafIndex),
              timestamp
            }
          });
        }

        function mapWithdrawEvents() {
          fetchedEvents = fetchedEvents.map(({ blockNumber, transactionHash, returnValues }) => {
            const { nullifierHash, to, fee } = returnValues;
            return {
              blockNumber,
              transactionHash,
              nullifierHash,
              to,
              fee
            }
          });
        }

        function mapLatestEvents() {
          if (type === "deposit"){
            mapDepositEvents();
          } else {
            mapWithdrawEvents();
          }
        }

        async function fetchWeb3Events(i) {
          let j;
          if (i + chunks - 1 > targetBlock) {
            j = targetBlock;
          } else {
            j = i + chunks - 1;
          }
          await tornadoContract.getPastEvents(capitalizeFirstLetter(type), {
            fromBlock: i,
            toBlock: j,
          }).then(r => { fetchedEvents = fetchedEvents.concat(r); console.log("Fetched", amount, currency.toUpperCase(), type, "events to block:", j) }, err => { console.error(i + " failed fetching", type, "events from node", err); process.exit(1); }).catch(console.log);

          if (type === "deposit"){
            mapDepositEvents();
          } else {
            mapWithdrawEvents();
          }
        }

        await fetchWeb3Events(i);
        await updateCache();
      }
    } catch (error) {
      throw new Error("Error while updating cache");
      process.exit(1);
    }
  }
}