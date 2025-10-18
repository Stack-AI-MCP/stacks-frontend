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
