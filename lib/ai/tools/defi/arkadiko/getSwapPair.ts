import { tool } from "ai";
import z from "zod";

export const arkadikoGetSwapPair = tool({
  description: `Get detailed information about an Arkadiko DEX swap pair including reserves, fees, and liquidity.`,

  inputSchema: z.object({
    token_x: z.string().describe("First token contract name (e.g., 'wstx-token')"),
    token_y: z.string().describe("Second token contract name (e.g., 'usda-token')"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_x, token_y, network }) => {
    try {
      // Use the MCP server backend service instead of direct API calls
      const response = await fetch('/api/mcp/arkadiko_get_swap_pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_x,
          token_y,
          network
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend API Error:", errorText);
        throw new Error(`Failed to get swap pair: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved swap pair ${token_x}/${token_y}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko swap pair:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get swap pair ${token_x}/${token_y}`,
      };
    }
  },
});
