import { tool } from "ai";
import z from "zod";

const CHARISMA_API_URL = "https://swap.charisma.rocks/api/v1";

export const charismaGetQuote = tool({
  description: `Get optimal swap quote via Charisma vault routing with expected output and price impact.`,

  inputSchema: z.object({
    token_in: z.string().describe("Input token contract ID or .stx"),
    token_out: z.string().describe("Output token contract ID"),
    amount: z.number().positive().describe("Amount of input token in micro-units"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ token_in, token_out, amount, network }) => {
    try {
      const response = await fetch(
        `${CHARISMA_API_URL}/quote?tokenIn=${encodeURIComponent(token_in)}&tokenOut=${encodeURIComponent(token_out)}&amount=${amount}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get Charisma quote: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Quote for swapping ${amount} ${token_in} to ${token_out}`,
      };
    } catch (error: any) {
      console.error("Error getting Charisma quote:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get quote for ${token_in} to ${token_out}`,
      };
    }
  },
});
