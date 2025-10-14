import { tool } from "ai";
import z from "zod";
import { BitflowSDK } from '@bitflowlabs/core-sdk';

export const bitflowGetKeeperTokens = tool({
  description: `Get available tokens for Bitflow Keeper operations.
  Keeper system allows automated DCA (Dollar Cost Averaging) and scheduled swaps.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const sdk = new BitflowSDK();
      const tokens = await sdk.getKeeperTokens();

      return {
        success: true,
        data: tokens,
        message: `Found ${tokens.length} tokens available for Keeper operations`,
      };
    } catch (error: any) {
      console.error("Error getting Keeper tokens:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Keeper tokens",
      };
    }
  },
});
