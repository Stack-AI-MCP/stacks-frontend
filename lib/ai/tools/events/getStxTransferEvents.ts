import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getStxTransferEvents = tool({
  description: `Get STX transfer, mint, and burn events for a specific address. Shows all STX movements (sent, received, minted, burned).`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address to get STX events for - REQUIRED"),
    limit: z.number().optional().default(20).describe("Number of transactions to return"),
    offset: z.number().optional().default(0).describe("Transaction offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ address, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
      });

      // Use the address transactions endpoint which includes STX transfer events
      const response = await fetch(`${apiUrl}/extended/v1/address/${address}/transactions?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get STX transfer events: ${response.statusText}`);
      }

      const data = await response.json();

      // Filter for STX transfer events
      const stxTransfers = data.results?.filter((tx: any) =>
        tx.tx_type === 'token_transfer' ||
        (tx.events && tx.events.some((e: any) => e.event_type === 'stx_asset'))
      ) || [];

      return {
        success: true,
        data: {
          ...data,
          results: stxTransfers,
        },
        address,
        message: `Retrieved ${stxTransfers.length} STX transfer events for ${address}`,
      };
    } catch (error: any) {
      console.error("Error getting STX transfer events:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get STX transfer events for ${address}`,
        address,
      };
    }
  },
});
