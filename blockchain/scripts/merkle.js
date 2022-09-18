const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');
const fs = require("fs");

let data = fs.readFileSync('./attendees.json',
    { encoding: 'utf8', flag: 'r' });

data = JSON.parse(data)

const leafNodes = data.map(hacker => ethers.utils.solidityKeccak256(["address"], [hacker.address]));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getHexRoot();

console.log(rootHash)

const obj = {}

for(let i = 0; i < 1000; i++) {
    obj[data[i].address] = merkleTree.getHexProof(ethers.utils.solidityKeccak256(["address"], [data[i].address]));
}

fs.writeFileSync("proofs.json", JSON.stringify(obj))