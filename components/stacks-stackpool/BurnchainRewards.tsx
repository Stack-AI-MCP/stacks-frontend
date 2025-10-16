"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Bitcoin, TrendingUp, Hash } from "lucide-react";

// Burnchain Reward Item
type BurnchainReward = {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  burn_amount: string;
  reward_recipient: string;
  reward_amount: string;
  reward_index: number;
};

// Burnchain Rewards Response
type BurnchainRewardsData = {
  limit: number;
  offset: number;
  results: BurnchainReward[];
};

type BurnchainRewardsResponse = {
  success: boolean;
  data?: BurnchainRewardsData;
  error?: string;
  message?: string;
};

export interface BurnchainRewardsProps {
  data: BurnchainRewardsResponse;
  isLoading: boolean;
}

export default function BurnchainRewards({ data, isLoading }: BurnchainRewardsProps) {
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
          <CardDescription>{data.error || "Unable to get burnchain rewards"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { results, limit, offset } = data.data;

  const formatBTC = (satoshis: string): string => {
    const btc = parseInt(satoshis) / 100_000_000;
    return btc.toFixed(8);
  };

  const formatAddress = (addr: string): string => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
  };

  const formatHash = (hash: string): string => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  const totalRewards = results.reduce((sum, reward) => sum + parseInt(reward.reward_amount), 0);

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500/10 to-sky-500/10 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-xl">Burnchain Rewards</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Bitcoin rewards distributed to stackers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400">{results.length}</div>
            <div className="text-xs text-zinc-400 mt-1">Rewards</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-blue-500/20 text-center">
            <div className="text-lg font-bold text-blue-400">{formatBTC(totalRewards.toString())}</div>
            <div className="text-xs text-zinc-400 mt-1">Total BTC</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400">{offset}</div>
            <div className="text-xs text-zinc-400 mt-1">Offset</div>
          </div>
        </div>

        {/* Rewards List */}
        {results && results.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((reward, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 hover:border-blue-500/30 transition-colors"
              >
                {/* Header with Index and Canonical Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                      Reward #{reward.reward_index}
                    </Badge>
                    {reward.canonical && (
                      <Badge variant="outline" className="text-green-400 border-green-500/30 text-xs">
                        Canonical
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Reward Amount */}
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-zinc-400">Reward Amount</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bitcoin className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-blue-400 font-mono">
                        {formatBTC(reward.reward_amount)}
                      </span>
                      <span className="text-xs text-zinc-400">BTC</span>
                    </div>
                  </div>
                </div>

                {/* Recipient Address */}
                <div className="space-y-1 mb-3">
                  <span className="text-xs text-zinc-400">Recipient Address</span>
                  <code className="text-sm text-white font-mono block bg-black/30 p-2 rounded break-all">
                    {reward.reward_recipient}
                  </code>
                </div>

                {/* Burn Block Info */}
                <div className="space-y-2 p-3 bg-zinc-900/50 rounded-lg border border-slate-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">Burn Block Height</span>
                    </div>
                    <span className="text-white font-mono">
                      {reward.burn_block_height.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Burn Amount</span>
                    <span className="text-white font-mono">
                      {formatBTC(reward.burn_amount)} BTC
                    </span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-xs text-zinc-400">Burn Block Hash</span>
                    <code className="text-xs text-zinc-300 font-mono block bg-black/30 p-1 rounded break-all">
                      {formatHash(reward.burn_block_hash)}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 p-8 rounded-lg border border-slate-500/20 text-center">
            <p className="text-zinc-400">No burnchain rewards found</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Burnchain rewards are BTC paid to stackers on the Bitcoin blockchain
            </p>
            <p className="text-xs text-blue-300">
              💡 Burn amount represents Bitcoin sent to miners
            </p>
            <p className="text-xs text-blue-300">
              💡 Canonical rewards are confirmed on the Bitcoin chain
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-sm text-blue-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
