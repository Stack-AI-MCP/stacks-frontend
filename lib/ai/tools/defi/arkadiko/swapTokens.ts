import { tool } from "ai";
import z from "zod";

export const arkadikoSwapTokens = tool({
  description: `Execute a token swap on Arkadiko DEX.

  Arkadiko is a comprehensive DeFi protocol offering:
  - AMM swap pools
  - Stablecoin (USDA) support
  - wSTX and governance token (DIKO) trading
  - Integrated with Arkadiko vaults and lending

  Use arkadikoGetSwapPair to check pool details before swapping.`,

  inputSchema: z.object({
    from: z.string().describe("Trader's Stacks address"),
    tokenX: z.string().describe("Input token contract (e.g., 'wrapped-stx-token')"),
    tokenY: z.string().describe("Output token contract (e.g., 'usda-token')"),
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
      const ARKADIKO_CONTRACT_ADDRESS = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const ARKADIKO_SWAP_CONTRACT = "arkadiko-swap-v2-1";

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: ARKADIKO_CONTRACT_ADDRESS,
        contractName: ARKADIKO_SWAP_CONTRACT,
        functionName: "swap-x-for-y",
        functionArgs: [
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.${tokenX}` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.${tokenY}` },
          { type: "uint", value: amountX },
          { type: "uint", value: minAmountY }
        ],
        network,
        comment: `Swap ${amountX} ${tokenX} for ${tokenY} on Arkadiko DEX`,
      };

      return {
        success: true,
        transaction,
        message: `Arkadiko swap prepared: ${tokenX} → ${tokenY}. Please confirm in your wallet.`,
        details: {
          dex: "Arkadiko",
          inputToken: tokenX,
          outputToken: tokenY,
          amountIn: amountX,
          minAmountOut: minAmountY,
        },
        instructions: [
          "1. Review the swap details in your wallet",
          "2. Check the minimum output (slippage protection)",
          "3. Confirm the transaction",
        ],
        tips: [
          "💡 Arkadiko specializes in USDA stablecoin swaps",
          "💡 Lower fees for USDA-related pairs",
          "💡 Can swap wSTX directly for lending collateral",
        ],
      };
    } catch (error: any) {
      console.error("Error creating Arkadiko swap:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create Arkadiko swap transaction",
      };
    }
  },
});
