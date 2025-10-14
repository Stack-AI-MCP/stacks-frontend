import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetAllTokenPrices = tool({
  description: `Get current prices for all tokens on ALEX DEX.
  Returns real-time pricing data for all traded tokens.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v2/public/token-prices`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get token prices: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved prices for ${Object.keys(data || {}).length} tokens`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX token prices:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX token prices",
      };
    }
  },
});
