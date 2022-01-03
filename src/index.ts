import fs from "fs"; // Filesystem
import path from "path"; // Path routing
import Merkler, { Merklized } from "./pkg/merkle"; // Generator
import { logger } from "./pkg/logger"; // Logging

/**
 * Throws error and exists process
 * @param {string} erorr to log
 */
function throwErrorAndExit(error: string): void {
    logger.error(error);
    process.exit(1);
}

export const createJsonWhitelistMerkleRoot = async (whitelistPath: string, outputPath: string): Promise<Merklized> => {
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
    const merkler = new Merkler(whitelist, outputPath, true);
    return await merkler.process(true);
};

export const createRawWhitelistMerkleRoot = async (configData: any): Promise<Merklized> => {
    // Collect config
    const whitelist: Record<string, number> = configData.whitelist;

    // Initialize and call generator
    const merkler = new Merkler(whitelist, "");
    return await merkler.process(false);
};