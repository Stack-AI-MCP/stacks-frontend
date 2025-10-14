import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetPriceByContract = tool({
  description: `Get current price for a token by its contract address on Velar.
  Provide the full contract identifier (e.g., 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token').`,

  inputSchema: z.object({
    contractAddress: z.string().describe("Full token contract identifier (address.contract-name)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ contractAddress, network }) => {
    try {
      const response = await fetch(`${VELAR_API_URL}/prices/${contractAddress}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get price: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved price for ${contractAddress}`,
      };
    } catch (error: any) {
      console.error("Error getting Velar price by contract:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get price for ${contractAddress}`,
      };
    }
  },
});
