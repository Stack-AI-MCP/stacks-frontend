import { tool } from "ai";
import z from "zod";

export const alexSwapTokens = tool({
  description: `Execute a token swap on ALEX DEX (Automated Liquidity Exchange).

  ALEX is a leading Stacks DEX supporting:
  - AMM pools (automated market maker)
  - Orderbook trading
  - Multiple token pairs
  - Low slippage swaps

  Get quotes first using alexGetPoolStats or alexGetTokenPrice before swapping.`,

  inputSchema: z.object({
    from: z.string().describe("Trader's Stacks address"),
    tokenX: z.string().describe("Input token contract (e.g., 'token-wstx')"),
    tokenY: z.string().describe("Output token contract (e.g., 'token-usda')"),
    amountX: z.string().describe("Amount of tokenX to swap (in token's base units)"),
    minAmountY: z.string().describe("Minimum amount of tokenY to receive (slippage protection)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    tokenX,
    tokenY,
    amountX,
    minAmountY,
    network,
  }) => {
    try {
      const ALEX_CONTRACT_ADDRESS = "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9";
      const ALEX_SWAP_CONTRACT = "amm-swap-pool-v1-1";

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: ALEX_CONTRACT_ADDRESS,
        contractName: ALEX_SWAP_CONTRACT,
        functionName: "swap-helper",
        functionArgs: [
          { type: "principal", value: `${ALEX_CONTRACT_ADDRESS}.${tokenX}` },
          { type: "principal", value: `${ALEX_CONTRACT_ADDRESS}.${tokenY}` },
          { type: "uint", value: amountX },
          { type: "uint", value: minAmountY }
        ],
        postConditions: [
          {
            type: "fungible",
            address: from,
            assetInfo: {
              contractAddress: ALEX_CONTRACT_ADDRESS,
              contractName: tokenX,
              assetName: tokenX,
            },
            amount: amountX,
            condition: "sent-equal-to"
          }
        ],
        network,
        comment: `Swap ${amountX} ${tokenX} for ${tokenY} on ALEX DEX`,
      };

      return {
        success: true,
        transaction,
        message: `ALEX swap prepared: ${tokenX} → ${tokenY}. Please confirm in your wallet.`,
        details: {
          dex: "ALEX",
          inputToken: tokenX,
          outputToken: tokenY,
          amountIn: amountX,
          minAmountOut: minAmountY,
          slippageProtection: true,
        },
        instructions: [
          "1. Review the swap details in your wallet",
          "2. Check the minimum output amount (slippage tolerance)",
          "3. Verify the post-condition protects your input amount",
          "4. Confirm the swap transaction",
          "5. Wait for confirmation (usually 1-2 blocks)",
        ],
        tips: [
          "💡 Use alexGetPoolStats to check pool liquidity first",
          "💡 Set minAmountY based on acceptable slippage (e.g., 1-5%)",
          "💡 Larger swaps may experience more slippage",
        ],
      };
    } catch (error: any) {
      console.error("Error creating ALEX swap:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to create ALEX swap transaction`,
      };
    }
  },
});
