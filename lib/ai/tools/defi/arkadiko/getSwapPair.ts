import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const arkadikoGetSwapPair = tool({
  description: `Get detailed information about an Arkadiko DEX swap pair including reserves, fees, and liquidity.`,

  inputSchema: z.object({
    token_x: z.string().describe("First token contract name (e.g., 'wstx-token')"),
    token_y: z.string().describe("Second token contract name (e.g., 'usda-token')"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_x, token_y, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-swap-v2-1";

      const response = await fetch(
        `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-pair-details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: contractAddress,
            arguments: [
              `0x${Buffer.from(token_x).toString('hex')}`,
              `0x${Buffer.from(token_y).toString('hex')}`
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get swap pair: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved swap pair ${token_x}/${token_y}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko swap pair:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get swap pair ${token_x}/${token_y}`,
      };
    }
  },
});
