import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetCollectionInfo = tool({
  description: `Get detailed information about a specific NFT collection on TradePort.
  Includes floor price, volume, supply, social links, and verification status.`,

  inputSchema: z.object({
    slug: z.string().describe("Collection slug (e.g., 'bitcoin-monkeys')"),
  }),

  execute: async ({ slug }) => {
    try {
      const query = `
        query fetchCollectionInfo($slug: String) {
          stacks {
            collections(
              where: {
                _or: [{ semantic_slug: { _eq: $slug } }, { slug: { _eq: $slug } }]
              }
            ) {
              id
              title
              slug
              semantic_slug
              description
              floor
              volume
              usd_volume
              cover_url
              supply
              verified
              discord
              twitter
              website
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

      const collection = data.data?.stacks?.collections?.[0];

      if (!collection) {
        return {
          success: false,
          error: `Collection "${slug}" not found`,
          collection: null,
        };
      }

      return {
        success: true,
        collection,
      };
    } catch (error: any) {
      console.error("Error getting collection info:", error);
      return {
        success: false,
        error: error.message,
        collection: null,
      };
    }
  },
});
