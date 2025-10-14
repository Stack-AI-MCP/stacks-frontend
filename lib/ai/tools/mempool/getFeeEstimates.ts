import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getFeeEstimates = tool({
  description: `Get current fee estimates for Stacks transactions.
  Returns low, medium, and high priority fee rates in micro-STX.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/v2/fees/transaction`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get fee estimates: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          low: data.estimated_cost_scalar || data.estimated_cost,
          medium: Math.round((data.estimated_cost_scalar || data.estimated_cost) * 1.5),
          high: Math.round((data.estimated_cost_scalar || data.estimated_cost) * 2),
          estimatedCost: data.estimated_cost,
        },
        message: `Fee estimates retrieved for ${network}`,
      };
    } catch (error: any) {
      console.error("Error getting fee estimates:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get fee estimates",
      };
    }
  },
});
