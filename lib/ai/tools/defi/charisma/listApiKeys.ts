import { tool } from "ai";
import z from "zod";

const CHARISMA_API_URL = "https://swap.charisma.rocks/api/v1";

export const charismaListApiKeys = tool({
  description: `List all API keys for a wallet address (requires authentication).`,

  inputSchema: z.object({
    message: z.string().describe("Signed message for authentication"),
    signature: z.string().describe("Wallet signature of the message"),
    wallet_address: z.string().describe("Wallet address owning the API keys"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ message, signature, wallet_address, network }) => {
    try {
      const response = await fetch(`${CHARISMA_API_URL}/api-keys`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Message': message,
          'X-Signature': signature,
          'X-Wallet-Address': wallet_address
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list API keys: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Found ${data.length || 0} API keys for ${wallet_address}`,
      };
    } catch (error: any) {
      console.error("Error listing Charisma API keys:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to list API keys",
      };
    }
  },
});
