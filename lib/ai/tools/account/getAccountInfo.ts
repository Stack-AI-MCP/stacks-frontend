import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getAccountInfo = tool({
  description: `Get comprehensive information about a Stacks account including STX balance, nonce, and locked STX.
  Returns balance in micro-STX (1 STX = 1,000,000 micro-STX), current nonce, and stacking information.`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address (ST* for testnet, SP* for mainnet)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network to query"),
  }),

  execute: async ({ address, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get account info: ${response.statusText}`);
      }

      const data = await response.json();

      // Format STX amounts
      const stxBalance = (parseInt(data.stx.balance) / 1_000_000).toFixed(6);
      const lockedBalance = (parseInt(data.stx.locked) / 1_000_000).toFixed(6);

      return {
        success: true,
        data: {
          address,
          network,
          stx: {
            balance: `${stxBalance} STX`,
            balanceMicroStx: data.stx.balance,
            locked: `${lockedBalance} STX`,
            lockedMicroStx: data.stx.locked,
            totalSent: data.stx.total_sent,
            totalReceived: data.stx.total_received,
          },
          nonce: data.nonce,
          fungibleTokens: data.fungible_tokens || {},
          nonFungibleTokens: data.non_fungible_tokens || {},
        },
        message: `Account ${address} has ${stxBalance} STX (${lockedBalance} STX locked)`,
      };
    } catch (error: any) {
      console.error("Error getting account info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get account info for ${address}`,
      };
    }
  },
});
