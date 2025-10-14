import { tool } from "ai";
import z from "zod";

export const granitePrepareDeposit = tool({
  description: `Prepare transaction to deposit stablecoins and earn passive yield as a liquidity provider on Granite.`,

  inputSchema: z.object({
    assets: z.number().positive().describe("Amount of stablecoins to deposit in micro-units"),
    from: z.string().describe("Depositor's Stacks address"),
    recipient: z.string().describe("Address to receive LP tokens (usually same as from)"),
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
          functionName: "deposit",
          functionArgs: [
            { type: "uint", value: assets.toString() },
            { type: "principal", value: recipient }
          ],
          network,
        },
        message: "Deposit transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite deposit:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare deposit transaction",
      };
    }
  },
});
