"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Info, AlertCircle } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// SendSTX Transaction Response
type SendSTXTransactionData = {
  transaction: {
    type: "stx_transfer";
    from: string;
    recipient: string;
    amount: string;
    amountSTX: string;
    memo?: string;
    network: string;
    comment?: string;
  };
  message?: string;
};

type SendSTXTransactionResponse = {
  success: boolean;
  transaction?: SendSTXTransactionData["transaction"];
  data?: SendSTXTransactionData;
  error?: string;
  message?: string;
};

export interface SendSTXTransactionProps {
  data: SendSTXTransactionResponse;
  isLoading: boolean;
}

export default function SendSTXTransaction({ data, isLoading }: SendSTXTransactionProps) {
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
          <CardDescription>{data.error || "Unable to prepare STX transfer"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction || data.data?.transaction;
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
    type: "stx_transfer",
    recipient: transaction.recipient,
    amount: transaction.amount,
    memo: transaction.memo,
  };

  return (
    <TransactionWrapper
      transactionData={transactionData}
      network={transaction.network === "mainnet" ? "mainnet" : "testnet"}
      buttonText="Sign & Send STX"
      buttonGradient="from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
    >
      <Card className="w-full bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="w-6 h-6 text-orange-400" />
            <CardTitle className="text-xl">Send STX Transaction</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Ready to send {transaction.amountSTX}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Amount */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-orange-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Amount</span>
            <p className="text-5xl font-bold text-orange-400">
              {transaction.amountSTX}
            </p>
            <span className="text-xs text-zinc-500 mt-2 block">
              {parseInt(transaction.amount).toLocaleString()} micro-STX
            </span>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">From</span>
              <code className="text-xs text-white font-mono break-all">
                {transaction.from}
              </code>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">To</span>
              <code className="text-xs text-white font-mono break-all">
                {transaction.recipient}
              </code>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Memo if present */}
          {transaction.memo && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400 block mb-2">Memo</span>
              <p className="text-sm text-white">{transaction.memo}</p>
            </div>
          )}

          {/* Instructions */}
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <Info className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300 text-sm">
              This transaction is ready to be signed. Please confirm the details above before proceeding.
            </AlertDescription>
          </Alert>

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Transaction fees will be calculated by your wallet
              </p>
              <p className="text-xs text-blue-300">
                💡 Double-check the recipient address before confirming
              </p>
              {transaction.memo && (
                <p className="text-xs text-blue-300">
                  💡 Memo is limited to 34 bytes and will be publicly visible
                </p>
              )}
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-sm text-orange-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 px-6 py-2">
              Transaction ready for signing
            </Badge>
          </div>

          {/* Warnings */}
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300 text-xs">
              Always verify you are sending to the correct address. STX transactions are irreversible.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
