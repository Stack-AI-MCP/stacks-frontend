import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetAllPools = tool({
  description: `Get all liquidity pools on ALEX DEX with detailed statistics.
  Returns pool information, token pairs, TVL, volume, and APY for all active pools.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v2/public/pools`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get ALEX pools: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.length || 0} ALEX liquidity pools`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX pools:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX pools",
      };
    }
  },
});
