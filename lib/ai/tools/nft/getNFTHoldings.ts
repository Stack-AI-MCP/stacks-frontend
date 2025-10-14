import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getNFTHoldings = tool({
  description: `Get all NFT holdings for a Stacks address.
  Returns list of NFTs owned by the address with metadata.`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address (ST* for testnet, SP* for mainnet)"),
    limit: z.number().optional().default(50).describe("Number of NFTs to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ address, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const params = new URLSearchParams({
        limit: limit?.toString() ?? '50',
        offset: offset?.toString() ?? '0',
      });

      const response = await fetch(
        `${apiUrl}/extended/v1/tokens/nft/holdings?principal=${address}&${params}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Failed to get NFT holdings: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.total || 0} NFTs for ${address}`,
      };
    } catch (error: any) {
      console.error("Error getting NFT holdings:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get NFT holdings for ${address}`,
      };
    }
  },
});
