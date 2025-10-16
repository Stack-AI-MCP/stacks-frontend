"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Banknote, Info } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

type GraniteRepayTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: Array<{ type: string; value: string }>;
  network: string;
};

type GraniteRepayResponse = {
  success: boolean;
  transaction?: GraniteRepayTransaction;
  details?: {
    asset: string;
    amount: string;
    marketName: string;
  };
  instructions?: string[];
  error?: string;
  message?: string;
};

export interface GraniteRepayProps {
  data: GraniteRepayResponse;
  isLoading: boolean;
}

export default function GraniteRepay({ data, isLoading }: GraniteRepayProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
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
          <CardTitle className="text-destructive">Repay Failed</CardTitle>
          <CardDescription>{data.error || "Unable to prepare repayment"}</CardDescription>
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

  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper transactionData={transactionData} network={transaction.network === "mainnet" ? "mainnet" : "testnet"} buttonText="Sign & Repay Loan" buttonGradient="from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700">
      <Card className="w-full bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20">
        <CardHeader><div className="flex items-center gap-2"><Banknote className="w-6 h-6 text-slate-400" /><CardTitle className="text-xl">Granite Repay</CardTitle></div><CardDescription className="text-zinc-300">Repay {details.amount} {details.asset} to {details.marketName}</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-6 text-center"><span className="text-sm text-zinc-400 block mb-2">Repayment Amount</span><p className="text-4xl font-bold text-slate-400">{details.amount}</p><p className="text-xs text-zinc-500 mt-2">{details.asset}</p></div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20"><div className="space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-zinc-400">Market:</span><Badge variant="outline" className="text-slate-400 border-slate-500/30">{details.marketName}</Badge></div></div></div>
          <div className="flex justify-center"><Badge variant="outline" className="text-xs">{transaction.network}</Badge></div>
          {data.instructions && data.instructions.length > 0 && (<Alert className="border-blue-500/50 bg-blue-500/10"><Info className="h-4 w-4 text-blue-400" /><AlertDescription className="text-blue-300 text-sm"><div className="space-y-1 mt-2">{data.instructions.map((instruction, idx) => (<p key={idx}>{instruction}</p>))}</div></AlertDescription></Alert>)}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"><div className="space-y-1"><p className="text-xs text-blue-300">💡 Repaying reduces your debt and improves your health factor</p><p className="text-xs text-blue-300">💡 Partial repayments are allowed</p></div></div>
          {data.message && (<div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-3"><p className="text-sm text-slate-300">{data.message}</p></div>)}
          <div className="flex justify-center"><Badge variant="secondary" className="bg-slate-500/20 text-slate-400 px-6 py-2">Repayment ready for signing</Badge></div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
