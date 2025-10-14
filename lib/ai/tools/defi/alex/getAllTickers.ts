import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetAllTickers = tool({
  description: `Get market statistics for all trading pairs on ALEX (24h data).
  Returns ticker data including price, volume, and price changes.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/tickers`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get tickers: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ticker data for ${Object.keys(data || {}).length} pairs`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX tickers:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX tickers",
      };
    }
  },
});
