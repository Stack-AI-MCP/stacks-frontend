"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { formatVolume, safeToFixed } from "@/lib/utils/format";

// ALEX Pool Stats exact type based on API response from https://api.alexgo.io/v1/pool_stats/{id}
type AlexPoolStatusItem = {
  pool_token: number;
  block_height: number;
  token_x: string;
  token_y: string;
  volume_x_24h: number;
  volume_y_24h: number;
  volume_24h: number;
  volume_x_7d: number;
  volume_y_7d: number;
  volume_7d: number;
  fee_rebate_x_24h: number;
  fee_rebate_y_24h: number;
  fee_rebate_24h: number;
  fee_rebate_x_7d: number;
  fee_rebate_y_7d: number;
  fee_rebate_7d: number;
  est_pool_token_price: number;
  liquidity: number;
  total_supply: number;
  apr_7d: number;
  burn_block_time: number;
  sync_at: string;
};

type AlexPoolStatsResponse = {
  success: boolean;
  data: {
    token: number;
    pool_status: AlexPoolStatusItem[];
  };
  error?: string;
};

export interface AlexPoolStatsProps {
  data: AlexPoolStatsResponse;
  isLoading: boolean;
}

export default function AlexPoolStats({ data, isLoading }: AlexPoolStatsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.pool_status) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Pool Stats</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve pool statistics"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { token: poolId, pool_status } = data.data;
  // Get the most recent status (first item)
  const latestStats = pool_status[0];

  if (!latestStats) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">No Stats Available</CardTitle>
          <CardDescription>Pool {poolId} has no available statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Extract token names
  const extractTokenName = (contractAddress: string): string => {
    const parts = contractAddress.split('.');
    if (parts.length < 2) return contractAddress;
    return parts[1].replace('token-', '').replace('w', '').toUpperCase();
  };

  const tokenX = extractTokenName(latestStats.token_x);
  const tokenY = extractTokenName(latestStats.token_y);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-lg">ALEX Pool Statistics</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
            Pool #{poolId}
          </Badge>
        </div>
        <CardDescription>
          Historical statistics for {tokenX}/{tokenY} pool
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Token Pair */}
        <div className="flex items-center gap-2 justify-center">
          <Badge className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1">
            {tokenX}
          </Badge>
          <span className="text-zinc-500">/</span>
          <Badge className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1">
            {tokenY}
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liquidity */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">Liquidity</span>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {latestStats.liquidity > 0 ? formatVolume(latestStats.liquidity) : "$0"}
            </p>
          </div>

          {/* 24h Volume */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">24h Volume</span>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {latestStats.volume_24h > 0 ? formatVolume(latestStats.volume_24h) : "$0"}
            </p>
          </div>

          {/* 7d Volume */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">7d Volume</span>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {latestStats.volume_7d > 0 ? formatVolume(latestStats.volume_7d) : "$0"}
            </p>
          </div>

          {/* 7d APR */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">7d APR</span>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {latestStats.apr_7d > 0 ? `${safeToFixed(latestStats.apr_7d, 2)}%` : "0%"}
            </p>
          </div>
        </div>

        {/* Fee Rebates */}
        <div className="pt-4 border-t border-zinc-700">
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Fee Rebates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-xs text-zinc-500">24h Rebates</span>
              <p className="text-lg font-semibold text-sky-400 mt-1">
                {latestStats.fee_rebate_24h > 0 ? formatVolume(latestStats.fee_rebate_24h) : "$0"}
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-xs text-zinc-500">7d Rebates</span>
              <p className="text-lg font-semibold text-sky-400 mt-1">
                {latestStats.fee_rebate_7d > 0 ? formatVolume(latestStats.fee_rebate_7d) : "$0"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Total Supply:</span>
            <span className="text-white font-semibold">{latestStats.total_supply.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Pool Token Price:</span>
            <span className="text-white font-semibold">
              ${latestStats.est_pool_token_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Block Height:</span>
            <code className="text-xs text-white font-mono">{latestStats.block_height}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Last Updated:</span>
            <span className="text-xs text-zinc-400">{new Date(latestStats.sync_at).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
