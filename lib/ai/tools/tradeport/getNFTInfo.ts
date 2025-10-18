import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetNFTInfo = tool({
  description: `Get detailed information about a specific NFT on TradePort.
  Includes attributes, listings, bids, ownership, and staking status.`,

  inputSchema: z.object({
    collection_id: z.string().describe("Collection ID (UUID format)"),
    token_id: z.string().describe("Token ID within the collection"),
  }),

  execute: async ({ collection_id, token_id }) => {
    try {
      const query = `
        query fetchNftInfo($collectionId: uuid!, $tokenId: String!) {
          stacks {
            nfts(
              where: {
                collection_id: { _eq: $collectionId }
                token_id: { _eq: $tokenId }
              }
            ) {
              name
              token_id
              media_type
              media_url
              ranking
              collection_id
              version
              owner
              burned
              chain_state
              properties
              staked
              staked_owner
              listings(where: { listed: { _eq: true } }, order_by: { price: asc }) {
                id
                listed
                price
                market_name
                seller
                block_time
              }
              bids(
                where: { status: { _eq: "active" } }
                order_by: { price: desc }
              ) {
                id
                price
                created_tx_id
                bidder
                receiver
                remaining_count
                status
                market_contract {
                  name
                }
              }
              attributes {
                type
                value
                rarity
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
          variables: { collectionId: collection_id, tokenId: token_id },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const nft = data.data?.stacks?.nfts?.[0];

      if (!nft) {
        return {
          success: false,
          error: `NFT not found for collection ${collection_id}, token ${token_id}`,
          nft: null,
        };
      }

      return {
        success: true,
        nft,
        collection_id,
        token_id,
      };
    } catch (error: any) {
      console.error("Error getting NFT info:", error);
      return {
        success: false,
        error: error.message,
        nft: null,
        collection_id,
        token_id,
      };
    }
  },
});
