import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  contractPrincipalCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetAllSwapPairs = tool({
  description: `Get all available swap pairs on Arkadiko DEX with liquidity and trading information.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ network }) => {
    try {
      const contractAddress = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
      const contractName = 'arkadiko-swap-v2-1';
      const stacksNetwork = network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

      // Common Arkadiko trading pairs
      const knownPairs = [
        { tokenX: 'wrapped-stx-token', tokenY: 'usda-token', name: 'wSTX-USDA' },
        { tokenX: 'arkadiko-token', tokenY: 'usda-token', name: 'DIKO-USDA' },
        { tokenX: 'wrapped-stx-token', tokenY: 'arkadiko-token', name: 'wSTX-DIKO' },
        { tokenX: 'xbtc', tokenY: 'usda-token', name: 'xBTC-USDA' },
        { tokenX: 'wrapped-stx-token', tokenY: 'xbtc', name: 'wSTX-xBTC' },
      ];

      const pairs = [];

      for (const pair of knownPairs) {
        try {
          const result = await fetchCallReadOnlyFunction({
            contractAddress,
            contractName,
            functionName: 'get-pair-details',
            functionArgs: [
              contractPrincipalCV(contractAddress, pair.tokenX),
              contractPrincipalCV(contractAddress, pair.tokenY),
            ],
            senderAddress: contractAddress,
            network: stacksNetwork,
          });

          const pairData = cvToJSON(result).value;

          if (pairData) {
            pairs.push({
              name: pair.name,
              tokenX: pair.tokenX,
              tokenY: pair.tokenY,
              lpToken: pairData['lp-token']?.value || '',
              reserveX: pairData['balance-x']?.value || '0',
              reserveY: pairData['balance-y']?.value || '0',
              totalSupply: pairData['total-supply']?.value || '0',
            });
          }
        } catch (error) {
          // Skip pairs that don't exist
          console.log(`Pair ${pair.name} not found, skipping`);
        }
      }

      return {
        success: true,
        data: {
          pairs,
          totalPairs: pairs.length,
        },
        message: `Retrieved ${pairs.length} Arkadiko swap pairs`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko swap pairs:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Arkadiko swap pairs",
      };
    }
  },
});
