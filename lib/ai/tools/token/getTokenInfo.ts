import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getTokenInfo = tool({
  description: `Get information about a SIP-10 fungible token on Stacks.
  Returns token metadata including name, symbol, decimals, and total supply if available.
  Examples: USDA (Arkadiko stablecoin), DIKO (Arkadiko governance), ALEX (ALEX DEX token).`,

  inputSchema: z.object({
    contractId: z.string().describe("Full contract identifier (e.g., 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-alex')"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ contractId, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
      const [contractAddress, contractName] = contractId.split('.');

      if (!contractAddress || !contractName) {
        throw new Error("Invalid contract ID format. Expected: 'address.contract-name'");
      }

      // Get contract source to look for SIP-10 trait
      const contractResponse = await fetch(`${apiUrl}/v2/contracts/interface/${contractAddress}/${contractName}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!contractResponse.ok) {
        throw new Error(`Failed to get token info: ${contractResponse.statusText}`);
      }

      const contractData = await contractResponse.json();

      // Try to fetch token metadata from Hiro API
      let metadata = null;
      try {
        const metadataResponse = await fetch(`${apiUrl}/extended/v1/tokens/ft/metadata?contract_id=${contractId}`, {
          headers: { 'Accept': 'application/json' }
        });

        if (metadataResponse.ok) {
          metadata = await metadataResponse.json();
        }
      } catch (error) {
        console.warn("Could not fetch token metadata:", error);
      }

      return {
        success: true,
        data: {
          contractId,
          contractAddress,
          contractName,
          network,
          metadata: metadata || {
            note: "Metadata not available. Contract exists but metadata endpoint returned no data.",
          },
          interface: {
            functions: contractData.functions || [],
            variables: contractData.variables || [],
          },
        },
        message: metadata
          ? `Token: ${metadata.name} (${metadata.symbol}), ${metadata.decimals} decimals`
          : `Contract ${contractId} found (metadata not available)`,
      };
    } catch (error: any) {
      console.error("Error getting token info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get token info for ${contractId}`,
      };
    }
  },
});
