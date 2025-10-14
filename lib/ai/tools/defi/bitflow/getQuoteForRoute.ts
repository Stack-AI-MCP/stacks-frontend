import { tool } from "ai";
import z from "zod";
import { BitflowSDK } from '@bitflowlabs/core-sdk';

export const bitflowGetQuoteForRoute = tool({
  description: `Get a swap quote for a specific route on Bitflow.
  Returns estimated output amount and price impact for the swap.`,

  inputSchema: z.object({
    tokenXId: z.string().describe("Input token identifier (e.g., 'token-stx')"),
    tokenYId: z.string().describe("Output token identifier (e.g., 'token-usda')"),
    amount: z.number().describe("Amount to swap in base units"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ tokenXId, tokenYId, amount, network }) => {
    try {
      const sdk = new BitflowSDK();
      const quote = await sdk.getQuoteForRoute(tokenXId, tokenYId, amount);

      return {
        success: true,
        data: quote,
        message: `Quote for swapping ${amount} ${tokenXId} to ${tokenYId}`,
      };
    } catch (error: any) {
      console.error("Error getting Bitflow quote:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get quote for ${tokenXId} to ${tokenYId}`,
      };
    }
  },
});
