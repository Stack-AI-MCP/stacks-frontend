import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getContractLogEvents = tool({
  description: `Get smart contract log events with filtering by contract and topic.`,

  inputSchema: z.object({
    contract_id: z.string().optional().describe("Filter by contract ID (address.contract-name)"),
    topic: z.string().optional().describe("Filter by log topic"),
    limit: z.number().optional().default(20).describe("Number of events to return"),
    offset: z.number().optional().default(0).describe("Event offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ contract_id, topic, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
      });

      if (contract_id) params.append('contract_id', contract_id);
      if (topic) params.append('topic', topic);

      const response = await fetch(`${apiUrl}/extended/v1/tx/events?type=smart_contract_log&${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get contract log events: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.events?.length || 0} contract log events`,
      };
    } catch (error: any) {
      console.error("Error getting contract log events:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get contract log events",
      };
    }
  },
});
