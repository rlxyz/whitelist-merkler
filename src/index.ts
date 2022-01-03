import fs from "fs"; // Filesystem
import path from "path"; // Path routing
import Merkler from "./pkg/merkle"; // Generator
import { logger } from "./pkg/logger"; // Logging

/**
 * Throws error and exists process
 * @param {string} erorr to log
 */
function throwErrorAndExit(error: string): void {
    logger.error(error);
    process.exit(1);
}

const createWhitelistMerkleRoot = async (whitelistPath: string, outputPath: string) => {
    // Check if config exists
    if (!fs.existsSync(whitelistPath)) {
        throwErrorAndExit("Missing whitelist.json. Please add.");
    }

    // Read config
    const configFile: Buffer = await fs.readFileSync(whitelistPath);
    const configData = JSON.parse(configFile.toString());

    // Check if config contains airdrop key
    if (configData["whitelist"] === undefined) {
        throwErrorAndExit("Missing whitelist param in config. Please add.");
    }

    // Collect config
    const whitelist: Record<string, number> = configData.whitelist;

    // Initialize and call generator
    const merkler = new Merkler(whitelist, outputPath);
    await merkler.process();
};

export default createWhitelistMerkleRoot;