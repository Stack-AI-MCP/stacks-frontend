"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Clock, ArrowRightLeft } from "lucide-react";

// Charisma Order Details type from API
type CharismaOrderDetailsData = {
  uuid: string;
  owner?: string;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  minAmountOut?: string;
  status?: string;
  createdAt?: string;
  executedAt?: string;
  actualAmountOut?: string;
  txid?: string;
  [key: string]: any;
};

type CharismaOrderDetailsResponse = {
  success: boolean;
  data: CharismaOrderDetailsData;
  error?: string;
  message?: string;
};

export interface CharismaOrderDetailsProps {
  data: CharismaOrderDetailsResponse;
  isLoading: boolean;
}

export default function CharismaOrderDetails({ data, isLoading }: CharismaOrderDetailsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Order</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve order details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const order = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-400" />
          <CardTitle className="text-xl">Order Details</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Limit order #{order.uuid.slice(0, 8)}...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Badge */}
        {order.status && (
          <div className="flex justify-center">
            <Badge
              variant={order.status === 'active' ? 'default' : order.status === 'executed' ? 'default' : 'secondary'}
              className={
                order.status === 'active'
                  ? 'bg-green-500/20 text-green-400 px-6 py-2'
                  : order.status === 'executed'
                  ? 'bg-blue-500/20 text-blue-400 px-6 py-2'
                  : 'bg-zinc-500/20 text-zinc-400 px-6 py-2'
              }
            >
              {order.status}
            </Badge>
          </div>
        )}

        {/* Swap Details */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
          {order.owner && (
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-sm text-zinc-400 block">Owner</span>
                <code className="text-xs text-white font-mono">{order.owner}</code>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.tokenIn && (
              <div>
                <span className="text-sm text-zinc-400 block mb-1">Input Token</span>
                <p className="text-xl font-bold text-white">{order.tokenIn.split('.').pop()}</p>
              </div>
            )}
            {order.tokenOut && (
              <div>
                <span className="text-sm text-zinc-400 block mb-1">Output Token</span>
                <p className="text-xl font-bold text-white">{order.tokenOut.split('.').pop()}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.amountIn && (
              <div>
                <span className="text-sm text-zinc-400 block mb-1">Amount In</span>
                <p className="text-2xl font-bold text-purple-400">{order.amountIn}</p>
              </div>
            )}
            {order.minAmountOut && (
              <div>
                <span className="text-sm text-zinc-400 block mb-1">Minimum Output</span>
                <p className="text-2xl font-bold text-green-400">{order.minAmountOut}</p>
              </div>
            )}
          </div>

          {order.actualAmountOut && (
            <div>
              <span className="text-sm text-zinc-400 block mb-1">Actual Output (Executed)</span>
              <p className="text-3xl font-bold text-blue-400">{order.actualAmountOut}</p>
            </div>
          )}
        </div>

        {/* Timestamp Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.createdAt && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Created</span>
              </div>
              <p className="text-sm text-white">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          )}

          {order.executedAt && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Executed</span>
              </div>
              <p className="text-sm text-blue-300">{new Date(order.executedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Transaction ID */}
        {order.txid && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <span className="text-sm text-blue-400 block mb-2">Transaction ID</span>
            <code className="text-xs text-blue-200 font-mono break-all">{order.txid}</code>
          </div>
        )}

        {/* UUID */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <span className="text-sm text-purple-400 block mb-2">Order UUID</span>
          <code className="text-xs text-purple-200 font-mono break-all">{order.uuid}</code>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-xs text-purple-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
