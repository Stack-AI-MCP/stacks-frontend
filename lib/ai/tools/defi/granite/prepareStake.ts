import { tool } from "ai";
import z from "zod";

export const granitePrepareStake = tool({
  description: `Prepare transaction to stake LP tokens on Granite to earn additional rewards.`,

  inputSchema: z.object({
    lp_tokens: z.number().positive().describe("Amount of LP tokens to stake in micro-units"),
    from: z.string().describe("Staker's Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ lp_tokens, from, network }) => {
    try {
      return {
        success: true,
        transaction: {
          type: "contract_call" as const,
          from,
          contractAddress: "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
          contractName: "granite-staking",
          functionName: "stake",
          functionArgs: [
            { type: "uint", value: lp_tokens.toString() }
          ],
          network,
        },
        message: "Stake transaction prepared. Please confirm in your wallet.",
      };
    } catch (error: any) {
      console.error("Error preparing Granite stake:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare stake transaction",
      };
    }
  },
});
