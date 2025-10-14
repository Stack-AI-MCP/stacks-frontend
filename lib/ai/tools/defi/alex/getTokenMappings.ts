import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetTokenMappings = tool({
  description: `Get token contract address mappings for ALEX.
  Returns mapping of token symbols to their contract addresses.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v2/public/token-mappings`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get token mappings: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved token mappings for ${Object.keys(data || {}).length} tokens`,
      };
    } catch (error: any) {
      console.error("Error getting ALEX token mappings:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get ALEX token mappings",
      };
    }
  },
});
