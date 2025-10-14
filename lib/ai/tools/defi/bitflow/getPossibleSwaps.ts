import { tool } from "ai";
import z from "zod";
import { BitflowSDK } from '@bitflowlabs/core-sdk';

export const bitflowGetPossibleSwaps = tool({
  description: `Get all possible swap options for a given token on Bitflow.
  Returns tokens that can be swapped to from the given token.`,

  inputSchema: z.object({
    tokenId: z.string().describe("Token identifier (e.g., 'token-stx', 'token-usda')"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ tokenId, network }) => {
    try {
      const sdk = new BitflowSDK();
      const swapOptions = await sdk.getPossibleSwaps(tokenId);

      return {
        success: true,
        data: swapOptions,
        message: `Found swap options for ${tokenId}`,
      };
    } catch (error: any) {
      console.error("Error getting possible swaps:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get possible swaps for ${tokenId}`,
      };
    }
  },
});
