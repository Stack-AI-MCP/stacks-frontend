import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getContractLogEvents = tool({
  description: `Get smart contract events for a specific contract. Shows print events, contract calls, and other contract activity.`,

  inputSchema: z.object({
    contract_id: z.string().describe("Contract ID (address.contract-name) - REQUIRED"),
    limit: z.number().optional().default(20).describe("Number of events to return"),
    offset: z.number().optional().default(0).describe("Event offset for pagination"),
    unanchored: z.boolean().optional().default(false).describe("Include unanchored (microblock) events"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ contract_id, limit, offset, unanchored, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
        unanchored: unanchored?.toString() ?? 'false',
      });

      // Use the dedicated contract events endpoint
      const response = await fetch(`${apiUrl}/extended/v1/contract/${contract_id}/events?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get contract events: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        contract_id,
        message: `Retrieved ${data.results?.length || 0} events for contract ${contract_id}`,
      };
    } catch (error: any) {
      console.error("Error getting contract log events:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get events for contract ${contract_id}`,
        contract_id,
      };
    }
  },
});
