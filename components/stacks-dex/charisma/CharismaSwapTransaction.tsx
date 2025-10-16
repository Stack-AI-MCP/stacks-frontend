"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, Info, Layers, Route } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Charisma Swap Transaction type
type CharismaSwapTransaction = {
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

type CharismaSwapTransactionResponse = {
  success: boolean;
  transaction?: CharismaSwapTransaction;
  details?: {
    dex: string;
    inputToken: string;
    outputToken: string;
    amountIn: string;
    minAmountOut: string;
    hops?: number;
    routing?: string;
  };
  instructions?: string[];
  tips?: string[];
  error?: string;
  message?: string;
};

export interface CharismaSwapTransactionProps {
  data: CharismaSwapTransactionResponse;
  isLoading: boolean;
}

export default function CharismaSwapTransaction({ data, isLoading }: CharismaSwapTransactionProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Swap Transaction Failed</CardTitle>
          <CardDescription>{data.error || "Unable to build Charisma swap transaction"}</CardDescription>
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

  const isMultiHop = details.routing === "multi-hop";

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
      buttonText="Sign & Swap on Charisma"
      buttonGradient="from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
    >
      <Card className="w-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-violet-400" />
            <CardTitle className="text-xl">Charisma DEX Swap</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Swap {details.inputToken.split('.').pop()} → {details.outputToken.split('.').pop()} on {details.dex}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Swap Preview */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Badge variant="outline" className="text-violet-400 border-violet-500/30 text-lg px-4 py-1">
                {details.inputToken.split('.').pop()}
              </Badge>
              <ArrowRightLeft className="w-6 h-6 text-fuchsia-400" />
              <Badge variant="outline" className="text-fuchsia-400 border-fuchsia-500/30 text-lg px-4 py-1">
                {details.outputToken.split('.').pop()}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{details.dex}</p>
          </div>

          {/* Swap Details */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Amount In:</span>
                <span className="text-white font-mono text-lg">{details.amountIn}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Minimum Output:</span>
                <span className="text-green-400 font-mono text-lg">{details.minAmountOut}</span>
              </div>
            </div>
          </div>

          {/* Routing Details */}
          {(details.routing || details.hops !== undefined) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.routing && (
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-zinc-400">Routing Type</span>
                  </div>
                  <Badge variant="secondary" className={isMultiHop ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/20 text-blue-400"}>
                    {details.routing}
                  </Badge>
                </div>
              )}
              {details.hops !== undefined && (
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-sm text-zinc-400">Vault Hops</span>
                  </div>
                  <p className="text-lg font-bold text-fuchsia-400">{details.hops}</p>
                </div>
              )}
            </div>
          )}

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Instructions */}
          {data.instructions && data.instructions.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">Instructions</span>
              </div>
              <ol className="space-y-2 text-sm text-blue-200 list-decimal list-inside">
                {data.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {data.tips && data.tips.length > 0 && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <div className="space-y-1">
                {data.tips.map((tip, idx) => (
                  <p key={idx} className="text-xs text-violet-300">{tip}</p>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {data.message && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <p className="text-sm text-violet-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 px-6 py-2">
              Swap ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
