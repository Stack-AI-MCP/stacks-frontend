"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Info, Shield } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Contract Call Transaction Response
type ClarityValue = {
  type: string;
  value: any;
};

type PostCondition = {
  type: string;
  address: string;
  amount?: string;
  assetInfo?: {
    contractAddress: string;
    contractName: string;
    assetName: string;
  };
};

type ContractCallTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: PostCondition[];
  network: string;
  sponsored?: boolean;
  fee?: string;
  comment?: string;
  explorerUrlTemplate?: string;
};

type ContractCallResponse = {
  success: boolean;
  transaction?: ContractCallTransaction;
  instructions?: string[];
  error?: string;
  message?: string;
};

export interface ContractCallProps {
  data: ContractCallResponse;
  isLoading: boolean;
}

export default function ContractCall({ data, isLoading }: ContractCallProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Transaction Failed</CardTitle>
          <CardDescription>{data.error || "Unable to prepare contract call"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction;

  if (!transaction) {
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
      buttonText="Sign & Execute Contract Call"
      buttonGradient="from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
    >
      <Card className="w-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-400" />
            <CardTitle className="text-xl">Contract Call</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            {transaction.contractName}.{transaction.functionName}()
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contract Details */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-indigo-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Contract</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
                  {transaction.contractName}
                </Badge>
              </div>
              <code className="text-xs text-zinc-500 block mt-2">
                {transaction.contractAddress}.{transaction.contractName}
              </code>
            </div>
          </div>

          {/* Function Name */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
            <span className="text-sm text-zinc-400 block mb-2">Function</span>
            <p className="text-3xl font-bold text-indigo-400 font-mono">
              {transaction.functionName}()
            </p>
          </div>

          {/* Function Arguments */}
          {transaction.functionArgs && transaction.functionArgs.length > 0 && (
            <div className="space-y-3">
              <span className="text-sm text-zinc-400 block">Arguments ({transaction.functionArgs.length})</span>
              <div className="space-y-2">
                {transaction.functionArgs.map((arg, idx) => (
                  <div key={idx} className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">Arg {idx}</Badge>
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30">
                        {arg.type}
                      </Badge>
                    </div>
                    <code className="text-sm text-white font-mono break-all block">
                      {typeof arg.value === 'object' ? JSON.stringify(arg.value, null, 2) : String(arg.value)}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caller Address */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Caller Address</span>
            <code className="text-xs text-white font-mono break-all">
              {transaction.from}
            </code>
          </div>

          {/* Network & Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">Network</span>
              <Badge variant="outline" className="text-xs">
                {transaction.network}
              </Badge>
            </div>
            {transaction.fee && (
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                <span className="text-sm text-zinc-400 mb-2 block">Fee</span>
                <span className="text-sm text-white font-mono">{transaction.fee} µSTX</span>
              </div>
            )}
          </div>

          {/* Sponsored Transaction */}
          {transaction.sponsored && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-300">
                ✓ This is a sponsored transaction - fees paid by sponsor
              </p>
            </div>
          )}

          {/* Post Conditions */}
          {transaction.postConditions && transaction.postConditions.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300 font-semibold">Post-Conditions ({transaction.postConditions.length})</span>
              </div>
              <div className="space-y-2">
                {transaction.postConditions.map((pc, idx) => (
                  <div key={idx} className="text-xs text-green-300">
                    ✓ {pc.type} - {pc.address.substring(0, 10)}...
                    {pc.amount && ` (${pc.amount})`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {data.instructions && data.instructions.length > 0 && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-sm">
                <div className="space-y-1 mt-2">
                  {data.instructions.map((instruction, idx) => (
                    <p key={idx}>{instruction}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Comment */}
          {transaction.comment && (
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-slate-500/20">
              <p className="text-sm text-zinc-300 italic">{transaction.comment}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Post-conditions protect your assets during contract calls
              </p>
              <p className="text-xs text-blue-300">
                💡 Transaction fees will be estimated if not specified
              </p>
              <p className="text-xs text-blue-300">
                💡 Function arguments must match the contract's interface
              </p>
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <p className="text-sm text-indigo-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 px-6 py-2">
              Transaction ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
