import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetAllPools = tool({
  description: `Get all liquidity pools on Velar DEX.
  Returns pool information including token pairs, TVL, and volume.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/pools`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get Velar pools: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.length || 0} pools on Velar`,
      };
    } catch (error: any) {
      console.error("Error getting Velar pools:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Velar pools",
      };
    }
  },
});
