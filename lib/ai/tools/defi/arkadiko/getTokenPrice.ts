import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const arkadikoGetTokenPrice = tool({
  description: `Get token price from Arkadiko oracle for collateral and liquidation calculations.`,

  inputSchema: z.object({
    token_id: z.number().positive().describe("Token ID in oracle system"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_id, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-oracle-v2-3";

      const response = await fetch(
        `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-price`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: contractAddress,
            arguments: [
              `0x0${token_id.toString(16).padStart(16, '0')}`
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get token price: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved price for token ID ${token_id}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko token price:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get price for token ID ${token_id}`,
      };
    }
  },
});
