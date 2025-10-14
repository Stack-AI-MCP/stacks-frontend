import { tool } from "ai";
import z from "zod";

const CHARISMA_API_URL = "https://swap.charisma.rocks/api/v1";

export const charismaGetOrder = tool({
  description: `Get detailed information about a specific Charisma order by UUID.`,

  inputSchema: z.object({
    uuid: z.string().describe("Order UUID to query"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ uuid, network }) => {
    try {
      const response = await fetch(`${CHARISMA_API_URL}/orders/${uuid}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get Charisma order: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved order ${uuid}`,
      };
    } catch (error: any) {
      console.error("Error getting Charisma order:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get order ${uuid}`,
      };
    }
  },
});
