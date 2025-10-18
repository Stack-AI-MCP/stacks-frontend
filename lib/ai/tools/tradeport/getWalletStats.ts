import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetWalletStats = tool({
  description: `Get comprehensive statistics for a wallet on TradePort.
  Includes portfolio value, holdings count, buy/sell volumes, and profit/loss metrics.`,

  inputSchema: z.object({
    wallet_address: z.string().describe("Stacks wallet address (SP...)"),
  }),

  execute: async ({ wallet_address }) => {
    try {
      const query = `
        query fetchWalletStats($wallet: String!) {
          stacks {
            wallet_stats(address: $wallet) {
              holdings_listed_count
              holdings_count
              value
              usd_value
              bought_volume
              bought_usd_volume
              sold_volume
              sold_usd_volume
              realized_profit_loss
              realized_usd_profit_loss
              unrealized_profit_loss
              unrealized_usd_profit_loss
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
          variables: { wallet: wallet_address },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const stats = data.data?.stacks?.wallet_stats?.[0];

      if (!stats) {
        return {
          success: false,
          error: `No wallet stats found for address ${wallet_address}`,
          stats: null,
          wallet_address,
        };
      }

      return {
        success: true,
        stats,
        wallet_address,
      };
    } catch (error: any) {
      console.error("Error getting wallet stats:", error);
      return {
        success: false,
        error: error.message,
        stats: null,
        wallet_address,
      };
    }
  },
});
