import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetNFTHistory = tool({
  description: `Get transaction history for a specific NFT on TradePort.
  Shows all sales, transfers, listings, and other activities for the NFT.`,

  inputSchema: z.object({
    collection_id: z.string().describe("Collection ID (UUID format)"),
    token_id: z.string().describe("Token ID within the collection"),
    action_types: z.array(z.enum([
      "list", "relist", "unlist", "buy", "solo-bid", "accept-bid",
      "unlist-bid", "collection-bid", "accept-collection-bid",
      "cancel-collection-bid", "transfer", "transfer-hold",
      "mint", "burn", "stake", "unstake", "trade-hold"
    ])).optional().describe("Filter by specific action types"),
    limit: z.number().optional().default(15).describe("Number of history entries to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ collection_id, token_id, action_types, limit, offset }) => {
    try {
      const query = `
        query fetchNftTransactionHistory(
          $collectionId: uuid!
          $tokenId: String!
          $actionTypes: [action_type!]
          $offset: Int
          $limit: Int!
        ) {
          stacks {
            actions(
              where: {
                collection_id: { _eq: $collectionId }
                nft: { token_id: { _eq: $tokenId } }
                type: { _in: $actionTypes }
              }
              order_by: [{ block_time: desc }, { tx_index: desc }]
              offset: $offset
              limit: $limit
            ) {
              id
              type
              price
              sender
              receiver
              tx_id
              block_time
              market_name
            }
          }
        }
      `;

      const defaultActionTypes = [
        "list", "relist", "unlist", "buy", "solo-bid", "accept-bid",
        "unlist-bid", "collection-bid", "accept-collection-bid",
        "cancel-collection-bid", "transfer", "transfer-hold",
        "mint", "burn", "stake", "unstake", "trade-hold"
      ];

      const response = await fetch(TRADEPORT_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TRADEPORT_API_KEY,
          "x-api-user": TRADEPORT_API_USER,
        },
        body: JSON.stringify({
          query,
          variables: {
            collectionId: collection_id,
            tokenId: token_id,
            actionTypes: action_types || defaultActionTypes,
            offset,
            limit,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const history = data.data?.stacks?.actions || [];

      return {
        success: true,
        history,
        collection_id,
        token_id,
        total: history.length,
      };
    } catch (error: any) {
      console.error("Error getting NFT history:", error);
      return {
        success: false,
        error: error.message,
        history: [],
        collection_id,
        token_id,
        total: 0,
      };
    }
  },
});
