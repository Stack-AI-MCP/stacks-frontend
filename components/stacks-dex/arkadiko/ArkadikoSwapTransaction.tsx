"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, AlertCircle, CheckCircle } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Arkadiko Swap Transaction type
type ArkadikoSwapTransactionData = {
  transaction: {
    type: "contract_call";
    from: string;
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: Array<{ type: string; value: string }>;
    network: "mainnet" | "testnet";
    comment: string;
  };
  details: {
    dex: string;
    inputToken: string;
    outputToken: string;
    amountIn: string;
    minAmountOut: string;
  };
  instructions?: string[];
  tips?: string[];
};

type ArkadikoSwapTransactionResponse = {
  success: boolean;
  transaction?: ArkadikoSwapTransactionData["transaction"];
  details?: ArkadikoSwapTransactionData["details"];
  instructions?: string[];
  tips?: string[];
  message?: string;
  error?: string;
};

export interface ArkadikoSwapTransactionProps {
  data: ArkadikoSwapTransactionResponse;
  isLoading: boolean;
}

export default function ArkadikoSwapTransaction({ data, isLoading }: ArkadikoSwapTransactionProps) {
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
          <CardDescription>{data.error || "Unable to prepare Arkadiko swap"}</CardDescription>
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
      buttonText="Sign & Swap on Arkadiko"
      buttonGradient="from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
    >
      <Card className="w-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-pink-400" />
            <CardTitle className="text-xl">Arkadiko Swap</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Swap {details.inputToken} → {details.outputToken} on {details.dex}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Swap Preview */}
          <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-lg px-4 py-1">
                {details.inputToken}
              </Badge>
              <ArrowRightLeft className="w-6 h-6 text-rose-400" />
              <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-lg px-4 py-1">
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
                <span className="text-zinc-400">Min Amount Out:</span>
                <span className="text-white font-mono">{details.minAmountOut}</span>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Contract Call</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-pink-400 border-pink-500/30">
                  {transaction.contractName}
                </Badge>
              </div>
              <code className="text-xs text-zinc-500 block mt-2">
                {transaction.contractAddress}.{transaction.contractName}
              </code>
              <div className="mt-3">
                <span className="text-xs text-zinc-500 block mb-1">Function:</span>
                <code className="text-sm text-pink-400 font-mono">
                  {transaction.functionName}()
                </code>
              </div>
            </div>
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
          {data.tips && data.tips.length > 0 && (
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-pink-400 mt-0.5" />
                <div className="space-y-1">
                  {data.tips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-pink-300">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {data.message && (
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <p className="text-sm text-pink-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 px-6 py-2">
              Swap ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
