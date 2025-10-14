import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetTradingPairs = tool({
  description: `Get all available trading pairs on ALEX DEX.
  Returns list of token pairs that can be swapped.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/pairs`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get trading pairs: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.length || 0} trading pairs on ALEX`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX trading pairs:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX trading pairs",
      };
    }
  },
});
