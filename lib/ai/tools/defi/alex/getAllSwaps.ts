import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetAllSwaps = tool({
  description: `Get all available swap pairs on ALEX with volumes and prices.
  Returns comprehensive swap information including 24h volume and price data.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/allswaps`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get swaps: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.length || 0} swap pairs from ALEX`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX swaps:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX swaps",
      };
    }
  },
});
