import { tool } from "ai";
import z from "zod";

export const arkadikoGetStakeInfo = tool({
  description: `Get DIKO staking information for an address including staked amount and rewards.`,

  inputSchema: z.object({
    staker: z.string().describe("Staker Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ staker, network }) => {
    try {
      // Use the MCP server backend service instead of direct API calls
      const response = await fetch('/api/mcp/arkadiko_get_stake_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staker,
          network
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend API Error:", errorText);
        throw new Error(`Failed to get stake info: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved staking info for ${staker}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko stake info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get stake info for ${staker}`,
      };
    }
  },
});
