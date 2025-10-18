import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetTrendingCollections = tool({
  description: `Get trending NFT collections on TradePort marketplace.
  Shows collections with highest volume or trade activity over specified time period.`,

  inputSchema: z.object({
    period: z.enum(["days_1", "days_7", "days_30"]).default("days_7").describe("Time period (1d, 7d, or 30d)"),
    trending_by: z.enum(["trades_count", "average_trade", "usd_volume", "crypto_volume"]).default("usd_volume").describe("Metric to rank by: trades_count, average_trade, usd_volume, or crypto_volume"),
    limit: z.number().optional().default(10).describe("Number of collections to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ period, trending_by, limit, offset }) => {
    try {
      const query = `
        query fetchTrendingCollections(
          $period: TrendingPeriod!
          $trending_by: TrendingBy!
          $offset: Int = 0
          $limit: Int!
        ) {
          stacks {
            collections_trending(
              period: $period
              trending_by: $trending_by
              offset: $offset
              limit: $limit
            ) {
              collection_id
              current_trades_count
              current_usd_volume
              current_volume
              previous_trades_count
              previous_usd_volume
              previous_volume
              collection {
                id
                slug
                semantic_slug
                title
                supply
                cover_url
                floor
                usd_volume
                volume
                verified
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
          variables: { period, trending_by, offset, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const trending = data.data?.stacks?.collections_trending || [];

      return {
        success: true,
        trending,
        period,
        trending_by,
      };
    } catch (error: any) {
      console.error("Error getting trending collections:", error);
      return {
        success: false,
        error: error.message,
        trending: [],
        period,
        trending_by,
      };
    }
  },
});
