import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const searchById = tool({
  description: `Universal search for blocks, transactions, contracts, or accounts by hash/ID.
  Can search by transaction ID, block hash, contract ID, or Stacks address.`,

  inputSchema: z.object({
    id: z.string().describe("Hash or ID to search (transaction ID, block hash, contract ID, or address)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ id, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v1/search/${id}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to search: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.entity_type}: ${data.entity_id}`,
      };
    } catch (error: any) {
      console.error("Error searching:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to search for ${id}`,
      };
    }
  },
});
