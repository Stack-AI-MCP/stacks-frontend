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
