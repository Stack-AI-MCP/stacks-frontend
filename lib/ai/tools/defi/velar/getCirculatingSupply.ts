import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetCirculatingSupply = tool({
  description: `Get the circulating supply of VELAR governance token.
  Returns the current circulating supply in VELAR tokens.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/circulating-supply`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get circulating supply: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `VELAR circulating supply: ${data.circulatingSupply || 'N/A'}`,
      };
    } catch (error: any) {
      console.error("Error getting Velar circulating supply:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Velar circulating supply",
      };
    }
  },
});
