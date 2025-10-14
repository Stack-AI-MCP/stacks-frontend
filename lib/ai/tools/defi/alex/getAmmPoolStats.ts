import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetAmmPoolStats = tool({
  description: `Get AMM (Automated Market Maker) pool statistics from ALEX.
  Returns comprehensive stats for all AMM pools including TVL, volume, and fees.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/public/amm-pool-stats`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get AMM pool stats: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved AMM pool statistics`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX AMM pool stats:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX AMM pool stats",
      };
    }
  },
});
