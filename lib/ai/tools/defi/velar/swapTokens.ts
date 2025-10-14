import { tool } from "ai";
import z from "zod";
import { VelarSDK } from '@velarprotocol/velar-sdk';

export const velarSwapTokens = tool({
  description: `Execute a token swap on Velar DEX.

  Velar is a multi-chain DEX on Stacks supporting:
  - Native STX and Bitcoin trading
  - Cross-chain swaps
  - High liquidity pools
  - Competitive rates

  Check velarGetCurrentPrices for rates before swapping.`,

  inputSchema: z.object({
    from: z.string().describe("Trader's Stacks address"),
    tokenIn: z.string().describe("Input token symbol or contract (e.g., 'STX', 'WELSH')"),
    tokenOut: z.string().describe("Output token symbol or contract"),
    amountIn: z.string().describe("Amount of input token (in token's base units)"),
    slippage: z.number().optional().default(1).describe("Slippage tolerance percentage (default: 1%)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    tokenIn,
    tokenOut,
    amountIn,
    slippage,
    network,
  }) => {
    try {
      // Initialize Velar SDK
      const sdk = new VelarSDK();

      // Get swap instance from SDK
      const swapInstance = await sdk.getSwapInstance({
        account: from,
        inToken: tokenIn,
        outToken: tokenOut,
      });

      // Get swap contract call parameters from SDK
      const swapCallData = await swapInstance.swap({
        amount: parseInt(amountIn),
        slippage: slippage,
      });

      // Get computed amount for display
      const computedAmount = await swapInstance.getComputedAmount({
        amount: parseInt(amountIn),
        slippage: slippage,
      });

      return {
        success: true,
        transaction: swapCallData,
        message: `Velar swap prepared: ${tokenIn} → ${tokenOut}. Please confirm in your wallet.`,
        details: {
          dex: "Velar",
          inputToken: tokenIn,
          outputToken: tokenOut,
          amountIn,
          estimatedOutput: computedAmount.value?.toString() || "calculating...",
          slippage: `${slippage}%`,
          route: computedAmount.route?.join(" → ") || "direct",
        },
        instructions: [
          "1. Review the swap details in your wallet",
          "2. Check the estimated output amount and price impact",
          "3. Verify the slippage tolerance",
          "4. Confirm the transaction",
        ],
      };
    } catch (error: any) {
      console.error("Error creating Velar swap:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create Velar swap transaction",
      };
    }
  },
});
