"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { formatVolume } from "@/lib/utils/format";

// Velar Circulating Supply type
type VelarCirculatingSupplyData = {
  circulatingSupply: number;
  totalSupply?: number;
  percentCirculating?: number;
};

type VelarCirculatingSupplyResponse = {
  success: boolean;
  data: VelarCirculatingSupplyData;
  error?: string;
  message?: string;
};

export interface VelarCirculatingSupplyProps {
  data: VelarCirculatingSupplyResponse;
  isLoading: boolean;
}

export default function VelarCirculatingSupply({ data, isLoading }: VelarCirculatingSupplyProps) {
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
          <CardTitle className="text-destructive">Failed to Load Circulating Supply</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve VELAR circulating supply"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { circulatingSupply, totalSupply, percentCirculating } = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-xl">VELAR Circulating Supply</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Current circulation of VELAR governance token
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Circulating Supply */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-blue-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Circulating Supply</span>
          <p className="text-5xl font-bold text-blue-400">
            {formatVolume(circulatingSupply)}
          </p>
          <span className="text-sm text-zinc-500 mt-2 block">VELAR tokens</span>
        </div>

        {/* Additional Supply Info */}
        {(totalSupply || percentCirculating) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {totalSupply && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <span className="text-sm text-zinc-400">Total Supply</span>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatVolume(totalSupply)}
                </p>
              </div>
            )}
            {percentCirculating && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <span className="text-sm text-zinc-400">% Circulating</span>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {percentCirculating.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {data.message && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
