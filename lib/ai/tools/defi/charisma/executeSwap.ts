import { tool } from "ai";
import z from "zod";

export const charismaExecuteSwap = tool({
  description: `Execute an immediate swap on Charisma DEX using vault routing.

  Charisma offers:
  - Vault-based composable routing
  - Multi-hop swaps through multiple pools
  - Blaze protocol for intent-based execution
  - Limit orders and automated trading

  For limit orders, use charismaCreateOrder instead.
  Get quotes first using charismaGetQuote.`,

  inputSchema: z.object({
    from: z.string().describe("Trader's Stacks address"),
    tokenIn: z.string().describe("Input token contract ID or .stx"),
    tokenOut: z.string().describe("Output token contract ID"),
    amountIn: z.string().describe("Amount of input token (in micro-units)"),
    minAmountOut: z.string().describe("Minimum output amount (slippage protection)"),
    route: z.array(z.object({
      vault: z.string().describe("Vault contract address for this hop"),
      tokenA: z.string().describe("Input token for this hop"),
      tokenB: z.string().describe("Output token for this hop"),
    })).optional().describe("Optional multi-hop route (auto-calculated if not provided)"),
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
      const CHARISMA_CONTRACT_ADDRESS = "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS";
      const CHARISMA_ROUTER_CONTRACT = "charisma-router-v1";

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: CHARISMA_CONTRACT_ADDRESS,
        contractName: CHARISMA_ROUTER_CONTRACT,
        functionName: route ? "swap-multi-hop" : "swap-exact-tokens",
        functionArgs: route ? [
          { type: "uint", value: amountIn },
          { type: "uint", value: minAmountOut },
          { type: "list", value: route.map(hop => ({
            type: "tuple",
            value: {
              vault: { type: "principal", value: hop.vault },
              tokenA: { type: "principal", value: hop.tokenA },
              tokenB: { type: "principal", value: hop.tokenB },
            }
          }))}
        ] : [
          { type: "principal", value: tokenIn },
          { type: "principal", value: tokenOut },
          { type: "uint", value: amountIn },
          { type: "uint", value: minAmountOut }
        ],
        network,
        comment: route
          ? `Multi-hop swap through ${route.length} vaults on Charisma`
          : `Swap ${amountIn} ${tokenIn} for ${tokenOut} on Charisma`,
      };

      return {
        success: true,
        transaction,
        message: `Charisma swap prepared: ${tokenIn} → ${tokenOut}. Please confirm in your wallet.`,
        details: {
          dex: "Charisma",
          inputToken: tokenIn,
          outputToken: tokenOut,
          amountIn,
          minAmountOut,
          hops: route?.length || 1,
          routing: route ? "multi-hop" : "direct",
        },
        instructions: [
          "1. Review the swap route in your wallet",
          "2. Multi-hop swaps go through multiple vaults for better prices",
          "3. Check the minimum output amount",
          "4. Confirm the transaction",
        ],
        tips: [
          "💡 Charisma uses composable vaults for optimal routing",
          "💡 Multi-hop swaps can get better rates than direct swaps",
          "💡 Use charismaGetQuote to see the optimal route",
          "💡 For scheduled swaps, use charismaCreateOrder for limit orders",
        ],
      };
    } catch (error: any) {
      console.error("Error creating Charisma swap:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create Charisma swap transaction",
      };
    }
  },
});
