import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetHistoricalPrices = tool({
  description: `Get historical price data for a token on Velar.
  Returns price history over different time intervals (hour, week, month, year).`,

  inputSchema: z.object({
    contractAddress: z.string().describe("Full token contract identifier"),
    interval: z.enum(["hour", "week", "month", "year"]).optional().default("week").describe("Time interval for historical data"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ contractAddress, interval, network }) => {
    try {
      const response = await fetch(
        `${VELAR_API_URL}/prices/historical/${contractAddress}?interval=${interval}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Failed to get historical prices: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${interval}ly price history for ${contractAddress}`,
      };
    } catch (error: any) {
      console.error("Error getting Velar historical prices:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get historical prices for ${contractAddress}`,
      };
    }
  },
});
