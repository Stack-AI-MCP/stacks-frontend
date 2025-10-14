import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getAccountNonces = tool({
  description: `Get nonce information for a Stacks account.
  Nonce is used to prevent transaction replay attacks.`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address (ST* for testnet, SP* for mainnet)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ address, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v1/address/${address}/nonces`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get nonces: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          address,
          network,
          last_executed_tx_nonce: data.last_executed_tx_nonce,
          last_mempool_tx_nonce: data.last_mempool_tx_nonce,
          possible_next_nonce: data.possible_next_nonce,
          detected_missing_nonces: data.detected_missing_nonces || [],
        },
        message: `Next nonce for ${address}: ${data.possible_next_nonce}`,
      };
    } catch (error: any) {
      console.error("Error getting nonces:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get nonces for ${address}`,
      };
    }
  },
});
