import { tool } from "ai";
import z from "zod";

export const arkadikoGetVaultInfo = tool({
  description: `Get detailed information about an Arkadiko vault including collateral, debt, and health metrics.`,

  inputSchema: z.object({
    vault_id: z.number().positive().describe("Vault ID to query"),
    owner: z.string().describe("Vault owner Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ vault_id, owner, network }) => {
    try {
      // Use the MCP server backend service instead of direct API calls
      const response = await fetch('/api/mcp/arkadiko_get_vault_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vault_id,
          owner,
          network
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend API Error:", errorText);
        throw new Error(`Failed to get vault info: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved vault #${vault_id} info for ${owner}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko vault info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get vault #${vault_id} info`,
      };
    }
  },
});
