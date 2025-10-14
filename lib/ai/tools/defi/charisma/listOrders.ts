import { tool } from "ai";
import z from "zod";

const CHARISMA_API_URL = "https://swap.charisma.rocks/api/v1";

export const charismaListOrders = tool({
  description: `List all limit orders on Charisma, optionally filtered by owner address.`,

  inputSchema: z.object({
    owner: z.string().optional().describe("Stacks address to filter orders by owner"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ owner, network }) => {
    try {
      const url = owner
        ? `${CHARISMA_API_URL}/orders?owner=${encodeURIComponent(owner)}`
        : `${CHARISMA_API_URL}/orders`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to list Charisma orders: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: owner
          ? `Found ${data.length || 0} orders for ${owner}`
          : `Found ${data.length || 0} total orders`,
      };
    } catch (error: any) {
      console.error("Error listing Charisma orders:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to list orders",
      };
    }
  },
});
