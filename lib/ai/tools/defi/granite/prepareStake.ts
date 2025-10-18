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
          contractAddress: "SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743",
          contractName: "staking-v1",
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
