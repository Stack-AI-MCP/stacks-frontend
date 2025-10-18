import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetCollectionFloorHistory = tool({
  description: `Get historical floor price data for an NFT collection on TradePort.
  Shows price changes over time in STX and USD.`,

  inputSchema: z.object({
    slug: z.string().describe("Collection slug (e.g., 'bitcoin-monkeys')"),
    period: z.enum(["hours_1", "hours_24", "days_7", "days_30", "days_90", "all"]).default("days_7").describe("Time period for floor price history"),
    limit: z.number().optional().default(100).describe("Number of data points to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ slug, period, limit, offset }) => {
    try {
      const query = `
        query fetchCollectionFloorHistory(
          $slug: String!
          $period: CollectionFloorPeriod!
          $offset: Int!
          $limit: Int!
        ) {
          stacks {
            collection_floors(
              slug: $slug
              period: $period
              offset: $offset
              limit: $limit
            ) {
              time
              usd_value
              value
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
          variables: { slug, period, offset, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const floorHistory = data.data?.stacks?.collection_floors || [];

      return {
        success: true,
        floor_history: floorHistory,
        slug,
        period,
        total_points: floorHistory.length,
      };
    } catch (error: any) {
      console.error("Error getting collection floor history:", error);
      return {
        success: false,
        error: error.message,
        floor_history: [],
        slug,
        period,
        total_points: 0,
      };
    }
  },
});
