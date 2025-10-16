import { tool } from "ai";
import z from "zod";
import {
  fetchCallReadOnlyFunction,
  uintCV,
  standardPrincipalCV,
  cvToJSON,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const arkadikoGetVaultInfo = tool({
  description: `Get detailed information about an Arkadiko vault including collateral, debt, and health metrics.`,

  inputSchema: z.object({
    vault_id: z.number().int().min(0).describe("Vault ID to query"),
    owner: z.string().describe("Vault owner Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("mainnet").describe("Stacks network"),
  }),

  execute: async ({ vault_id, owner, network }) => {
    try {
      // Arkadiko is only deployed on mainnet
      if (network === 'testnet') {
        return {
          success: false,
          error: 'Arkadiko is only available on mainnet',
          message: 'Arkadiko protocol is not deployed on public testnet. Please use mainnet or deploy to a local mocknet for testing.',
        };
      }

      const contractAddress = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
      const contractName = 'arkadiko-vaults-data-v1-1';
      const stacksNetwork = STACKS_MAINNET;

      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-vault',
        functionArgs: [uintCV(vault_id), standardPrincipalCV(owner)],
        senderAddress: contractAddress,
        network: stacksNetwork,
      });

      const vaultData = cvToJSON(result).value || {};

      const collateralAmount = vaultData['collateral-amount']?.value || '0';
      const debtAmount = vaultData.debt?.value || '0';

      // Calculate collateralization ratio
      const calculateRatio = (collateral: string, debt: string): string => {
        const col = parseInt(collateral);
        const dbt = parseInt(debt);
        if (dbt === 0) return '∞';
        const ratio = (col / dbt) * 100;
        return `${ratio.toFixed(2)}%`;
      };

      return {
        success: true,
        data: {
          id: vault_id,
          owner,
          collateralType: vaultData.collateral?.value || '',
          collateralAmount,
          debtAmount,
          collateralizationRatio: calculateRatio(collateralAmount, debtAmount),
          liquidationPrice: vaultData['liquidation-price']?.value || '0',
          status: vaultData.status?.value || 'unknown',
        },
        message: `Retrieved vault #${vault_id} info for ${owner}`,
      };
    } catch (error: any) {
      console.error("Error getting Arkadiko vault info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get vault #${vault_id} info`,
      };
    }
  },
});
