import { tool } from "ai";
import z from "zod";

export const granitePrepareRepay = tool({
  description: `Prepare transaction to repay borrowed stablecoins on Granite Protocol.`,

  inputSchema: z.object({
    amount: z.number().positive().describe("Amount of stablecoins to repay in micro-units"),
    from: z.string().describe("Borrower's Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ amount, from, network }) => {
    try {
      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
          contractName: "granite-core",
          functionName: "repay",
          functionArgs: [
            { type: "uint", value: amount.toString() }
          ],
          network,
        },
        message: "Repay transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite repay:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare repay transaction",
      };
    }
  },
});
