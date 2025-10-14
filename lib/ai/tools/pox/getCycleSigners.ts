import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getCycleSigners = tool({
  description: `Get signers for a specific PoX cycle including their stacking amounts and keys.`,

  inputSchema: z.object({
    cycle_number: z.number().describe("PoX cycle number"),
    limit: z.number().optional().default(20).describe("Number of signers to return"),
    offset: z.number().optional().default(0).describe("Signer offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ cycle_number, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(
        `${apiUrl}/extended/v2/pox/cycles/${cycle_number}/signers?${params}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Failed to get cycle signers: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.results?.length || 0} signers for cycle #${cycle_number}`,
      };
    } catch (error: any) {
      console.error("Error getting cycle signers:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get signers for cycle #${cycle_number}`,
      };
    }
  },
});
