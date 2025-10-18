import { tool } from "ai";
import z from "zod";

export const granitePrepareBorrow = tool({
  description: `Prepare transaction to borrow stablecoins against BTC collateral on Granite Protocol.`,

  inputSchema: z.object({
    amount: z.number().positive().describe("Amount of stablecoins to borrow in micro-units"),
    from: z.string().describe("Borrower's Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ amount, from, network }) => {
    try {
      // Granite Protocol is only deployed on mainnet
      if (network === "testnet") {
        return {
          success: false,
          error: "Granite Protocol is only available on mainnet. Please switch to mainnet network.",
          message: "Granite Protocol is not deployed on testnet - mainnet only",
        };
      }

      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP26NGV9AFZBX7XBDBS2C7EC7FCPSAV9PKREQNMVS",
          contractName: "borrower-v1",
          functionName: "borrow",
          functionArgs: [
            { type: "uint", value: amount.toString() }
          ],
          network,
        },
        message: "Borrow transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite borrow:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare borrow transaction",
      };
    }
  },
});
