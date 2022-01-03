import fs from "fs"; // Filesystem
import keccak256 from "keccak256"; // Keccak256 hashing
import MerkleTree from "merkletreejs"; // MerkleTree.js
import { logger } from "./logger"; // Logging
import { getAddress, parseUnits, solidityKeccak256 } from "ethers/lib/utils"; // Ethers utils

// whitelist recipient addresses and scaled token values
type WhitelistRecipient = {
  // Recipient address
  address: string;
  // Scaled-to-decimals token value
  value: string;
};

export type Merklized = {
  root: string;
  tree: MerkleTree
}

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of whitelist claimee
 * @param {string} value of whitelist tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */
const generateLeaf = (address: string, value: string): Buffer => {
  return Buffer.from(
    // Hash in appropriate Merkle format
    solidityKeccak256(["address", "uint256"], [address, value]).slice(2),
    "hex"
  );
}

export default class Merkler {
  // whitelist recipients
  recipients: WhitelistRecipient[] = [];
  outputPath: string;
  shouldLog: any;

  /**
   * Setup generator
   * @param {number} decimals of token
   * @param {Record<string, number>} whitelist address to token claim mapping
   */
  constructor(whitelist: Record<string, number>, outputPath: string, shouldLog: boolean = false) {
    // For each whitelist entry
    for (const [address, tokens] of Object.entries(whitelist)) {
      // Push:
      this.recipients.push({
        address: getAddress(address),
        value: tokens.toString()
      });
    }
    this.outputPath = outputPath;
    this.shouldLog = shouldLog
  }

  log(message: string): void {
    if (this.shouldLog)
      logger.info(message);
  }

  async process(save: boolean): Promise<Merklized> {
    this.log("Generating Merkle tree.");

    // Generate merkle tree
    const merkleTree = new MerkleTree(
      // Generate leafs
      this.recipients.map(({ address, value }) =>
        generateLeaf(address, value)
      ),
      // Hashing function
      keccak256,
      { sortPairs: true }
    );

    // Collect and log merkle root
    const merkleRoot: string = merkleTree.getHexRoot();
    this.log(`Generated Merkle root: ${merkleRoot}`);

    if (save) {
      // Collect and save merkle tree + root
      await fs.writeFileSync(
        // Output to merkle.json
        this.outputPath,
        // Root + full tree
        JSON.stringify({
          root: merkleRoot,
          tree: merkleTree
        })
      );
      this.log("Generated merkle tree and root saved to Merkle.json.");
    }

    return {
      root: merkleRoot,
      tree: merkleTree
    }
  }
}