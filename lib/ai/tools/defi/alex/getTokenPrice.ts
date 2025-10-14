import { tool } from "ai";
import z from "zod";

const ALEX_API_URL = "https://api.alexgo.io";

export const alexGetTokenPrice = tool({
  description: `Get current price for a specific token on ALEX DEX.
  Provide the full token contract identifier (e.g., 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx').`,

  inputSchema: z.object({
    tokenAddress: z.string().describe("Full token contract identifier (address.contract-name)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ tokenAddress, network }) => {
    try {
      const response = await fetch(`${ALEX_API_URL}/v1/price/${encodeURIComponent(tokenAddress)}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get token price: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Price for ${tokenAddress}: ${data.price || 'N/A'}`,
      };
    } catch (error: any) {
      console.error("Error getting token price:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get price for ${tokenAddress}`,
      };
    }
  },
});
