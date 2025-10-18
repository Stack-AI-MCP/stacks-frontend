import { tool } from "ai";
import z from "zod";

const TRADEPORT_GRAPHQL_URL = "https://api.indexer.xyz/graphql";
const TRADEPORT_API_KEY = "H13bkcc.e8fda0b2090bd31e74a432f0a3408bae";
const TRADEPORT_API_USER = "ai-stacks";

export const tradeportGetWalletTrades = tool({
  description: `Get realized profit/loss trades for a wallet on TradePort.
  Shows NFT buy/sell pairs with acquisition and release prices for P&L calculation.`,

  inputSchema: z.object({
    wallet_address: z.string().describe("Stacks wallet address (SP...)"),
  }),

  execute: async ({ wallet_address }) => {
    try {
      const query = `
        query fetchWalletRealizedPnL($wallet: String!) {
          stacks {
            wallet_trades(address: $wallet) {
              acquired_at
              acquired_action_type
              acquired_price
              acquired_usd_price
              released_at
              released_action_type
              released_price
              released_usd_price
              collection {
                id
                slug
                title
                supply
              }
              nft {
                id
                token_id
                name
                media_url
                media_type
                ranking
              }
            }
            crypto_rates(
              where: { crypto: { _eq: "stacks" }, fiat: { _eq: "USD" } }
            ) {
              rate
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

      const trades = data.data?.stacks?.wallet_trades || [];
      const cryptoRates = data.data?.stacks?.crypto_rates || [];

      return {
        success: true,
        trades,
        crypto_rates: cryptoRates,
        wallet_address,
        total_trades: trades.length,
      };
    } catch (error: any) {
      console.error("Error getting wallet trades:", error);
      return {
        success: false,
        error: error.message,
        trades: [],
        crypto_rates: [],
        wallet_address,
        total_trades: 0,
      };
    }
  },
});
