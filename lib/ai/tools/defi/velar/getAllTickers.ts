import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetAllTickers = tool({
  description: `Get market data for all tokens on Velar DEX.
  Returns price, volume, and market statistics for all trading pairs.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/tickers`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get Velar tickers: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ticker data for ${data.length || 0} pairs`,
      };
    } catch (error: any) {
      console.error("Error getting Velar tickers:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Velar tickers",
      };
    }
  },
});
