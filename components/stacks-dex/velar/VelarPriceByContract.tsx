"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

// Velar Price by Contract type - single price value
type VelarPriceData = {
  price: number;
  contractAddress?: string;
};

type VelarPriceByContractResponse = {
  success: boolean;
  data: VelarPriceData;
  error?: string;
  message?: string;
};

export interface VelarPriceByContractProps {
  data: VelarPriceByContractResponse;
  isLoading: boolean;
}

export default function VelarPriceByContract({ data, isLoading }: VelarPriceByContractProps) {
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
          <CardTitle className="text-destructive">Failed to Load Price</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve token price"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { price, contractAddress } = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <CardTitle className="text-xl">Token Price</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Current price from Velar DEX
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Price Display */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-green-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Current Price (USD)</span>
          <p className="text-5xl font-bold text-green-400">
            ${price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: price < 1 ? 8 : 2
            })}
          </p>
        </div>

        {/* Contract Address */}
        {contractAddress && (
          <div className="pt-4 border-t border-zinc-700">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500">Contract Address:</span>
              <code className="text-xs text-zinc-300 font-mono break-all">{contractAddress}</code>
            </div>
          </div>
        )}

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
