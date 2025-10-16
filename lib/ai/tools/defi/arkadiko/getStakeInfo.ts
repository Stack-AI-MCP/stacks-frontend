import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  standardPrincipalCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetStakeInfo = tool({
  description: `Get staking information for an address on Arkadiko protocol.`,

  inputSchema: z.object({
    staker: z.string().describe("Staker Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ staker, network }) => {
    try {
      const contractAddress = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
      const contractName = 'arkadiko-stake-pool-diko-v1-1';
      const stacksNetwork = network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-stake-of',
        functionArgs: [standardPrincipalCV(staker)],
        senderAddress: contractAddress,
        network: stacksNetwork,
      });

      const stakeData = cvToJSON(result).value || {};

      return {
        success: true,
        data: {
          staker,
          amount: stakeData.amount?.value || '0',
          reward: stakeData.reward?.value || '0',
          cooldownPeriod: parseInt(stakeData.cooldown?.value || '0'),
        },
        message: `Retrieved stake info for ${staker}`,
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
