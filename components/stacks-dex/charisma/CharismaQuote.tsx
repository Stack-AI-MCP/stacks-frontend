"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Route, TrendingDown, Layers } from "lucide-react";

// Charisma Quote type from API
type CharismaQuoteData = {
  amountOut?: number;
  priceImpact?: number;
  route?: Array<{
    vault: string;
    tokenA: string;
    tokenB: string;
    amountIn?: number;
    amountOut?: number;
  }>;
  estimatedOutput?: number;
  [key: string]: any;
};

type CharismaQuoteResponse = {
  success: boolean;
  data: CharismaQuoteData;
  error?: string;
  message?: string;
};

export interface CharismaQuoteProps {
  data: CharismaQuoteResponse;
  isLoading: boolean;
}

export default function CharismaQuote({ data, isLoading }: CharismaQuoteProps) {
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
          <CardTitle className="text-destructive">Failed to Get Quote</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Charisma quote"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const quote = data.data;
  const estimatedOutput = quote.amountOut || quote.estimatedOutput;
  const route = quote.route || [];
  const isMultiHop = route.length > 1;

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-purple-400" />
          <CardTitle className="text-xl">Charisma Swap Quote</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Vault-based composable routing for optimal prices
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estimated Output */}
        {estimatedOutput !== undefined && (
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-purple-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Estimated Output</span>
            <p className="text-5xl font-bold text-purple-400">
              {estimatedOutput.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })}
            </p>
          </div>
        )}

        {/* Quote Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quote.priceImpact !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-sky-400" />
                <span className="text-sm text-zinc-400">Price Impact</span>
              </div>
              <p className={`text-2xl font-bold ${quote.priceImpact > 5 ? 'text-red-400' : quote.priceImpact > 1 ? 'text-sky-400' : 'text-green-400'}`}>
                {quote.priceImpact.toFixed(2)}%
              </p>
            </div>
          )}

          {isMultiHop && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">Routing Type</span>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                Multi-Hop ({route.length} vaults)
              </Badge>
            </div>
          )}
        </div>

        {/* Multi-Hop Route Details */}
        {isMultiHop && (
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-zinc-300">Vault Route</span>
            </div>
            <div className="space-y-2">
              {route.map((hop, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                  <span className="text-zinc-400">
                    {hop.tokenA.split('.').pop()} → {hop.tokenB.split('.').pop()}
                  </span>
                  {hop.amountOut && (
                    <span className="text-purple-400 ml-auto">
                      {hop.amountOut.toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-purple-300">💡 Charisma uses composable vaults for optimal routing</p>
            <p className="text-xs text-purple-300">💡 Multi-hop swaps can achieve better rates than direct swaps</p>
            {quote.priceImpact && quote.priceImpact > 5 && (
              <p className="text-xs text-red-300">⚠️ High price impact - consider splitting into smaller trades</p>
            )}
          </div>
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
