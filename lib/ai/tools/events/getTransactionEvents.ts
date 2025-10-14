import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getTransactionEvents = tool({
  description: `Get events for a specific transaction with detailed filtering by type and address.`,

  inputSchema: z.object({
    tx_id: z.string().describe("Transaction ID"),
    address: z.string().optional().describe("Filter events by address involvement"),
    type: z.enum(['stx_asset', 'fungible_token_asset', 'non_fungible_token_asset', 'smart_contract_log', 'stx_lock']).optional().describe("Filter by event type"),
    offset: z.number().optional().default(0).describe("Event offset for pagination"),
    limit: z.number().optional().default(20).describe("Number of events to return"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ tx_id, address, type, offset, limit, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        tx_id,
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (address) params.append('address', address);
      if (type) params.append('type', type);

      const response = await fetch(`${apiUrl}/extended/v1/tx/events?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction events: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.events?.length || 0} events for transaction ${tx_id}`,
      };
    } catch (error: any) {
      console.error("Error getting transaction events:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get events for transaction ${tx_id}`,
      };
    }
  },
});
