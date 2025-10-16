"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";
import { formatVolume } from "@/lib/utils/format";

// ALEX Total TVL exact type based on API response from https://api.alexgo.io/v1/stats/tvl
type AlexTotalTVLData = {
  type: string; // "Total TVL in ALEX DEX"
  lp_token_supply: number;
  reserve_pool_value: number;
  tvl: number;
  block_height: number;
  updated_at: string;
};

type AlexTotalTVLResponse = {
  success: boolean;
  data: AlexTotalTVLData;
  error?: string;
  message?: string;
};

export interface AlexTotalTVLProps {
  data: AlexTotalTVLResponse;
  isLoading: boolean;
}

export default function AlexTotalTVL({ data, isLoading }: AlexTotalTVLProps) {
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

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Total TVL</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX TVL information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tvlData = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-xl">ALEX Protocol TVL</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Total Value Locked across all ALEX DEX pools
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main TVL Display */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-zinc-400">Total Value Locked</span>
          </div>
          <p className="text-5xl font-bold text-green-400">
            {formatVolume(tvlData.tvl)}
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">LP Token Supply</span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {formatVolume(tvlData.lp_token_supply)}
            </p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">Reserve Pool Value</span>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {formatVolume(tvlData.reserve_pool_value)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Block Height:</span>
            <code className="text-xs text-white font-mono">{tvlData.block_height.toLocaleString()}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Last Updated:</span>
            <span className="text-xs text-zinc-400">
              {new Date(tvlData.updated_at).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Data Type:</span>
            <Badge variant="outline" className="text-xs">{tvlData.type}</Badge>
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
