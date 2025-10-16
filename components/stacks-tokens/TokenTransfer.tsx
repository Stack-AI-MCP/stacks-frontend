"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, Info, Shield } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Token Transfer Transaction Response
type TokenTransferTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: Array<{
    type: string;
    value: string | { type: string; value: string };
  }>;
  postConditions: Array<{
    type: string;
    address: string;
    assetInfo: {
      contractAddress: string;
      contractName: string;
      assetName: string;
    };
    amount: string;
    condition: string;
  }>;
  network: string;
  comment?: string;
};

type TokenTransferDetails = {
  token: string;
  amount: string;
  from: string;
  to: string;
  memo: string;
};

type TokenTransferResponse = {
  success: boolean;
  transaction?: TokenTransferTransaction;
  details?: TokenTransferDetails;
  instructions?: string[];
  error?: string;
  message?: string;
};

export interface TokenTransferProps {
  data: TokenTransferResponse;
  isLoading: boolean;
}

export default function TokenTransfer({ data, isLoading }: TokenTransferProps) {
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
          <CardDescription>{data.error || "Unable to prepare token transfer"}</CardDescription>
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

  // Extract amount from function args
  const amountArg = transaction.functionArgs?.find(arg => arg.type === "uint");
  const amountValue = amountArg?.value || details.amount;
  const amount = typeof amountValue === 'string' ? amountValue : details.amount;

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
      buttonText="Sign & Transfer Tokens"
      buttonGradient="from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
    >
      <Card className="w-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-emerald-400" />
            <CardTitle className="text-xl">Transfer SIP-010 Token</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Transfer {transaction.contractName} tokens
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Token Details */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-emerald-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Token Contract</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                  {transaction.contractName}
                </Badge>
              </div>
              <code className="text-xs text-zinc-500 block mt-2">
                {details.token}
              </code>
            </div>
          </div>

          {/* Transfer Amount */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
            <span className="text-sm text-zinc-400 block mb-2">Amount</span>
            <p className="text-4xl font-bold text-emerald-400">
              {amount}
            </p>
            <p className="text-xs text-zinc-500 mt-2">Base units (check token decimals)</p>
          </div>

          {/* Transfer Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">From (Sender)</span>
              <code className="text-xs text-white font-mono break-all">
                {details.from}
              </code>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">To (Recipient)</span>
              <code className="text-xs text-white font-mono break-all">
                {details.to}
              </code>
            </div>
          </div>

          {/* Memo */}
          {details.memo && details.memo !== "none" && (
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">Memo</span>
              <p className="text-sm text-white">{details.memo}</p>
            </div>
          )}

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Post Conditions */}
          {transaction.postConditions && transaction.postConditions.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300 font-semibold">Post-Condition Protection</span>
              </div>
              <div className="space-y-2">
                {transaction.postConditions.map((pc, idx) => (
                  <div key={idx} className="text-xs text-green-300">
                    ✓ Ensures {pc.amount} {pc.assetInfo.assetName} is {pc.condition.replace(/-/g, ' ')}
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

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Amount is in base units - apply token decimals for actual value
              </p>
              <p className="text-xs text-blue-300">
                💡 Post-conditions protect you from sending wrong amounts
              </p>
              <p className="text-xs text-blue-300">
                💡 SIP-010 is the standard for fungible tokens on Stacks
              </p>
              <p className="text-xs text-blue-300">
                💡 Transaction fees will be calculated by your wallet
              </p>
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-sm text-emerald-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 px-6 py-2">
              Transaction ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
