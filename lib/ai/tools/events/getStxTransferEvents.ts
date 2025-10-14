import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getStxTransferEvents = tool({
  description: `Get STX transfer, mint, and burn events filtered by sender or recipient.`,

  inputSchema: z.object({
    sender: z.string().optional().describe("Filter by sender address"),
    recipient: z.string().optional().describe("Filter by recipient address"),
    limit: z.number().optional().default(20).describe("Number of events to return"),
    offset: z.number().optional().default(0).describe("Event offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ sender, recipient, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (sender) params.append('sender', sender);
      if (recipient) params.append('recipient', recipient);

      const response = await fetch(`${apiUrl}/extended/v1/tx/events?type=stx_asset&${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get STX transfer events: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved ${data.events?.length || 0} STX transfer events`,
      };
    } catch (error: any) {
      console.error("Error getting STX transfer events:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get STX transfer events",
      };
    }
  },
});
