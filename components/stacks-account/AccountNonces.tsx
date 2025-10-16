"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, AlertCircle, CheckCircle2, Clock } from "lucide-react";

// Account Nonces Response
type AccountNoncesData = {
  address: string;
  network: string;
  last_executed_tx_nonce: number;
  last_mempool_tx_nonce: number;
  possible_next_nonce: number;
  detected_missing_nonces: number[];
};

type AccountNoncesResponse = {
  success: boolean;
  data?: AccountNoncesData;
  error?: string;
  message?: string;
};

export interface AccountNoncesProps {
  data: AccountNoncesResponse;
  isLoading: boolean;
}

export default function AccountNonces({ data, isLoading }: AccountNoncesProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Nonces</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve account nonces"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const nonces = data.data;
  const hasMissingNonces = nonces.detected_missing_nonces && nonces.detected_missing_nonces.length > 0;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-xl">Account Nonces</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Transaction nonce information for {nonces.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Network Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {nonces.network}
          </Badge>
        </div>

        {/* Nonce Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-zinc-400">Last Executed</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {nonces.last_executed_tx_nonce}
            </p>
            <span className="text-xs text-zinc-500 mt-1 block">
              Last confirmed transaction
            </span>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-sky-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-sm text-zinc-400">In Mempool</span>
            </div>
            <p className="text-3xl font-bold text-sky-400">
              {nonces.last_mempool_tx_nonce}
            </p>
            <span className="text-xs text-zinc-500 mt-1 block">
              Pending in mempool
            </span>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-zinc-400">Next Nonce</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {nonces.possible_next_nonce}
            </p>
            <span className="text-xs text-zinc-500 mt-1 block">
              Use for next transaction
            </span>
          </div>
        </div>

        {/* Missing Nonces Warning */}
        {hasMissingNonces && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Missing Nonces Detected</span>
            </div>
            <p className="text-sm text-red-200 mb-2">
              The following nonces are missing from the transaction history:
            </p>
            <div className="flex flex-wrap gap-2">
              {nonces.detected_missing_nonces.map((nonce) => (
                <Badge key={nonce} variant="destructive" className="bg-red-500/20 text-red-400">
                  #{nonce}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-red-300 mt-3">
              This may indicate pending or failed transactions. Check transaction status carefully.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Nonces prevent transaction replay attacks on the blockchain
            </p>
            <p className="text-xs text-blue-300">
              💡 Always use the "Next Nonce" value for new transactions
            </p>
            <p className="text-xs text-blue-300">
              💡 Missing nonces indicate gaps in transaction sequence
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
