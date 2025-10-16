"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "@/lib/utils/format";
import { ArrowRightLeft, Droplets, Percent } from "lucide-react";

// Arkadiko Swap Pair Details type based on MCP server response
type ArkadikoSwapPairDetail = {
  tokenX: string;
  tokenY: string;
  name: string;
  status: "active" | "inactive";
  reserve_x?: string;
  reserve_y?: string;
  total_supply?: string;
  fee_rate?: string;
  lp_token?: string;
  balance_x?: string;
  balance_y?: string;
  shares_total?: string;
  error?: string;
};

type ArkadikoSwapPairDetailsResponse = {
  success: boolean;
  data: ArkadikoSwapPairDetail;
  error?: string;
  message?: string;
};

export interface ArkadikoSwapPairDetailsProps {
  data: ArkadikoSwapPairDetailsResponse;
  isLoading: boolean;
}

export default function ArkadikoSwapPairDetails({ data, isLoading }: ArkadikoSwapPairDetailsProps) {
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

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Swap Pair Details</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko swap pair details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pair = data.data;
  const [token0, token1] = pair.name.split('/');

  const reserveX = pair.reserve_x ? parseFloat(pair.reserve_x) / 1e8 : 0;
  const reserveY = pair.reserve_y ? parseFloat(pair.reserve_y) / 1e8 : 0;
  const totalSupply = pair.total_supply ? parseFloat(pair.total_supply) / 1e8 : 0;
  const feeRate = pair.fee_rate ? parseFloat(pair.fee_rate) / 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg">Arkadiko Swap Pair Details</CardTitle>
          </div>
          <Badge
            variant={pair.status === "active" ? "default" : "secondary"}
            className={pair.status === "active" ? "bg-green-500/20 text-green-400" : ""}
          >
            {pair.status}
          </Badge>
        </div>
        <CardDescription>
          Detailed liquidity and reserve information for {pair.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Token Pair Display */}
        <div className="flex items-center gap-2 justify-center">
          <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
            {token0}
          </Badge>
          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
          <Badge className="bg-blue-500/20 text-blue-400 text-lg px-4 py-2">
            {token1}
          </Badge>
        </div>

        {/* Reserves */}
        {pair.status === "active" && (reserveX > 0 || reserveY > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Reserve {token0}</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatVolume(reserveX)}
              </p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Reserve {token1}</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {formatVolume(reserveY)}
              </p>
            </div>
          </div>
        )}

        {/* Pool Stats */}
        {pair.status === "active" && (
          <div className="pt-4 border-t border-zinc-700 space-y-3">
            {totalSupply > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total LP Supply:</span>
                <span className="text-white font-semibold">{formatVolume(totalSupply)}</span>
              </div>
            )}
            {feeRate > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-1">
                  <Percent className="w-3 h-3" /> Fee Rate:
                </span>
                <span className="text-white font-semibold">{feeRate}%</span>
              </div>
            )}
            {pair.lp_token && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">LP Token:</span>
                <code className="text-xs text-zinc-300 font-mono">{pair.lp_token}</code>
              </div>
            )}
          </div>
        )}

        {/* Token Contracts */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Token X Contract:</span>
            <code className="text-xs text-zinc-300 font-mono break-all">{pair.tokenX}</code>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Token Y Contract:</span>
            <code className="text-xs text-zinc-300 font-mono break-all">{pair.tokenY}</code>
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
