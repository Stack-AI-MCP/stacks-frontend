import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const arkadikoGetStakeInfo = tool({
  description: `Get DIKO staking information for an address including staked amount and rewards.`,

  inputSchema: z.object({
    staker: z.string().describe("Staker Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ staker, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-stake-registry-v2-1";

      const response = await fetch(
        `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-stake-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: staker,
            arguments: [
              `0x${Buffer.from(staker).toString('hex')}`
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get stake info: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved staking info for ${staker}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko stake info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get stake info for ${staker}`,
      };
    }
  },
});
