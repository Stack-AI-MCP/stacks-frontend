import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const arkadikoGetProposal = tool({
  description: `Get detailed information about an Arkadiko governance proposal including votes and status.`,

  inputSchema: z.object({
    proposal_id: z.number().positive().describe("Proposal ID to query"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ proposal_id, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-governance-v4-3";

      const response = await fetch(
        `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-proposal-by-id`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: contractAddress,
            arguments: [
              `0x0${proposal_id.toString(16).padStart(16, '0')}`
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get proposal: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved proposal #${proposal_id}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko proposal:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get proposal #${proposal_id}`,
      };
    }
  },
});
