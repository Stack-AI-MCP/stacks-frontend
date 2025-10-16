"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

type GraniteAddCollateralTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: Array<{ type: string; value: string }>;
  network: string;
};

type GraniteAddCollateralResponse = {
  success: boolean;
  transaction?: GraniteAddCollateralTransaction;
  details?: {
    asset: string;
    amount: string;
    marketName: string;
  };
  error?: string;
  message?: string;
};

export interface GraniteAddCollateralProps {
  data: GraniteAddCollateralResponse;
  isLoading: boolean;
}

export default function GraniteAddCollateral({ data, isLoading }: GraniteAddCollateralProps) {
  if (isLoading) return <Card className="w-full animate-pulse"><CardHeader><div className="h-6 bg-gray-200 rounded w-1/4"></div></CardHeader><CardContent><div className="h-32 bg-gray-200 rounded"></div></CardContent></Card>;
  if (!data.success) return <Card className="w-full border-destructive"><CardHeader><CardTitle className="text-destructive">Add Collateral Failed</CardTitle><CardDescription>{data.error}</CardDescription></CardHeader></Card>;
  const transaction = data.transaction;
  const details = data.details;
  if (!transaction || !details) return <Card className="w-full border-destructive"><CardHeader><CardTitle className="text-destructive">Invalid Response</CardTitle></CardHeader></Card>;

  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper transactionData={transactionData} network={transaction.network === "mainnet" ? "mainnet" : "testnet"} buttonText="Sign & Add Collateral" buttonGradient="from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700">
      <Card className="w-full bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20">
        <CardHeader><div className="flex items-center gap-2"><PlusCircle className="w-6 h-6 text-slate-400" /><CardTitle className="text-xl">Add Collateral</CardTitle></div><CardDescription className="text-zinc-300">Add {details.amount} {details.asset} to {details.marketName}</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-6 text-center"><span className="text-sm text-zinc-400 block mb-2">Additional Collateral</span><p className="text-4xl font-bold text-slate-400">{details.amount}</p><p className="text-xs text-zinc-500 mt-2">{details.asset}</p></div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20"><div className="flex items-center justify-between text-sm"><span className="text-zinc-400">Market:</span><Badge variant="outline" className="text-slate-400 border-slate-500/30">{details.marketName}</Badge></div></div>
          <div className="flex justify-center"><Badge variant="outline" className="text-xs">{transaction.network}</Badge></div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"><p className="text-xs text-blue-300">💡 Adding collateral improves your health factor and reduces liquidation risk</p></div>
          {data.message && <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-3"><p className="text-sm text-slate-300">{data.message}</p></div>}
          <div className="flex justify-center"><Badge variant="secondary" className="bg-slate-500/20 text-slate-400 px-6 py-2">Ready for signing</Badge></div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
