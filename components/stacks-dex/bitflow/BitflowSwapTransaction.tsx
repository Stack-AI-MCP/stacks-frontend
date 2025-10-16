"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, AlertTriangle, Info, DollarSign, Route, TrendingDown } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// BitFlow Swap Transaction type
type BitflowSwapTransaction = {
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

type BitflowSwapTransactionResponse = {
  success: boolean;
  transaction?: BitflowSwapTransaction;
  details?: {
    dex: string;
    inputToken: string;
    outputToken: string;
    amountIn: string;
    estimatedOutput?: string;
    slippage?: string;
    route?: string;
    priceImpact?: string;
  };
  instructions?: string[];
  tips?: string[];
  warnings?: string[];
  error?: string;
  message?: string;
};

export interface BitflowSwapTransactionProps {
  data: BitflowSwapTransactionResponse;
  isLoading: boolean;
}

export default function BitflowSwapTransaction({ data, isLoading }: BitflowSwapTransactionProps) {
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
          <CardDescription>{data.error || "Unable to build BitFlow swap transaction"}</CardDescription>
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
      buttonText="Sign & Swap on BitFlow"
      buttonGradient="from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
    >
      <Card className="w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
            <CardTitle className="text-xl">BitFlow Stable Swap</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Swap {details.inputToken} → {details.outputToken} on {details.dex}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Swap Preview */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 text-lg px-4 py-1">
                {details.inputToken}
              </Badge>
              <ArrowRightLeft className="w-6 h-6 text-purple-400" />
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
                <span className="text-white font-mono text-lg">{details.amountIn}</span>
              </div>
              {details.estimatedOutput && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Estimated Output:</span>
                  <span className="text-green-400 font-mono text-lg">{details.estimatedOutput}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {(details.slippage || details.priceImpact) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.slippage && (
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-zinc-400">Slippage Tolerance</span>
                  </div>
                  <p className="text-lg font-bold text-sky-400">{details.slippage}</p>
                </div>
              )}
              {details.priceImpact && (
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-zinc-400">Price Impact</span>
                  </div>
                  <p className="text-lg font-bold text-blue-400">{details.priceImpact}</p>
                </div>
              )}
            </div>
          )}

          {/* Route */}
          {details.route && (
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Route className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Swap Route</span>
              </div>
              <p className="text-sm text-white font-mono">{details.route}</p>
            </div>
          )}

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Warnings */}
          {data.warnings && data.warnings.length > 0 && (
            <Alert className="border-sky-500/50 bg-sky-500/10">
              <AlertTriangle className="h-4 w-4 text-sky-400" />
              <AlertDescription className="text-sky-300">
                <div className="space-y-1">
                  {data.warnings.map((warning, idx) => (
                    <p key={idx} className="text-sm">{warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

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
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <div className="space-y-1">
                {data.tips.map((tip, idx) => (
                  <p key={idx} className="text-xs text-indigo-300">{tip}</p>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {data.message && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <p className="text-sm text-indigo-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 px-6 py-2">
              Swap ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
