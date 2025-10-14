import { tool } from "ai";
import z from "zod";

export const arkadikoCreateVault = tool({
  description: `Create a new Arkadiko vault to mint USDA stablecoin against collateral.

  Arkadiko vaults allow you to:
  - Deposit collateral (wSTX, xBTC, etc.)
  - Mint USDA stablecoin
  - Maintain a safe collateralization ratio (recommended: 200%+)
  - Avoid liquidation by keeping ratio above 150%

  USDA can be used for:
  - Trading on Arkadiko and other DEXs
  - Lending and borrowing
  - Stable value storage`,

  inputSchema: z.object({
    from: z.string().describe("Vault owner's Stacks address"),
    collateralType: z.string().describe("Collateral token contract (e.g., 'wrapped-stx-token')"),
    collateralAmount: z.string().describe("Amount of collateral to deposit (in token's base units)"),
    usdaToMint: z.string().describe("Amount of USDA to mint (in micro-USDA)"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    collateralType,
    collateralAmount,
    usdaToMint,
    network,
  }) => {
    try {
      const ARKADIKO_CONTRACT_ADDRESS = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";
      const ARKADIKO_VAULT_CONTRACT = "arkadiko-freddie-v1-1";

      // Calculate collateralization ratio for display
      const collateralAmountNum = parseInt(collateralAmount);
      const usdaAmountNum = parseInt(usdaToMint);
      const ratio = (collateralAmountNum / usdaAmountNum) * 100;

      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress: ARKADIKO_CONTRACT_ADDRESS,
        contractName: ARKADIKO_VAULT_CONTRACT,
        functionName: "collateralize-and-mint",
        functionArgs: [
          { type: "principal", value: `${ARKADIKO_CONTRACT_ADDRESS}.${collateralType}` },
          { type: "uint", value: collateralAmount },
          { type: "uint", value: usdaToMint },
          { type: "principal", value: from }
        ],
        network,
        comment: `Create Arkadiko vault: deposit ${collateralAmount} ${collateralType}, mint ${usdaToMint} USDA`,
      };

      return {
        success: true,
        transaction,
        message: `Arkadiko vault creation prepared. Ratio: ${ratio.toFixed(2)}%. Please confirm in your wallet.`,
        details: {
          collateralType,
          collateralAmount,
          usdaToMint,
          collateralizationRatio: `${ratio.toFixed(2)}%`,
          health: ratio >= 200 ? "Safe" : ratio >= 150 ? "Moderate" : "At Risk",
        },
        instructions: [
          "1. Review your collateral and USDA amounts",
          "2. Check the collateralization ratio (recommended: 200%+)",
          "3. Understand liquidation risk if ratio falls below 150%",
          "4. Confirm the transaction",
        ],
        warnings: [
          ratio < 200 && "⚠️ Collateralization ratio below 200% - consider adding more collateral",
          ratio < 150 && "❌ DANGER: Ratio below 150% - vault will be liquidated!",
          "⚠️ Monitor your vault regularly to avoid liquidation",
          "⚠️ Price volatility can affect your collateralization ratio",
        ].filter(Boolean) as string[],
        tips: [
          "💡 Maintain ratio above 200% for safety",
          "💡 Use arkadikoGetVaultInfo to monitor your vault",
          "💡 Add collateral or repay USDA if ratio drops",
        ],
      };
    } catch (error: any) {
      console.error("Error creating Arkadiko vault:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create Arkadiko vault transaction",
      };
    }
  },
});
