import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getContractInfo = tool({
  description: `Get information about a Clarity smart contract.
  Returns contract source code, functions, and metadata.`,

  inputSchema: z.object({
    contractId: z.string().describe("Contract identifier (address.contract-name)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ contractId, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const [contractAddress, contractName] = contractId.split('.');

      if (!contractAddress || !contractName) {
        throw new Error("Invalid contract ID format. Expected: 'address.contract-name'");
      }

      const response = await fetch(
        `${apiUrl}/v2/contracts/interface/${contractAddress}/${contractName}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Failed to get contract info: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: `Retrieved contract info for ${contractName}`,
      };
    } catch (error: any) {
      console.error("Error getting contract info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get contract info for ${contractId}`,
      };
    }
  },
});
