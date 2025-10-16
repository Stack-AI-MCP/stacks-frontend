"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "@/lib/utils/format";
import { Lock, Gift, TrendingUp } from "lucide-react";

// Arkadiko Stake Info type based on MCP server response
type ArkadikoStakeData = {
  staker: string;
  staked_amount: number;
  rewards_earned: number;
  pending_rewards?: number;
  staking_apy?: number;
  stake_start_block?: number;
  last_claim_block?: number;
  total_staked_protocol?: number;
};

type ArkadikoStakeInfoResponse = {
  success: boolean;
  data: ArkadikoStakeData;
  error?: string;
  message?: string;
};

export interface ArkadikoStakeInfoProps {
  data: ArkadikoStakeInfoResponse;
  isLoading: boolean;
}

export default function ArkadikoStakeInfo({ data, isLoading }: ArkadikoStakeInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load Stake Info</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko staking information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const stake = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <CardTitle className="text-lg">Arkadiko DIKO Staking</CardTitle>
        </div>
        <CardDescription>
          Staking information and rewards for {stake.staker.slice(0, 8)}...{stake.staker.slice(-6)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Staked Amount */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-zinc-400">Staked DIKO</span>
          </div>
          <p className="text-5xl font-bold text-purple-400">
            {formatVolume(stake.staked_amount / 1e8)}
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-sm text-zinc-400">Rewards Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatVolume(stake.rewards_earned / 1e8)}
            </p>
            <span className="text-xs text-zinc-500">DIKO</span>
          </div>

          {stake.pending_rewards !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-400">Pending Rewards</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {formatVolume(stake.pending_rewards / 1e8)}
              </p>
              <span className="text-xs text-zinc-500">DIKO</span>
            </div>
          )}

          {stake.staking_apy !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Staking APY</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {stake.staking_apy.toFixed(2)}%
              </p>
            </div>
          )}

          {stake.total_staked_protocol !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Total Protocol Staked</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {formatVolume(stake.total_staked_protocol / 1e8)}
              </p>
              <span className="text-xs text-zinc-500">DIKO</span>
            </div>
          )}
        </div>

        {/* Staking Details */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          {stake.stake_start_block !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Stake Start Block:</span>
              <code className="text-xs text-white font-mono">{stake.stake_start_block.toLocaleString()}</code>
            </div>
          )}
          {stake.last_claim_block !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Last Claim Block:</span>
              <code className="text-xs text-white font-mono">{stake.last_claim_block.toLocaleString()}</code>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Staker:</span>
            <code className="text-xs text-zinc-300 font-mono">{stake.staker}</code>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
