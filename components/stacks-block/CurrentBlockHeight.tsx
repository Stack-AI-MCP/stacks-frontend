"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blocks, ExternalLink } from "lucide-react";

// Current Block Height Response
type CurrentBlockHeightData = {
  height: number;
  hash: string;
  burn_block_height: number;
  timestamp: string;
};

type CurrentBlockHeightResponse = {
  success: boolean;
  data?: CurrentBlockHeightData;
  error?: string;
  message?: string;
};

export interface CurrentBlockHeightProps {
  data: CurrentBlockHeightResponse;
  isLoading: boolean;
}

export default function CurrentBlockHeight({ data, isLoading }: CurrentBlockHeightProps) {
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
          <CardTitle className="text-destructive">Failed to Get Block Height</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve current block height"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const blockData = data.data;
  const explorerUrl = `https://explorer.hiro.so/block/${blockData.hash}?chain=mainnet`;

  return (
    <Card className="w-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="w-6 h-6 text-green-400" />
            <CardTitle className="text-xl">Current Block Height</CardTitle>
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View in Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <CardDescription className="text-zinc-300">
          Latest confirmed block on Stacks blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Block Height Display */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-green-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Block Height</span>
          <p className="text-6xl font-bold text-green-400">
            {blockData.height.toLocaleString()}
          </p>
        </div>

        {/* Block Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Block Hash</span>
            <code className="text-xs text-white font-mono break-all">
              {blockData.hash}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Bitcoin Block Height</span>
            <p className="text-sm text-white font-mono">{blockData.burn_block_height.toLocaleString()}</p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <span className="text-sm text-zinc-400 block mb-2">Block Time</span>
          <p className="text-sm text-white">
            {new Date(blockData.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 This is the latest confirmed block on the Stacks blockchain
            </p>
            <p className="text-xs text-blue-300">
              💡 Stacks blocks are anchored to Bitcoin blocks for security
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
