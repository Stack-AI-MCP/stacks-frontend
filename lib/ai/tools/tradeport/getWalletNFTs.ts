import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetWalletNFTs = tool({
  description: `Get all NFT holdings for a wallet address from TradePort marketplace.
  Shows NFTs owned, collection details, listings, and staking status.`,

  inputSchema: z.object({
    wallet_address: z.string().describe("Stacks wallet address (SP...)"),
    limit: z.number().optional().default(50).describe("Number of NFTs to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ wallet_address, limit, offset }) => {
    try {
      const query = `
        query fetchWalletNFTs($wallet_address: String!, $offset: Int, $limit: Int) {
          stacks {
            nfts(
              where: { owner: { _eq: $wallet_address }, burned: { _eq: false } }
              offset: $offset
              limit: $limit
            ) {
              id
              token_id
              name
              media_url
              media_type
              ranking
              owner
              burned
              staked
              collection {
                id
                title
                slug
                floor
              }
              listings {
                id
                price
              }
            }
          }
        }
      `;

      const response = await fetch(TRADEPORT_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TRADEPORT_API_KEY,
          "x-api-user": TRADEPORT_API_USER,
        },
        body: JSON.stringify({
          query,
          variables: { wallet_address, offset, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const nfts = data.data?.stacks?.nfts || [];

      return {
        success: true,
        wallet_address,
        nfts,
        total: nfts.length,
      };
    } catch (error: any) {
      console.error("Error getting wallet NFTs:", error);
      return {
        success: false,
        error: error.message,
        wallet_address,
        nfts: [],
        total: 0,
      };
    }
  },
});
