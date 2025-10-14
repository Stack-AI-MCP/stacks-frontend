import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetPoolByTokenPair = tool({
  description: `Get liquidity pool information for a specific token pair on Velar.
  Provide two token identifiers to find their liquidity pool.`,

  inputSchema: z.object({
    token0: z.string().describe("First token identifier"),
    token1: z.string().describe("Second token identifier"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token0, token1, network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/pools/${token0}/${token1}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get pool: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved pool for ${token0}/${token1}`,
      };
    } catch (error: any) {
      console.error("Error getting Velar pool by token pair:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get pool for ${token0}/${token1}`,
      };
    }
  },
});
