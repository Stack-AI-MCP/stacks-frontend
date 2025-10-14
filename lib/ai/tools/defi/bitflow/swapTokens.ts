import { tool } from "ai";
import z from "zod";

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
    tokenIn: z.string().describe("Input token identifier"),
    tokenOut: z.string().describe("Output token identifier"),
    amountIn: z.string().describe("Amount of input token (in token's base units)"),
    minAmountOut: z.string().describe("Minimum output amount (slippage protection)"),
    route: z.array(z.string()).optional().describe("Optional routing path through pools"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    tokenIn,
    tokenOut,
    amountIn,
    minAmountOut,
    route,
    network,
  }) => {
    try {
      const BITFLOW_CONTRACT_ADDRESS = "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS";
      const BITFLOW_SWAP_CONTRACT = "charisma-swap-v1";

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: BITFLOW_CONTRACT_ADDRESS,
        contractName: BITFLOW_SWAP_CONTRACT,
        functionName: "swap-tokens",
        functionArgs: [
          { type: "principal", value: tokenIn },
          { type: "principal", value: tokenOut },
          { type: "uint", value: amountIn },
          { type: "uint", value: minAmountOut },
          ...(route ? [{ type: "list", value: route.map(r => ({ type: "principal", value: r }))}] : [])
        ],
        network,
        comment: `Swap ${amountIn} on BitFlow DEX`,
      };

      return {
        success: true,
        transaction,
        message: `BitFlow swap prepared: ${tokenIn} → ${tokenOut}. Please confirm in your wallet.`,
        details: {
          dex: "BitFlow",
          inputToken: tokenIn,
          outputToken: tokenOut,
          amountIn,
          minAmountOut,
          route: route || "auto",
        },
        instructions: [
          "1. Review the swap route in your wallet",
          "2. Check the minimum output amount",
          "3. Verify the slippage tolerance",
          "4. Confirm the transaction",
        ],
        tips: [
          "💡 BitFlow specializes in stable swaps with low slippage",
          "💡 Use bitflowGetQuoteForRoute for optimal routing",
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
