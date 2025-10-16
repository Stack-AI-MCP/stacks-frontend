"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Hash } from "lucide-react";

// Pool Delegation Item
type Delegation = {
  stacker: string;
  amount_ustx: string;
  pox_addr: string;
  block_height: number;
  tx_id: string;
};

// Pool Delegations Response
type PoolDelegationsData = {
  limit: number;
  offset: number;
  total: number;
  results: Delegation[];
};

type PoolDelegationsResponse = {
  success: boolean;
  data?: PoolDelegationsData;
  error?: string;
  message?: string;
};

export interface PoolDelegationsProps {
  data: PoolDelegationsResponse;
  isLoading: boolean;
}

export default function PoolDelegations({ data, isLoading }: PoolDelegationsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Query Failed</CardTitle>
          <CardDescription>{data.error || "Unable to get pool delegations"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { results, total, limit, offset } = data.data;

  const formatSTX = (ustx: string): string => {
    const stx = parseInt(ustx) / 1_000_000;
    return stx.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatAddress = (addr: string): string => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-400" />
          <CardTitle className="text-xl">Pool Delegations</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          STX delegated to stacking pool
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400">{results.length}</div>
            <div className="text-xs text-zinc-400 mt-1">Shown</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400">{total}</div>
            <div className="text-xs text-zinc-400 mt-1">Total</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400">{offset}</div>
            <div className="text-xs text-zinc-400 mt-1">Offset</div>
          </div>
        </div>

        {/* Delegation List */}
        {results && results.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((delegation, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 hover:border-purple-500/30 transition-colors"
              >
                {/* Stacker Address */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-400">Stacker</span>
                  <code className="text-xs text-purple-400 font-mono">
                    {formatAddress(delegation.stacker)}
                  </code>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between mb-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-zinc-400">Amount</span>
                  </div>
                  <span className="text-lg font-bold text-purple-400 font-mono">
                    {formatSTX(delegation.amount_ustx)} STX
                  </span>
                </div>

                {/* PoX Address */}
                <div className="space-y-1 mb-3">
                  <span className="text-xs text-zinc-400">PoX Reward Address</span>
                  <code className="text-xs text-white font-mono block bg-black/30 p-2 rounded break-all">
                    {delegation.pox_addr || "N/A"}
                  </code>
                </div>

                {/* Block Height & TX ID */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-zinc-500" />
                    <span className="text-zinc-400">Block {delegation.block_height.toLocaleString()}</span>
                  </div>
                  <a
                    href={`https://explorer.stacks.co/txid/${delegation.tx_id}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    View TX →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 p-8 rounded-lg border border-slate-500/20 text-center">
            <p className="text-zinc-400">No delegations found for this pool</p>
          </div>
        )}

        {/* Pagination Info */}
        {total > limit && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300 text-center">
              Showing {offset + 1} - {Math.min(offset + limit, total)} of {total} total delegations
            </p>
          </div>
        )}

        {/* Success Message */}
        {data.message && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-sm text-purple-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
