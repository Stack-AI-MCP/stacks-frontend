import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetCollectionStats = tool({
  description: `Get detailed statistics for a specific NFT collection on TradePort.
  Includes total volume, sales, mints, and daily metrics.`,

  inputSchema: z.object({
    slug: z.string().describe("Collection slug (e.g., 'bitcoin-monkeys')"),
  }),

  execute: async ({ slug }) => {
    try {
      const query = `
        query fetchCollectionStats($slug: String!) {
          stacks {
            collection_stats(slug: $slug) {
              total_mint_volume
              total_mint_usd_volume
              total_mints
              total_sales
              total_usd_volume
              total_volume
              day_volume
              day_sales
              day_usd_volume
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
          variables: { slug },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const stats = data.data?.stacks?.collection_stats?.[0];

      if (!stats) {
        return {
          success: false,
          error: `Collection stats not found for "${slug}"`,
          stats: null,
        };
      }

      return {
        success: true,
        stats,
        slug,
      };
    } catch (error: any) {
      console.error("Error getting collection stats:", error);
      return {
        success: false,
        error: error.message,
        stats: null,
        slug,
      };
    }
  },
});
