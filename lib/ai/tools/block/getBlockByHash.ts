import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getBlockByHash = tool({
  description: `Get detailed information about a block by its hash.
  Returns block data including transactions, height, and timestamp.`,

  inputSchema: z.object({
    hash: z.string().describe("Block hash (0x-prefixed hex string)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ hash, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v2/blocks/${hash}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get block: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved block ${hash.substring(0, 10)}...`,
      };
    } catch (error: any) {
      console.error("Error getting block by hash:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get block ${hash}`,
      };
    }
  },
});
