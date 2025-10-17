"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

type GraniteStakeTransaction = {
  type: "contract_call";
  from: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: Array<{ type: string; value: string }>;
  network: string;
};

type GraniteStakeResponse = {
  success: boolean;
  transaction?: GraniteStakeTransaction;
  details?: {
    asset: string;
    amount: string;
    stakingAPY?: string;
  };
  error?: string;
  message?: string;
};

export interface GraniteStakeProps {
  data: GraniteStakeResponse;
  isLoading: boolean;
}

export default function GraniteStake({ data, isLoading }: GraniteStakeProps) {
  if (isLoading) return <Card className="w-full animate-pulse"><CardHeader><div className="h-6 bg-gray-200 rounded w-1/4"></div></CardHeader><CardContent><div className="h-32 bg-gray-200 rounded"></div></CardContent></Card>;
  if (!data.success) return <Card className="w-full border-destructive"><CardHeader><CardTitle className="text-destructive">Stake Failed</CardTitle><CardDescription>{data.error}</CardDescription></CardHeader></Card>;
  const transaction = data.transaction;
  if (!transaction) return <Card className="w-full border-destructive"><CardHeader><CardTitle className="text-destructive">Invalid Response</CardTitle></CardHeader></Card>;

  // Extract details from transaction data
  const amount = transaction.functionArgs[0]?.value || "0";
  const asset = "LP Tokens"; // Granite staking uses LP tokens
  const displayAmount = (parseInt(amount) / 1000000).toFixed(6);

  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper transactionData={transactionData} network={transaction.network === "mainnet" ? "mainnet" : "testnet"} buttonText="Sign & Stake" buttonGradient="from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700">
      <Card className="w-full bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20">
        <CardHeader><div className="flex items-center gap-2"><Award className="w-6 h-6 text-slate-400" /><CardTitle className="text-xl">Granite Stake</CardTitle></div><CardDescription className="text-zinc-300">Stake {displayAmount} {asset}</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-6 text-center"><span className="text-sm text-zinc-400 block mb-2">Stake Amount</span><p className="text-4xl font-bold text-slate-400">{displayAmount}</p><p className="text-xs text-zinc-500 mt-2">{asset}</p></div>
          <div className="flex justify-center"><Badge variant="outline" className="text-xs">{transaction.network}</Badge></div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"><p className="text-xs text-blue-300">💡 Earn rewards by staking your assets</p></div>
          {data.message && <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-3"><p className="text-sm text-slate-300">{data.message}</p></div>}
          <div className="flex justify-center"><Badge variant="secondary" className="bg-slate-500/20 text-slate-400 px-6 py-2">Stake ready for signing</Badge></div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
