import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getNFTHistory = tool({
  description: `Get transfer history for a specific NFT.
  Returns all mint and transfer events for the NFT.`,

  inputSchema: z.object({
    contractId: z.string().describe("NFT contract identifier (address.contract-name)"),
    tokenId: z.string().describe("Token ID within the contract"),
    limit: z.number().optional().default(50).describe("Number of events to return"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ contractId, tokenId, limit, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const [contractAddress, contractName] = contractId.split('.');

      const params = new URLSearchParams({
        limit: limit?.toString() ?? '50',
      });

      const response = await fetch(
        `${apiUrl}/extended/v1/tokens/nft/history?asset_identifier=${contractId}::${tokenId}&${params}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Failed to get NFT history: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved history for NFT ${contractName} #${tokenId}`,
      };
    } catch (error: any) {
      console.error("Error getting NFT history:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get NFT history for ${contractId} #${tokenId}`,
      };
    }
  },
});
