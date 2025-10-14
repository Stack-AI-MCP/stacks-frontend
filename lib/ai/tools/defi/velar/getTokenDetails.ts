import { tool } from "ai";
import z from "zod";

const VELAR_API_URL = "https://api.velar.co";

export const velarGetTokenDetails = tool({
  description: `Get detailed information about a specific token on Velar, or all tokens if no symbol provided.
  Returns token metadata, contract address, and trading information.`,

  inputSchema: z.object({
    symbol: z.string().optional().describe("Token symbol (e.g., 'VELAR', 'STX'). Leave empty to get all tokens."),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ symbol, network }) => {
    try {
      const url = symbol
        ? `${VELAR_API_URL}/tokens?symbol=${symbol}`
        : `${VELAR_API_URL}/tokens`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get token details: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: symbol
          ? `Retrieved details for token ${symbol}`
          : `Retrieved details for all tokens`,
      };
    } catch (error: any) {
      console.error("Error getting Velar token details:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get token details${symbol ? ` for ${symbol}` : ''}`,
      };
    }
  },
});
