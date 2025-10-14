import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const arkadikoGetVaultInfo = tool({
  description: `Get detailed information about an Arkadiko vault including collateral, debt, and health metrics.`,

  inputSchema: z.object({
    vault_id: z.number().positive().describe("Vault ID to query"),
    owner: z.string().describe("Vault owner Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ vault_id, owner, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      // Query vault contract for vault data
      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-freddie-v1-1";

      const response = await fetch(
        `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-vault`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: owner,
            arguments: [
              `0x${Buffer.from(owner).toString('hex')}`,
              `0x0${vault_id.toString(16).padStart(16, '0')}`
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get vault info: ${response.statusText}`);
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
