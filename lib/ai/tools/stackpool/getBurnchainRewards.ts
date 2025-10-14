import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getBurnchainRewards = tool({
  description: `Get burnchain rewards paid to Bitcoin addresses for stacking.`,

  inputSchema: z.object({
    address: z.string().optional().describe("Filter by specific Bitcoin address"),
    limit: z.number().optional().default(20).describe("Number of rewards to return"),
    offset: z.number().optional().default(0).describe("Reward offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ address, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const url = address
        ? `${apiUrl}/extended/v1/burnchain/rewards/${address}?${params}`
        : `${apiUrl}/extended/v1/burnchain/rewards?${params}`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get burnchain rewards: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: address
          ? `Retrieved ${data.results?.length || 0} rewards for ${address}`
          : `Retrieved ${data.results?.length || 0} burnchain rewards`,
      };
    } catch (error: any) {
      console.error("Error getting burnchain rewards:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get burnchain rewards",
      };
    }
  },
});
