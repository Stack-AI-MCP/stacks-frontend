import { request } from "@stacks/connect";
import { useWalletAuth } from "./use-wallet-auth";

/**
 * Hook for handling Stacks transactions
 * Uses @stacks/connect RPC methods for transaction signing
 */
export function useHandleTransaction() {
  const { address } = useWalletAuth();

  /**
   * Send STX tokens to another address
   */
  const handleSTXTransfer = async (params: {
    recipient: string;
    amount: string; // Amount in micro-STX
    memo?: string;
  }) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await request('stx_transferStx', {
        recipient: params.recipient,
        amount: params.amount,
        memo: params.memo
      });

      console.log("✅ STX transfer sent:", result?.txid!);
      return result;
    } catch (err) {
      console.error("❌ Error sending STX transfer:", err);
      throw err;
    }
  };

  /**
   * Call a smart contract function
   */
  const handleContractCall = async (params: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: any[]; // Clarity values
  }) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await request('stx_callContract', {
        contract: `${params.contractAddress}.${params.contractName}`,
        functionName: params.functionName,
        functionArgs: params.functionArgs
      });
      console.log("✅ Contract call sent:", result?.txid!);
      return result;
    } catch (err) {
      console.error("❌ Error calling contract:", err);
      throw err;
    }
  };

  /**
   * Deploy a smart contract
   */
  const handleContractDeploy = async (params: {
    name: string;
    code: string;
    clarityVersion?: number;
  }) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await request('stx_deployContract', {
        name: params.name,
        clarityCode: params.code,
        clarityVersion: params.clarityVersion || 3
      });

      console.log("✅ Contract deployed:", result?.txid!);
      return result;
    } catch (err) {
      console.error("❌ Error deploying contract:", err);
      throw err;
    }
  };

  /**
   * Transfer SIP-10 fungible token
   */
  const handleTokenTransfer = async (params: {
    contractAddress: string;
    contractName: string;
    recipient: string;
    amount: string;
    memo?: string;
  }) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await request('stx_transferSip10Ft', {
        asset: `${params.contractAddress}.${params.contractName}`,
        recipient: params.recipient,
        amount: params.amount
      });

      console.log("✅ Token transfer sent:", result?.txid!);
      return result;
    } catch (err) {
      console.error("❌ Error sending token transfer:", err);
      throw err;
    }
  };

  return {
    handleSTXTransfer,
    handleContractCall,
    handleContractDeploy,
    handleTokenTransfer
  };
}
