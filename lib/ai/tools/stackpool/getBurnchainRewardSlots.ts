import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getBurnchainRewardSlots = tool({
  description: `Get burnchain reward slot holders (Bitcoin addresses receiving stacking rewards).`,

  inputSchema: z.object({
    limit: z.number().optional().default(20).describe("Number of slots to return"),
    offset: z.number().optional().default(0).describe("Slot offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
      });

      const response = await fetch(`${apiUrl}/extended/v1/burnchain/reward_slot_holders?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get burnchain reward slots: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.results?.length || 0} burnchain reward slots`,
      };
    } catch (error: any) {
      console.error("Error getting burnchain reward slots:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get burnchain reward slots",
      };
    }
  },
});
