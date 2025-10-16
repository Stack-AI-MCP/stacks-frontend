"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blocks, ExternalLink, User, FileText } from "lucide-react";

// Block Details Response (from getBlockByHeight or getBlockByHash)
type BlockDetailsData = {
  canonical: boolean;
  height: number;
  hash: string;
  block_time: number;
  block_time_iso: string;
  index_block_hash: string;
  parent_block_hash: string;
  parent_index_block_hash: string;
  burn_block_time: number;
  burn_block_time_iso: string;
  burn_block_hash: string;
  burn_block_height: number;
  miner_txid: string;
  tx_count: number;
  execution_cost_read_count: number;
  execution_cost_read_length: number;
  execution_cost_runtime: number;
  execution_cost_write_count: number;
  execution_cost_write_length: number;
};

type BlockDetailsResponse = {
  success: boolean;
  data?: BlockDetailsData;
  error?: string;
  message?: string;
};

export interface BlockDetailsProps {
  data: BlockDetailsResponse;
  isLoading: boolean;
}

export default function BlockDetails({ data, isLoading }: BlockDetailsProps) {
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
          <CardTitle className="text-destructive">Failed to Load Block</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve block details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const block = data.data;
  const explorerUrl = `https://explorer.hiro.so/block/${block.hash}?chain=mainnet`;

  return (
    <Card className="w-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="w-6 h-6 text-emerald-400" />
            <CardTitle className="text-xl">Block Details</CardTitle>
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
          Block #{block.height.toLocaleString()} on Stacks blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Canonical Badge */}
        <div className="flex items-center justify-center gap-3">
          <Badge
            variant={block.canonical ? "default" : "secondary"}
            className={block.canonical ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}
          >
            {block.canonical ? "CANONICAL" : "NON-CANONICAL"}
          </Badge>
        </div>

        {/* Block Height */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-emerald-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Block Height</span>
          <p className="text-5xl font-bold text-emerald-400">
            {block.height.toLocaleString()}
          </p>
        </div>

        {/* Block Hash */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-emerald-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Block Hash</span>
          <code className="text-sm text-white font-mono break-all">
            {block.hash}
          </code>
        </div>

        {/* Transaction Count */}
        <div className="flex justify-center">
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between gap-4">
              <FileText className="w-5 h-5 text-teal-400" />
              <div className="text-right">
                <span className="text-xs text-zinc-400 block">Transactions</span>
                <span className="text-2xl font-bold text-teal-400">{block.tx_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Block Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Index Block Hash</span>
            <code className="text-xs text-white font-mono break-all">
              {block.index_block_hash}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Parent Block Hash</span>
            <code className="text-xs text-white font-mono break-all">
              {block.parent_block_hash}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Parent Index Block Hash</span>
            <code className="text-xs text-white font-mono break-all">
              {block.parent_index_block_hash}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Miner Transaction ID</span>
            <code className="text-xs text-white font-mono break-all">
              {block.miner_txid}
            </code>
          </div>
        </div>

        {/* Bitcoin Anchor Details */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <span className="text-sm text-orange-300 block mb-3 font-semibold">Bitcoin Anchor Details</span>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400">Bitcoin Block Height:</span>
              <span className="text-sm text-white font-mono">{block.burn_block_height.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400">Bitcoin Block Hash:</span>
              <code className="text-xs text-white font-mono max-w-xs break-all">
                {block.burn_block_hash}
              </code>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400">Bitcoin Block Time:</span>
              <span className="text-xs text-white">
                {new Date(block.burn_block_time_iso).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Costs */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <span className="text-sm text-purple-300 block mb-3 font-semibold">Execution Costs</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-zinc-400 block">Read Count:</span>
              <span className="text-sm text-white font-mono">{block.execution_cost_read_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Read Length:</span>
              <span className="text-sm text-white font-mono">{block.execution_cost_read_length.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Write Count:</span>
              <span className="text-sm text-white font-mono">{block.execution_cost_write_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Write Length:</span>
              <span className="text-sm text-white font-mono">{block.execution_cost_write_length.toLocaleString()}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-zinc-400 block">Runtime:</span>
              <span className="text-sm text-white font-mono">{block.execution_cost_runtime.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Block Time */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <span className="text-sm text-zinc-400 block mb-2">Stacks Block Time</span>
          <p className="text-sm text-white">
            {new Date(block.block_time_iso).toLocaleString()}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Canonical blocks are confirmed and part of the main chain
            </p>
            <p className="text-xs text-blue-300">
              💡 Stacks blocks are anchored to Bitcoin for security
            </p>
            <p className="text-xs text-blue-300">
              💡 Execution costs measure computational resources used
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
