import { tool } from "ai";
import z from "zod";

export const granitePrepareAddCollateral = tool({
  description: `Prepare transaction to deposit BTC (sBTC) as collateral on Granite Protocol.`,

  inputSchema: z.object({
    collateral_token: z.string().describe("Collateral token contract address (sBTC)"),
    amount: z.number().positive().describe("Amount of collateral to deposit in micro-units"),
    from: z.string().describe("User's Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ collateral_token, amount, from, network }) => {
    try {
      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
          contractName: "granite-core",
          functionName: "add-collateral",
          functionArgs: [
            { type: "principal", value: collateral_token },
            { type: "uint", value: amount.toString() }
          ],
          network,
        },
        message: "Add collateral transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite add collateral:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare add collateral transaction",
      };
    }
  },
});
