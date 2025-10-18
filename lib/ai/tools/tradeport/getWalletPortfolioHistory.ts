import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetWalletPortfolioHistory = tool({
  description: `Get historical portfolio value for a wallet on TradePort.
  Shows how the total value of NFT holdings changed over time in STX and USD.`,

  inputSchema: z.object({
    wallet_address: z.string().describe("Stacks wallet address (SP...)"),
    period: z.enum(["hours_1", "hours_24", "days_7", "days_30", "days_90", "all"]).default("days_7").describe("Time period for portfolio history"),
  }),

  execute: async ({ wallet_address, period }) => {
    try {
      const query = `
        query fetchWalletPortfolioValues($wallet: String!, $period: WalletHistory!) {
          stacks {
            wallet_values(address: $wallet, history: $period) {
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
          variables: { wallet: wallet_address, period },
        }),
      });

      if (!response.ok) {
        throw new Error(`TradePort API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const portfolioHistory = data.data?.stacks?.wallet_values || [];

      return {
        success: true,
        portfolio_history: portfolioHistory,
        wallet_address,
        period,
        total_points: portfolioHistory.length,
      };
    } catch (error: any) {
      console.error("Error getting wallet portfolio history:", error);
      return {
        success: false,
        error: error.message,
        portfolio_history: [],
        wallet_address,
        period,
        total_points: 0,
      };
    }
  },
});
