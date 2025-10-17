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
      // Return transaction object for wallet to sign
      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
          contractName: "granite-core",
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
