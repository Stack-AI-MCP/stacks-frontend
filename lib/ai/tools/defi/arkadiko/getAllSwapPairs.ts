import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

// Known Arkadiko swap pairs on mainnet
const KNOWN_PAIRS_MAINNET = [
  { tokenX: "wstx-token", tokenY: "usda-token", name: "wSTX/USDA" },
  { tokenX: "wstx-token", tokenY: "arkadiko-token", name: "wSTX/DIKO" },
  { tokenX: "usda-token", tokenY: "arkadiko-token", name: "USDA/DIKO" },
  { tokenX: "wstx-token", tokenY: "wrapped-stx-token", name: "wSTX/xSTX" },
  { tokenX: "usda-token", tokenY: "wrapped-stx-token", name: "USDA/xSTX" },
  { tokenX: "arkadiko-token", tokenY: "wrapped-stx-token", name: "DIKO/xSTX" },
];

export const arkadikoGetAllSwapPairs = tool({
  description: `Get all available Arkadiko DEX swap pairs with their current reserves, fees, and liquidity information.`,

  inputSchema: z.object({
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
    include_details: z.boolean().default(true).describe("Include detailed pair information (reserves, fees, etc.)"),
  }),

  execute: async ({ network = "mainnet", include_details = true }) => {
    try {
      const contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const contractName = "arkadiko-swap-v2-1";

      // Get known pairs for the network
      const knownPairs = network === "mainnet" ? KNOWN_PAIRS_MAINNET : [
        // Add testnet pairs if needed
        { tokenX: "wstx-token", tokenY: "usda-token", name: "wSTX/USDA" }
      ];

      const pairs = [];

      if (include_details) {
        // Fetch detailed information for each pair
        for (const pair of knownPairs) {
          try {
            const pairDetails = await fetchPairDetails(contractAddress, contractName, pair.tokenX, pair.tokenY, network);
            pairs.push({
              ...pair,
              ...pairDetails,
              status: "active"
            });
          } catch (error) {
            // Pair might not exist or be inactive
            pairs.push({
              ...pair,
              status: "inactive",
              error: error instanceof Error ? error.message : "Unknown error"
            });
          }
        }
      } else {
        // Return basic pair list without details
        pairs.push(...knownPairs.map(pair => ({
          ...pair,
          status: "active"
        })));
      }

      return {
        success: true,
        data: {
          pairs,
          total_pairs: pairs.length,
          active_pairs: pairs.filter(p => p.status === "active").length,
          network,
          contract_address: contractAddress,
          contract_name: contractName,
        },
        message: `Retrieved ${pairs.length} Arkadiko swap pairs`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko swap pairs:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to get Arkadiko swap pairs",
      };
    }
  },
});

// Helper function to fetch individual pair details
async function fetchPairDetails(
  contractAddress: string,
  contractName: string,
  tokenX: string,
  tokenY: string,
  network: "mainnet" | "testnet"
) {
  const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;
  
  const tokenXPrincipal = `${contractAddress}.${tokenX}`;
  const tokenYPrincipal = `${contractAddress}.${tokenY}`;

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
          {
            type: "principal",
            value: tokenXPrincipal
          },
          {
            type: "principal", 
            value: tokenYPrincipal
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Pair ${tokenX}/${tokenY} not found or inactive`);
  }

  const data = await response.json();
  
  // Parse the Clarity response
  if (data.okay && data.result) {
    const result = data.result;
    return {
      reserve_x: result.value?.find((item: any) => item.name === "reserve-x")?.value || "0",
      reserve_y: result.value?.find((item: any) => item.name === "reserve-y")?.value || "0",
      total_supply: result.value?.find((item: any) => item.name === "total-supply")?.value || "0",
      fee_rate: result.value?.find((item: any) => item.name === "fee-rate")?.value || "0",
      lp_token: result.value?.find((item: any) => item.name === "lp-token")?.value || "",
    };
  }
  
  throw new Error("Invalid response format");
}
