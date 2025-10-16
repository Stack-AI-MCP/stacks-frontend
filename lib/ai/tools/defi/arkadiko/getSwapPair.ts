import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  contractPrincipalCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetSwapPair = tool({
  description: `Get detailed information about an Arkadiko DEX swap pair.`,

  inputSchema: z.object({
    token_x: z.string().describe("First token contract name"),
    token_y: z.string().describe("Second token contract name"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_x, token_y, network }) => {
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
      const contractName = 'arkadiko-swap-v2-1';
      const stacksNetwork = STACKS_MAINNET;

      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-pair-details',
        functionArgs: [
          contractPrincipalCV(contractAddress, token_x),
          contractPrincipalCV(contractAddress, token_y),
        ],
        senderAddress: contractAddress,
        network: stacksNetwork,
      });

      const pairData = cvToJSON(result).value || {};

      return {
        success: true,
        data: {
          tokenX: token_x,
          tokenY: token_y,
          lpToken: pairData['lp-token']?.value || '',
          name: pairData.name?.value || '',
          reserveX: pairData['balance-x']?.value || '0',
          reserveY: pairData['balance-y']?.value || '0',
          totalSupply: pairData['total-supply']?.value || '0',
        },
        message: `Retrieved swap pair info for ${token_x}/${token_y}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko swap pair:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get swap pair info for ${token_x}/${token_y}`,
      };
    }
  },
});
