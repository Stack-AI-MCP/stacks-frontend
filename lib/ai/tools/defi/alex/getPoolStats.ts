import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetPoolStats = tool({
  description: `Get detailed statistics for a specific ALEX liquidity pool.
  Provide the pool token ID to get volume, liquidity, fees, and APY data.`,

  inputSchema: z.object({
    poolTokenId: z.number().describe("Pool token ID (numeric identifier)"),
    limit: z.number().optional().default(10).describe("Number of records to return"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ poolTokenId, limit, network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/pool_stats/${poolTokenId}?limit=${limit}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get pool stats: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved stats for pool ${poolTokenId}`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX pool stats:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get stats for pool ${poolTokenId}`,
      };
    }
  },
});
