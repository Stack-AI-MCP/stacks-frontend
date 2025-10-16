"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";

// Arkadiko Token Price type based on Hiro API oracle response
type ArkadikoTokenPriceData = {
  token_id: number;
  token_name?: string;
  price: number; // Price in USD
  last_updated_block: number;
  decimals?: number;
  oracle_address: string;
};

type ArkadikoTokenPriceResponse = {
  success: boolean;
  data: ArkadikoTokenPriceData;
  error?: string;
  message?: string;
};

export interface ArkadikoTokenPriceProps {
  data: ArkadikoTokenPriceResponse;
  isLoading: boolean;
}

export default function ArkadikoTokenPrice({ data, isLoading }: ArkadikoTokenPriceProps) {
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
          <CardTitle className="text-destructive">Failed to Load Token Price</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko oracle price"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const priceData = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <CardTitle className="text-xl">Arkadiko Oracle Price</CardTitle>
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-400">
            Token #{priceData.token_id}
          </Badge>
        </div>
        <CardDescription className="text-zinc-300">
          {priceData.token_name ? `Price for ${priceData.token_name}` : "Token price from Arkadiko oracle"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Price Display */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-zinc-400">Current Price (USD)</span>
          </div>
          <p className="text-5xl font-bold text-green-400">
            ${priceData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}
          </p>
        </div>

        {/* Details */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Token ID:</span>
            <code className="text-xs text-white font-mono">{priceData.token_id}</code>
          </div>
          {priceData.token_name && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Token Name:</span>
              <Badge variant="secondary">{priceData.token_name}</Badge>
            </div>
          )}
          {priceData.decimals !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Decimals:</span>
              <span className="text-white font-semibold">{priceData.decimals}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Last Updated Block:</span>
            <code className="text-xs text-white font-mono">{priceData.last_updated_block.toLocaleString()}</code>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Oracle Contract:</span>
            <code className="text-xs text-zinc-300 font-mono break-all">{priceData.oracle_address}</code>
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
