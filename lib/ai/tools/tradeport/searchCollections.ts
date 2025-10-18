import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportSearchCollections = tool({
  description: `Search for NFT collections on TradePort marketplace by name or keyword.
  Returns collection details including floor price, volume, and supply.`,

  inputSchema: z.object({
    text: z.string().describe("Search text to find NFT collections"),
    limit: z.number().optional().default(10).describe("Number of collections to return"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),

  execute: async ({ text, limit, offset }) => {
    try {
      const query = `
        query collectionSearch($text: String, $offset: Int, $limit: Int) {
          stacks {
            collections_search(
              args: { text: $text }
              offset: $offset
              limit: $limit
            ) {
              id
              supply
              floor
              slug
              semantic_slug
              title
              usd_volume
              volume
              cover_url
              verified
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
          variables: { text, offset, limit },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const collections = data.data?.stacks?.collections_search || [];

      return {
        success: true,
        collections,
        total: collections.length,
        search_query: text,
      };
    } catch (error: any) {
      console.error("Error searching collections:", error);
      return {
        success: false,
        error: error.message,
        collections: [],
        total: 0,
      };
    }
  },
});
