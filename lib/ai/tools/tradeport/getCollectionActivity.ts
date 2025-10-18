import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetCollectionActivity = tool({
  description: `Get recent activity (sales, listings, transfers) for an NFT collection on TradePort.
  Shows transaction history with prices, sender/receiver, and timestamps.`,

  inputSchema: z.object({
    collection_id: z.string().describe("Collection ID (UUID format)"),
    action_types: z.array(z.enum([
      "list", "relist", "unlist", "buy", "solo-bid", "accept-bid",
      "unlist-bid", "collection-bid", "accept-collection-bid",
      "cancel-collection-bid", "transfer", "transfer-hold",
      "mint", "burn", "stake", "unstake", "trade-hold"
    ])).optional().describe("Filter by specific action types"),
    limit: z.number().optional().default(30).describe("Number of activities to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ collection_id, action_types, limit, offset }) => {
    try {
      const query = `
        query fetchCollectionActivity(
          $where: recent_actions_bool_exp
          $offset: Int
          $limit: Int!
        ) {
          stacks {
            recent_actions(
              where: $where
              order_by: [{ block_time: desc }, { tx_index: desc }]
              offset: $offset
              limit: $limit
            ) {
              id
              type
              price
              usd_price
              sender
              receiver
              tx_id
              block_time
              market_name
              bought_on_tradeport
              nft {
                id
                name
                media_url
                media_type
                ranking
              }
            }
          }
        }
      `;

      const where: any = {
        collection_id: { _eq: collection_id },
      };

      if (action_types && action_types.length > 0) {
        where.type = { _in: action_types };
      }

      const response = await fetch(TRADEPORT_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TRADEPORT_API_KEY,
          "x-api-user": TRADEPORT_API_USER,
        },
        body: JSON.stringify({
          query,
          variables: { where, offset, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const activities = data.data?.stacks?.recent_actions || [];

      return {
        success: true,
        activities,
        collection_id,
        total: activities.length,
      };
    } catch (error: any) {
      console.error("Error getting collection activity:", error);
      return {
        success: false,
        error: error.message,
        activities: [],
        collection_id,
        total: 0,
      };
    }
  },
});
