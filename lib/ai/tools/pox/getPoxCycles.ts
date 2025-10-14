import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getPoxCycles = tool({
  description: `Get list of PoX (Proof of Transfer) cycles with stacking information.`,

  inputSchema: z.object({
    limit: z.number().optional().default(20).describe("Number of cycles to return"),
    offset: z.number().optional().default(0).describe("Cycle offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${apiUrl}/extended/v2/pox/cycles?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get PoX cycles: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.results?.length || 0} PoX cycles`,
      };
    } catch (error: any) {
      console.error("Error getting PoX cycles:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get PoX cycles",
      };
    }
  },
});
