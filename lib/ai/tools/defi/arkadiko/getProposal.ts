import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  uintCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetProposal = tool({
  description: `Get detailed information about an Arkadiko governance proposal including voting results and status.`,

  inputSchema: z.object({
    proposal_id: z.number().positive().describe("Proposal ID to query"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ proposal_id, network }) => {
    try {
      // Arkadiko is only deployed on mainnet
      if (network === 'testnet') {
        return {
          success: false,
          error: 'Arkadiko is only available on mainnet',
          message: 'Arkadiko protocol is not deployed on public testnet. Please use mainnet or deploy to a local mocknet for testing.',
        };
      }

      const contractAddress = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
      const contractName = 'arkadiko-governance-v2-1';
      const stacksNetwork = STACKS_MAINNET;

      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-proposal',
        functionArgs: [uintCV(proposal_id)],
        senderAddress: contractAddress,
        network: stacksNetwork,
      });

      const proposalData = cvToJSON(result).value || {};

      // Calculate voting status
      const votesFor = parseInt(proposalData['votes-for']?.value || '0');
      const votesAgainst = parseInt(proposalData['votes-against']?.value || '0');
      const startBlock = parseInt(proposalData['start-block']?.value || '0');
      const endBlock = parseInt(proposalData['end-block']?.value || '0');
      const executed = proposalData.executed?.value || false;

      // Determine proposal status
      let status: "pending" | "active" | "passed" | "rejected" | "executed" = "pending";
      if (executed) {
        status = "executed";
      } else if (votesFor > votesAgainst) {
        status = "passed";
      } else if (votesAgainst > votesFor) {
        status = "rejected";
      } else if (startBlock > 0 && endBlock > 0) {
        status = "active";
      }

      return {
        success: true,
        data: {
          proposal_id,
          proposer: proposalData.proposer?.value || '',
          title: proposalData.title?.value || '',
          description: proposalData.description?.value || '',
          votes_for: votesFor,
          votes_against: votesAgainst,
          start_block: startBlock,
          end_block: endBlock,
          status,
          execution_delay: parseInt(proposalData['execution-delay']?.value || '0'),
          is_open: !executed && endBlock > 0,
        },
        message: `Retrieved proposal #${proposal_id} info`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko proposal:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get proposal #${proposal_id} info`,
      };
    }
  },
});
