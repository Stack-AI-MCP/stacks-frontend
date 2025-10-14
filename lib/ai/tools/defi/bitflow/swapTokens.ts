import { tool } from "ai";
import z from "zod";
import { BitflowSDK } from '@bitflowlabs/core-sdk';

export const bitflowSwapTokens = tool({
  description: `Execute a token swap on BitFlow DEX.

  BitFlow specializes in:
  - Stable swap pools (low slippage for stablecoins)
  - Bitcoin-backed assets (sBTC, xBTC)
  - Automated routing for best prices
  - Keeper system for scheduled swaps (DCA)

  Use bitflowGetQuoteForRoute to get optimal routing before swapping.`,

  inputSchema: z.object({
    from: z.string().describe("Trader's Stacks address"),
    tokenIn: z.string().describe("Input token identifier (e.g., 'token-stx', 'token-usda')"),
    tokenOut: z.string().describe("Output token identifier (e.g., 'token-usda', 'token-susdt')"),
    amountIn: z.string().describe("Amount of input token (in token's base units)"),
    slippageTolerance: z.number().optional().default(1).describe("Slippage tolerance percentage (default: 1%)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    tokenIn,
    tokenOut,
    amountIn,
    slippageTolerance,
    network,
  }) => {
    try {
      // Initialize BitFlow SDK
      const sdk = new BitflowSDK();

      // Get quote for the swap route
      const quote = await sdk.getQuoteForRoute(tokenIn, tokenOut, parseInt(amountIn));

      if (!quote || !quote.bestRoute) {
        throw new Error(`No swap route found for ${tokenIn} → ${tokenOut}`);
      }

      // Create swap execution data from best route
      const swapExecutionData = {
        route: quote.bestRoute.route,
        amount: parseInt(amountIn),
        tokenXDecimals: quote.bestRoute.tokenXDecimals,
        tokenYDecimals: quote.bestRoute.tokenYDecimals,
      };

      // Get swap parameters from SDK
      const swapParams = await sdk.getSwapParams(
        swapExecutionData,
        from,
        slippageTolerance
      );

      return {
        success: true,
        transaction: swapParams,
        message: `BitFlow swap prepared: ${tokenIn} → ${tokenOut}. Please confirm in your wallet.`,
        details: {
          dex: "BitFlow",
          inputToken: tokenIn,
          outputToken: tokenOut,
          amountIn,
          estimatedOutput: quote.bestRoute.quote?.toString() || "calculating...",
          slippage: `${slippageTolerance}%`,
          route: quote.bestRoute.dexPath.join(" → ") || "direct",
          priceImpact: "calculating...",
        },
        instructions: [
          "1. Review the swap route in your wallet",
          "2. Check the estimated output amount and price impact",
          "3. Verify the slippage tolerance",
          "4. Confirm the transaction",
        ],
        tips: [
          "💡 BitFlow specializes in stable swaps with low slippage",
          "💡 Optimal route automatically selected by SDK",
          "💡 Consider using Keeper for DCA (dollar-cost averaging)",
        ],
      };
    } catch (error: any) {
      console.error("Error creating BitFlow swap:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create BitFlow swap transaction",
      };
    }
  },
});
