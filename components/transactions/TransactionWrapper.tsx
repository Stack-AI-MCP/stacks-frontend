"use client";

import { ReactNode, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, XCircle, AlertCircle } from "lucide-react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useHandleTransaction } from "@/hooks/useHandleTransaction";
import TransactionReceipt from "./TransactionReceipt";

// Transaction type discriminators
type STXTransferData = {
  type: "stx_transfer";
  recipient: string;
  amount: string;
  memo?: string;
};

type ContractCallData = {
  type: "contract_call";
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
};

type ContractDeployData = {
  type: "contract_deploy";
  name: string;
  code: string;
  clarityVersion?: number;
};

type TokenTransferData = {
  type: "token_transfer";
  contractAddress: string;
  contractName: string;
  recipient: string;
  amount: string;
  memo?: string;
};

export type TransactionData =
  | STXTransferData
  | ContractCallData
  | ContractDeployData
  | TokenTransferData;

export interface TransactionWrapperProps {
  children: ReactNode;
  transactionData: TransactionData | null;
  network?: "mainnet" | "testnet";
  buttonText?: string;
  buttonGradient?: string;
  disabled?: boolean;
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export default function TransactionWrapper({
  children,
  transactionData,
  network = "mainnet",
  buttonText = "Sign & Submit Transaction",
  buttonGradient = "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
  disabled = false,
  onSuccess,
  onError,
}: TransactionWrapperProps) {
  // Wallet hooks
  const { address, isConnected } = useWalletAuth();
  const {
    handleSTXTransfer,
    handleContractCall,
    handleContractDeploy,
    handleTokenTransfer,
  } = useHandleTransaction();

  // Transaction state
  const [txState, setTxState] = useState<
    "idle" | "signing" | "broadcasting" | "success" | "error"
  >("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Transaction signing handler
  const handleSignAndSubmit = async () => {
    if (!isConnected || !address) {
      const errorMsg = "Please connect your Stacks wallet first";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!transactionData) {
      const errorMsg = "Invalid transaction data";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setTxState("signing");
      setError(null);

      let result: { txid: string };

      // Route to appropriate handler based on transaction type
      switch (transactionData.type) {
        case "stx_transfer":
          result = await handleSTXTransfer({
            recipient: transactionData.recipient,
            amount: transactionData.amount,
            memo: transactionData.memo,
          });
          break;

        case "contract_call":
          result = await handleContractCall({
            contractAddress: transactionData.contractAddress,
            contractName: transactionData.contractName,
            functionName: transactionData.functionName,
            functionArgs: transactionData.functionArgs,
          });
          break;

        case "contract_deploy":
          result = await handleContractDeploy({
            name: transactionData.name,
            code: transactionData.code,
            clarityVersion: transactionData.clarityVersion,
          });
          // Set contract ID for deployments
          setContractId(`${address}.${transactionData.name}`);
          break;

        case "token_transfer":
          result = await handleTokenTransfer({
            contractAddress: transactionData.contractAddress,
            contractName: transactionData.contractName,
            recipient: transactionData.recipient,
            amount: transactionData.amount,
            memo: transactionData.memo,
          });
          break;

        default:
          throw new Error("Unknown transaction type");
      }

      setTxState("broadcasting");
      setTxId(result.txid);
      setTxState("success");
      onSuccess?.(result.txid);
    } catch (err) {
      console.error("Transaction error:", err);
      setTxState("error");
      const errorMsg = err instanceof Error ? err.message : "Transaction failed";
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  // Reset transaction state
  const handleReset = () => {
    setTxState("idle");
    setTxId(null);
    setContractId(null);
    setError(null);
  };

  // Show receipt on success
  if (txState === "success" && txId) {
    return (
      <div className="space-y-4">
        <TransactionReceipt
          txId={txId}
          network={network}
          contractId={contractId || undefined}
          onClose={handleReset}
        />
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full"
        >
          Create Another Transaction
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Render child component (transaction details display) */}
      {children}

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            Connect your Stacks wallet to execute this transaction
          </AlertDescription>
        </Alert>
      )}

      {/* Transaction Action Button */}
      <Button
        onClick={handleSignAndSubmit}
        disabled={
          !isConnected ||
          !transactionData ||
          disabled ||
          txState === "signing" ||
          txState === "broadcasting"
        }
        className={`w-full bg-gradient-to-r ${buttonGradient} disabled:opacity-50 disabled:cursor-not-allowed`}
        size="lg"
      >
        {txState === "idle" && (
          <>
            <Zap className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
        {txState === "signing" && (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Waiting for Signature...
          </>
        )}
        {txState === "broadcasting" && (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Broadcasting Transaction...
          </>
        )}
        {txState === "error" && (
          <>
            <XCircle className="w-4 h-4 mr-2" />
            Try Again
          </>
        )}
      </Button>

      {/* Error Display */}
      {error && txState === "error" && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <XCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Transaction Failed</span>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
