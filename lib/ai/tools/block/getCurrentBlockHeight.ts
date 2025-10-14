import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getCurrentBlockHeight = tool({
  description: `Get the current block height of the Stacks blockchain.
  Returns the latest confirmed block number.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v2/blocks`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get block height: ${response.statusText}`);
      }

      const data = await response.json();
      const latestBlock = data.results[0];

      return {
        success: true,
        data: {
          height: latestBlock.height,
          hash: latestBlock.hash,
          burn_block_height: latestBlock.burn_block_height,
          timestamp: latestBlock.burn_block_time_iso,
        },
        message: `Current block height: ${latestBlock.height}`,
      };
    } catch (error: any) {
      console.error("Error getting block height:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get current block height",
      };
    }
  },
});
