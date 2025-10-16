import { tool } from "ai";
import z from "zod";

export const arkadikoCreateVault = tool({
  description: `Create a new Arkadiko vault for minting USDA stablecoin using STX or other collateral.

  Arkadiko vaults allow you to:
  - Mint USDA stablecoin against collateral
  - Self-repaying loans via stacking rewards
  - Multi-collateral support (STX, xBTC, etc.)

  Use arkadikoGetVaultInfo to check vault health after creation.`,

  inputSchema: z.object({
    from: z.string().describe("Vault creator's Stacks address"),
    collateralType: z.string().describe("Collateral token contract name (e.g., 'wrapped-stx-token')"),
    collateralAmount: z.string().describe("Amount of collateral to deposit (in micro-units)"),
    debtAmount: z.string().describe("Amount of USDA to mint (in micro-units)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    collateralType,
    collateralAmount,
    debtAmount,
    network,
  }) => {
    try {
      // Arkadiko is only deployed on mainnet
      if (network === 'testnet') {
        return {
          success: false,
          error: 'Arkadiko is only available on mainnet',
          message: 'Arkadiko protocol is not deployed on public testnet. Please use mainnet or deploy to a local mocknet for testing.',
        };
      }

      const ARKADIKO_CONTRACT_ADDRESS = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const ARKADIKO_VAULTS_OPERATIONS = "arkadiko-vaults-operations-v1-3";

      // Calculate collateralization ratio
      const colAmount = parseFloat(collateralAmount);
      const dbtAmount = parseFloat(debtAmount);
      const collateralizationRatio = ((colAmount / dbtAmount) * 100).toFixed(2);

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: ARKADIKO_CONTRACT_ADDRESS,
        contractName: ARKADIKO_VAULTS_OPERATIONS,
        functionName: "open-vault",
        functionArgs: [
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-vaults-tokens-v1-1` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-vaults-data-v1-1` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-vaults-sorted-v1-1` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-vaults-pool-active-v1-1` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-vaults-helpers-v1-1` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.arkadiko-oracle-v2-3` },
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.${collateralType}` },
          { type: "uint", value: collateralAmount },
          { type: "uint", value: debtAmount },
          { type: "none" } // prevHint - optional optimization parameter
        ],
        network,
        comment: `Create Arkadiko vault with ${collateralType} collateral`,
      };

      return {
        success: true,
        transaction,
        message: `Arkadiko vault creation prepared. Please confirm in your wallet.`,
        details: {
          protocol: "Arkadiko",
          operation: "Create Vault",
          collateralType,
          collateralAmount: `${(colAmount / 1_000_000).toFixed(6)} tokens`,
          usdaToMint: `${(dbtAmount / 1_000_000).toFixed(6)} USDA`,
          collateralizationRatio: `${collateralizationRatio}%`,
          minSafeRatio: "200%",
          liquidationRatio: "150%",
        },
        instructions: [
          "1. Review the vault parameters in your wallet",
          "2. Ensure you have sufficient collateral",
          "3. Verify the collateralization ratio is above 200%",
          "4. Confirm the transaction",
        ],
        warnings: [
          "⚠️ Maintain collateralization ratio above 200% for safety",
          "⚠️ Below 150% ratio, your vault may be liquidated",
          "⚠️ Monitor your vault health regularly",
        ],
      };
    } catch (error: any) {
      console.error("Error creating Arkadiko vault:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to prepare Arkadiko vault creation",
      };
    }
  },
});
