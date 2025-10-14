import { tool } from "ai";
import z from "zod";

export const granitePrepareWithdraw = tool({
  description: `Prepare transaction to withdraw supplied assets plus earned interest from Granite liquidity pool.`,

  inputSchema: z.object({
    assets: z.number().positive().describe("Amount of stablecoins to withdraw in micro-units"),
    from: z.string().describe("Withdrawer's Stacks address"),
    recipient: z.string().describe("Address to receive withdrawn assets"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ assets, from, recipient, network }) => {
    try {
      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
          contractName: "granite-vault",
          functionName: "withdraw",
          functionArgs: [
            { type: "uint", value: assets.toString() },
            { type: "principal", value: recipient }
          ],
          network,
        },
        message: "Withdraw transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite withdraw:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare withdraw transaction",
      };
    }
  },
});
