import { tool } from "ai";
import z from "zod";
import { BitflowSDK } from '@bitflowlabs/core-sdk';

export const bitflowGetAvailableTokens = tool({
  description: `Get all available tokens on Bitflow DEX.
  Returns list of tokens that can be traded on Bitflow with their metadata.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const sdk = new BitflowSDK();
      const tokens = await sdk.getAvailableTokens();

      return {
        success: true,
        data: tokens,
        message: `Found ${tokens.length} tokens on Bitflow`,
      };
    } catch (error: any) {
      console.error("Error getting Bitflow tokens:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Bitflow available tokens",
      };
    }
  },
});
