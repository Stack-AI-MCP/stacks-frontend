"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHandleTransaction } from "@/hooks/useHandleTransaction";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { CheckCircle, XCircle, Loader2, ExternalLink, AlertCircle } from "lucide-react";

export interface StacksTransactionProps {
  // Transaction type
  type: "stx_transfer" | "contract_call" | "token_transfer" | "dex_swap" | "lending_operation" | "stacking_operation";

  // Common fields
  txId?: string;
  success?: boolean;
  error?: string;
  explorerUrl?: string;

  // STX transfer specific
  recipient?: string;
  amount?: string;
  memo?: string;

  // Contract call specific
  contractAddress?: string;
  contractName?: string;
  functionName?: string;
  functionArgs?: any[];

  // Token transfer specific
  tokenSymbol?: string;
  tokenAmount?: string;

  // Protocol-specific details
  swapDetails?: {
    tokenIn?: string;
    tokenOut?: string;
    amountIn?: string;
    amountOut?: string;
    slippage?: number;
  };

  lendingDetails?: {
    protocol?: string;
    action?: string;
    asset?: string;
    amount?: string;
  };

  stackingDetails?: {
    amount?: string;
    lockPeriod?: number;
    poxAddress?: string;
  };

  // Display details
  title?: string;
  description?: string;
}

export default function StacksTransactionComponent(props: StacksTransactionProps) {
  const { address } = useWalletAuth();
  const { handleContractCall, handleSTXTransfer, handleTokenTransfer } = useHandleTransaction();

  const [status, setStatus] = useState<"pending" | "signing" | "broadcasting" | "success" | "error">("pending");
  const [txId, setTxId] = useState<string | null>(props.txId || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(props.error || null);

  const handleExecute = async () => {
    if (!address) {
      setStatus("error");
      setErrorMessage("Please connect your Stacks wallet first");
      return;
    }

    try {
      setStatus("signing");
      let result;

      switch (props.type) {
        case "stx_transfer":
          if (!props.recipient || !props.amount) {
            throw new Error("Missing required fields for STX transfer");
          }
          result = await handleSTXTransfer({
            recipient: props.recipient,
            amount: props.amount,
            memo: props.memo
          });
          break;

        case "contract_call":
        case "dex_swap":
        case "lending_operation":
        case "stacking_operation":
          if (!props.contractAddress || !props.contractName || !props.functionName) {
            throw new Error("Missing required fields for contract call");
          }
          setStatus("broadcasting");
          result = await handleContractCall({
            contractAddress: props.contractAddress,
            contractName: props.contractName,
            functionName: props.functionName,
            functionArgs: props.functionArgs || []
          });
          break;

        case "token_transfer":
          if (!props.contractAddress || !props.contractName || !props.recipient || !props.tokenAmount) {
            throw new Error("Missing required fields for token transfer");
          }
          result = await handleTokenTransfer({
            contractAddress: props.contractAddress,
            contractName: props.contractName,
            recipient: props.recipient,
            amount: props.tokenAmount,
            memo: props.memo
          });
          break;

        default:
          throw new Error("Unsupported transaction type");
      }

      setTxId(result.txId);
      setStatus("success");
    } catch (err: any) {
      console.error("Transaction error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Transaction failed");
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Ready to Execute</Badge>;
      case "signing":
        return <Badge variant="default" className="animate-pulse">Awaiting Signature...</Badge>;
      case "broadcasting":
        return <Badge variant="default" className="animate-pulse">Broadcasting...</Badge>;
      case "success":
        return <Badge variant="default" className="bg-green-600">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getTransactionTitle = () => {
    if (props.title) return props.title;

    switch (props.type) {
      case "stx_transfer":
        return "Send STX";
      case "token_transfer":
        return `Transfer ${props.tokenSymbol || "Token"}`;
      case "dex_swap":
        return "DEX Swap";
      case "lending_operation":
        return `${props.lendingDetails?.protocol || "Lending"} - ${props.lendingDetails?.action || "Operation"}`;
      case "stacking_operation":
        return "Stack STX";
      case "contract_call":
        return `Contract Call: ${props.functionName}`;
      default:
        return "Stacks Transaction";
    }
  };

  const getTransactionDescription = () => {
    if (props.description) return props.description;

    switch (props.type) {
      case "stx_transfer":
        return `Send ${props.amount} micro-STX to ${props.recipient}`;
      case "token_transfer":
        return `Transfer ${props.tokenAmount} ${props.tokenSymbol} to ${props.recipient}`;
      case "dex_swap":
        return `Swap ${props.swapDetails?.amountIn} ${props.swapDetails?.tokenIn} for ${props.swapDetails?.tokenOut}`;
      case "lending_operation":
        return `${props.lendingDetails?.action} ${props.lendingDetails?.amount} ${props.lendingDetails?.asset}`;
      case "stacking_operation":
        return `Stack ${props.stackingDetails?.amount} STX for ${props.stackingDetails?.lockPeriod} cycles`;
      default:
        return props.contractName ? `${props.contractName}.${props.functionName}` : "Execute smart contract function";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getTransactionTitle()}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{getTransactionDescription()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Transaction Details */}
        {props.swapDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">From:</span>
              <span className="font-mono">{props.swapDetails.tokenIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <span className="font-mono">{props.swapDetails.tokenOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount In:</span>
              <span className="font-mono">{props.swapDetails.amountIn}</span>
            </div>
            {props.swapDetails.amountOut && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Out:</span>
                <span className="font-mono">{props.swapDetails.amountOut}</span>
              </div>
            )}
            {props.swapDetails.slippage && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage:</span>
                <span className="font-mono">{props.swapDetails.slippage}%</span>
              </div>
            )}
          </div>
        )}

        {props.lendingDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol:</span>
              <span className="font-mono">{props.lendingDetails.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Action:</span>
              <span className="font-mono">{props.lendingDetails.action}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset:</span>
              <span className="font-mono">{props.lendingDetails.asset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono">{props.lendingDetails.amount}</span>
            </div>
          </div>
        )}

        {props.stackingDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono">{props.stackingDetails.amount} STX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lock Period:</span>
              <span className="font-mono">{props.stackingDetails.lockPeriod} cycles</span>
            </div>
            {props.stackingDetails.poxAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">BTC Address:</span>
                <span className="font-mono text-xs">{props.stackingDetails.poxAddress}</span>
              </div>
            )}
          </div>
        )}

        {/* Contract Details */}
        {props.contractAddress && (
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract:</span>
              <span className="font-mono text-xs">{props.contractAddress}.{props.contractName}</span>
            </div>
            {props.functionName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Function:</span>
                <span className="font-mono">{props.functionName}</span>
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {status === "signing" && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Please confirm the transaction in your Stacks wallet...
            </AlertDescription>
          </Alert>
        )}

        {status === "broadcasting" && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Broadcasting transaction to Stacks network...
            </AlertDescription>
          </Alert>
        )}

        {status === "success" && txId && (
          <Alert className="border-green-600 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Transaction successful!
              <div className="mt-2 font-mono text-xs break-all">{txId}</div>
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "Transaction failed"}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {status === "pending" && (
            <Button
              onClick={handleExecute}
              className="w-full"
              disabled={!address}
            >
              {!address ? "Connect Wallet" : "Execute Transaction"}
            </Button>
          )}

          {status === "success" && (props.explorerUrl || txId) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(
                props.explorerUrl || `https://explorer.stacks.co/txid/${txId}?chain=mainnet`,
                "_blank"
              )}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          )}

          {status === "error" && (
            <Button
              onClick={handleExecute}
              className="w-full"
              variant="secondary"
            >
              Retry
            </Button>
          )}
        </div>

        {/* Wallet Connection Warning */}
        {!address && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your Stacks wallet (Leather or Xverse) to execute this transaction.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
