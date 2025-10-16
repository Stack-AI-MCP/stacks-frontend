"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Bitcoin, Hash } from "lucide-react";

// Burnchain Reward Slot Item
type RewardSlot = {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  address: string;
  slot_index: number;
};

// Burnchain Reward Slots Response
type BurnchainRewardSlotsData = {
  limit: number;
  offset: number;
  total?: number;
  results: RewardSlot[];
};

type BurnchainRewardSlotsResponse = {
  success: boolean;
  data?: BurnchainRewardSlotsData;
  error?: string;
  message?: string;
};

export interface BurnchainRewardSlotsProps {
  data: BurnchainRewardSlotsResponse;
  isLoading: boolean;
}

export default function BurnchainRewardSlots({ data, isLoading }: BurnchainRewardSlotsProps) {
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
          <CardTitle className="text-destructive">Query Failed</CardTitle>
          <CardDescription>{data.error || "Unable to get burnchain reward slots"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { results, total, limit, offset } = data.data;

  const formatAddress = (addr: string): string => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
  };

  const formatHash = (hash: string): string => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-red-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-xl">Burnchain Reward Slots</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Bitcoin addresses eligible for stacking rewards
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-cyan-500/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">{results.length}</div>
            <div className="text-xs text-zinc-400 mt-1">Shown</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-cyan-500/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">{total || results.length}</div>
            <div className="text-xs text-zinc-400 mt-1">Total Slots</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-cyan-500/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">{offset}</div>
            <div className="text-xs text-zinc-400 mt-1">Offset</div>
          </div>
        </div>

        {/* Reward Slot List */}
        {results && results.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((slot, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 hover:border-cyan-500/30 transition-colors"
              >
                {/* Header with Slot Index and Canonical Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                      Slot #{slot.slot_index}
                    </Badge>
                    {slot.canonical && (
                      <Badge variant="outline" className="text-green-400 border-green-500/30 text-xs">
                        Canonical
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bitcoin Address */}
                <div className="space-y-1 mb-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-zinc-400">BTC Reward Address</span>
                  </div>
                  <code className="text-sm text-cyan-400 font-mono block break-all">
                    {slot.address}
                  </code>
                </div>

                {/* Burn Block Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">Burn Block Height</span>
                    </div>
                    <span className="text-white font-mono">
                      {slot.burn_block_height.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400">Burn Block Hash</span>
                    <code className="text-xs text-zinc-300 font-mono block bg-black/30 p-2 rounded break-all">
                      {formatHash(slot.burn_block_hash)}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 p-8 rounded-lg border border-slate-500/20 text-center">
            <p className="text-zinc-400">No reward slots found</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Reward slots represent Bitcoin addresses that will receive stacking rewards
            </p>
            <p className="text-xs text-blue-300">
              💡 Canonical slots are confirmed on the Bitcoin blockchain
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-sm text-cyan-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
