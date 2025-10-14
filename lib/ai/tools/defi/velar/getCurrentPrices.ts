import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetCurrentPrices = tool({
  description: `Get current prices for all tokens on Velar DEX.
  Returns real-time pricing data for all supported tokens.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/prices`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get Velar prices: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved current prices for ${Object.keys(data || {}).length} tokens`,
      };
    } catch (error: any) {
      console.error("Error getting Velar prices:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Velar prices",
      };
    }
  },
});
