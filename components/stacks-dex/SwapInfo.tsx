"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export interface SwapInfoProps {
  data: {
    success: boolean;
    data?: {
      txId?: string;
      swapDetails?: {
        tokenX?: string;
        tokenY?: string;
        tokenIn?: string;
        tokenOut?: string;
        amountIn?: string | number;
        amountOut?: string | number;
        minAmountOut?: string | number;
        factor?: number;
        protocol?: string;
      };
      explorerUrl?: string;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function SwapInfo({ data, isLoading }: SwapInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Swap Failed</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve swap information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { swapDetails, txId, explorerUrl } = data.data;

  const tokenIn = swapDetails?.tokenIn || swapDetails?.tokenX || "Unknown";
  const tokenOut = swapDetails?.tokenOut || swapDetails?.tokenY || "Unknown";
  const amountIn = swapDetails?.amountIn || 0;
  const amountOut = swapDetails?.amountOut || swapDetails?.minAmountOut || 0;
  const protocol = swapDetails?.protocol || "DEX";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Swap Executed</CardTitle>
          <Badge variant="default" className="bg-green-600">Success</Badge>
        </div>
        <CardDescription>Transaction submitted to {protocol}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Swap Details */}
        <div className="flex items-center justify-between py-4 px-4 bg-muted rounded-lg">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{amountIn}</span>
            <span className="text-sm text-muted-foreground mt-1">{tokenIn}</span>
          </div>

          <ArrowRight className="h-6 w-6 text-muted-foreground" />

          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">{amountOut}</span>
            <span className="text-sm text-muted-foreground mt-1">{tokenOut}</span>
          </div>
        </div>

        {/* Transaction ID */}
        {txId && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID:</span>
            </div>
            <div className="font-mono text-xs bg-muted p-2 rounded break-all">
              {txId}
            </div>
          </div>
        )}

        {/* Explorer Link */}
        {(explorerUrl || txId) && (
          <a
            href={explorerUrl || `https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View on Stacks Explorer →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
