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
          contractName: "liquidity-provider-v1",
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
