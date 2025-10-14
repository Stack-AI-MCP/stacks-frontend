import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getPoolDelegations = tool({
  description: `Get stacking pool delegations for a pool principal address.`,

  inputSchema: z.object({
    pool_principal: z.string().describe("Pool principal Stacks address"),
    limit: z.number().optional().default(20).describe("Number of delegations to return"),
    offset: z.number().optional().default(0).describe("Delegation offset for pagination"),
    after_block: z.number().optional().describe("Only include delegations after this block height"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ pool_principal, limit, offset, after_block, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
        unanchored: 'true',
      });

      if (after_block) params.append('after_block', after_block.toString());

      const response = await fetch(`${apiUrl}/extended/v1/pox/${pool_principal}/delegations?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get pool delegations: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.results?.length || 0} delegations for pool ${pool_principal}`,
      };
    } catch (error: any) {
      console.error("Error getting pool delegations:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get delegations for pool ${pool_principal}`,
      };
    }
  },
});
