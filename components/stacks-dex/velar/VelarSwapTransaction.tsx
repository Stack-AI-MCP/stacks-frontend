"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, AlertCircle, CheckCircle, Route } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Velar Swap Transaction type
type VelarSwapTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: Array<{
    type: string;
    value: string;
  }>;
  network: string;
  comment?: string;
};

type VelarSwapTransactionResponse = {
  success: boolean;
  transaction?: VelarSwapTransaction;
  details?: {
    dex: string;
    inputToken: string;
    outputToken: string;
    amountIn: string;
    estimatedOutput: string;
    slippage: string;
    route: string;
  };
  instructions?: string[];
  message?: string;
  error?: string;
};

export interface VelarSwapTransactionProps {
  data: VelarSwapTransactionResponse;
  isLoading: boolean;
}

export default function VelarSwapTransaction({ data, isLoading }: VelarSwapTransactionProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Create Swap Transaction</CardTitle>
          <CardDescription>{data.error || "Unable to prepare Velar swap"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction;
  const details = data.details;

  if (!transaction || !details) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Response</CardTitle>
          <CardDescription>Transaction data is missing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare transaction data for wrapper
  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper
      transactionData={transactionData}
      network={transaction.network === "mainnet" ? "mainnet" : "testnet"}
      buttonText="Sign & Swap on Velar"
      buttonGradient="from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
    >
      <Card className="w-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-xl">Velar DEX Swap</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Swap {details.inputToken} → {details.outputToken} on {details.dex}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Swap Preview */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Badge variant="outline" className="text-green-400 border-green-500/30 text-lg px-4 py-1">
                {details.inputToken}
              </Badge>
              <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
              <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-lg px-4 py-1">
                {details.outputToken}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{details.dex}</p>
          </div>

          {/* Swap Details */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Amount In:</span>
                <span className="text-white font-mono">{details.amountIn}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Estimated Output:</span>
                <span className="text-white font-mono">{details.estimatedOutput}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Slippage Tolerance:</span>
                <Badge variant="outline" className="text-xs">{details.slippage}</Badge>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-zinc-400">Swap Route</span>
            </div>
            <p className="text-sm text-white font-mono">{details.route}</p>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Instructions */}
          {data.instructions && data.instructions.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  {data.instructions.map((instruction, idx) => (
                    <p key={idx} className="text-xs text-blue-300">{instruction}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Velar supports multi-chain swaps and cross-chain trading
              </p>
              <p className="text-xs text-blue-300">
                💡 Check the route for optimal swap paths
              </p>
              <p className="text-xs text-blue-300">
                💡 Adjust slippage if the transaction fails
              </p>
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-sm text-blue-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 px-6 py-2">
              Swap ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
