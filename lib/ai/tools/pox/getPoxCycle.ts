import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getPoxCycle = tool({
  description: `Get detailed information about a specific PoX cycle including signers and rewards.`,

  inputSchema: z.object({
    cycle_number: z.number().describe("PoX cycle number to query"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ cycle_number, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v2/pox/cycles/${cycle_number}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get PoX cycle: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved PoX cycle #${cycle_number}`,
      };
    } catch (error: any) {
      console.error("Error getting PoX cycle:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get PoX cycle #${cycle_number}`,
      };
    }
  },
});
