"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Route, TrendingDown } from "lucide-react";

// BitFlow Quote type from SDK
type BitflowQuoteData = {
  bestRoute?: {
    quote?: number;
    route?: string[];
    dexPath?: string[];
    tokenXDecimals?: number;
    tokenYDecimals?: number;
    priceImpact?: number;
  };
  estimatedOutput?: number;
  priceImpact?: number;
  route?: string[];
  [key: string]: any;
};

type BitflowQuoteResponse = {
  success: boolean;
  data: BitflowQuoteData;
  error?: string;
  message?: string;
};

export interface BitflowQuoteProps {
  data: BitflowQuoteResponse;
  isLoading: boolean;
}

export default function BitflowQuote({ data, isLoading }: BitflowQuoteProps) {
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
          <CardDescription>{data.error || "Unable to retrieve BitFlow quote"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const quote = data.data;
  const bestRoute = quote.bestRoute;
  const estimatedOutput = bestRoute?.quote || quote.estimatedOutput;
  const priceImpact = bestRoute?.priceImpact || quote.priceImpact;
  const routePath = bestRoute?.dexPath || bestRoute?.route || quote.route;

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-xl">BitFlow Swap Quote</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Estimated output and routing information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estimated Output */}
        {estimatedOutput !== undefined && (
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-cyan-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Estimated Output</span>
            <p className="text-5xl font-bold text-cyan-400">
              {estimatedOutput.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })}
            </p>
          </div>
        )}

        {/* Quote Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priceImpact !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-sky-400" />
                <span className="text-sm text-zinc-400">Price Impact</span>
              </div>
              <p className={`text-2xl font-bold ${priceImpact > 5 ? 'text-red-400' : priceImpact > 1 ? 'text-sky-400' : 'text-green-400'}`}>
                {priceImpact.toFixed(2)}%
              </p>
            </div>
          )}

          {routePath && routePath.length > 0 && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Route className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Route</span>
              </div>
              <p className="text-sm text-white font-mono">
                {routePath.join(' → ')}
              </p>
            </div>
          )}

          {bestRoute?.tokenXDecimals !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">Input Decimals</span>
              <p className="text-xl font-bold text-white mt-1">
                {bestRoute.tokenXDecimals}
              </p>
            </div>
          )}

          {bestRoute?.tokenYDecimals !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">Output Decimals</span>
              <p className="text-xl font-bold text-white mt-1">
                {bestRoute.tokenYDecimals}
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-cyan-300">💡 BitFlow automatically finds the best route for your swap</p>
            <p className="text-xs text-cyan-300">💡 Lower price impact means better execution</p>
            {priceImpact && priceImpact > 5 && (
              <p className="text-xs text-red-300">⚠️ High price impact - consider splitting into smaller trades</p>
            )}
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-xs text-cyan-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
