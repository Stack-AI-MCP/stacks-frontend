import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getBlockByHeight = tool({
  description: `Get detailed information about a block by its height.
  Returns block data including transactions, hash, and timestamp.`,

  inputSchema: z.object({
    height: z.number().describe("Block height (block number)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ height, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v2/blocks/${height}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get block: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved block ${height}`,
      };
    } catch (error: any) {
      console.error("Error getting block:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get block ${height}`,
      };
    }
  },
});
