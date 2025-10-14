import { tool } from "ai";
import z from "zod";

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
    minAmountOut: z.string().describe("Minimum output amount (slippage protection)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    tokenIn,
    tokenOut,
    amountIn,
    minAmountOut,
    network,
  }) => {
    try {
      const VELAR_CONTRACT_ADDRESS = "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1";
      const VELAR_SWAP_CONTRACT = "univ2-core";

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: VELAR_CONTRACT_ADDRESS,
        contractName: VELAR_SWAP_CONTRACT,
        functionName: "swap-exact-tokens-for-tokens",
        functionArgs: [
          { type: "uint", value: amountIn },
          { type: "uint", value: minAmountOut },
          { type: "principal", value: `${VELAR_CONTRACT_ADDRESS}.${tokenIn}` },
          { type: "principal", value: `${VELAR_CONTRACT_ADDRESS}.${tokenOut}` },
          { type: "principal", value: from }
        ],
        network,
        comment: `Swap ${amountIn} ${tokenIn} for ${tokenOut} on Velar DEX`,
      };

      return {
        success: true,
        transaction,
        message: `Velar swap prepared: ${tokenIn} → ${tokenOut}. Please confirm in your wallet.`,
        details: {
          dex: "Velar",
          inputToken: tokenIn,
          outputToken: tokenOut,
          amountIn,
          minAmountOut,
        },
        instructions: [
          "1. Review the swap details in your wallet",
          "2. Verify the minimum output amount",
          "3. Confirm the transaction",
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
