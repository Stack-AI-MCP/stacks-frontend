import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  uintCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetTokenPrice = tool({
  description: `Get token price from Arkadiko oracle for collateral and liquidation calculations.`,

  inputSchema: z.object({
    token_id: z.number().positive().describe("Token ID in oracle system"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_id, network }) => {
    try {
      const contractAddress = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
      const contractName = 'arkadiko-oracle-v2-3';
      const stacksNetwork = network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-price',
        functionArgs: [uintCV(token_id)],
        senderAddress: contractAddress,
        network: stacksNetwork,
      });

      const priceData = cvToJSON(result).value || {};

      return {
        success: true,
        data: {
          tokenId: token_id,
          price: priceData.price?.value || '0',
          decimals: priceData.decimals?.value || '0',
        },
        message: `Retrieved price for token ID ${token_id}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko token price:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get price for token ID ${token_id}`,
      };
    }
  },
});
