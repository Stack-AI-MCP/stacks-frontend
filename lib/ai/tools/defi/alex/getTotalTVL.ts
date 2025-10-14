import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetTotalTVL = tool({
  description: `Get total value locked (TVL) across all ALEX DEX pools.
  Returns the total USD value of all assets locked in ALEX liquidity pools.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/stats/tvl`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get TVL: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Total TVL on ALEX: $${data.tvl ? parseFloat(data.tvl).toLocaleString() : 'N/A'}`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX TVL:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX TVL",
      };
    }
  },
});
