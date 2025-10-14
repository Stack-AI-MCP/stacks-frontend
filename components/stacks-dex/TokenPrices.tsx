"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface TokenPricesProps {
  data: {
    success: boolean;
    data?: {
      prices?: Array<{
        symbol: string;
        token?: string;
        price: string | number;
        priceUSD?: string | number;
        change24h?: string | number;
        volume24h?: string | number;
        marketCap?: string | number;
      }>;
      protocol?: string;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function TokenPrices({ data, isLoading }: TokenPricesProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.prices) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Prices</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve token prices"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { prices, protocol } = data.data;

  const formatPrice = (price: string | number): string => {
    const value = typeof price === "string" ? parseFloat(price) : price;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(8)}`;
  };

  const formatVolume = (volume: string | number | undefined): string => {
    if (!volume) return "$0";
    const value = typeof volume === "string" ? parseFloat(volume) : volume;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatChange = (change: string | number | undefined) => {
    if (!change) return { value: "0.00%", trend: "neutral" as const };
    const value = typeof change === "string" ? parseFloat(change) : change;
    return {
      value: `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`,
      trend: value > 0 ? "up" : value < 0 ? "down" : "neutral" as const
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Token Prices</CardTitle>
          <Badge variant="secondary">{prices.length} tokens</Badge>
        </div>
        {protocol && (
          <CardDescription>Current prices on {protocol}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {prices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No token prices available
            </div>
          ) : (
            prices.map((token, index) => {
              const price = formatPrice(token.priceUSD || token.price);
              const change = formatChange(token.change24h);
              const volume = formatVolume(token.volume24h);

              return (
                <div
                  key={`${token.symbol}-${index}`}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{token.symbol}</span>
                    {token.token && (
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                        {token.token}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-lg font-semibold">{price}</span>
                      {token.volume24h && (
                        <span className="text-xs text-muted-foreground">
                          Vol: {volume}
                        </span>
                      )}
                    </div>

                    {change.trend !== "neutral" && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                        change.trend === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {change.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{change.value}</span>
                      </div>
                    )}

                    {change.trend === "neutral" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700">
                        <Minus className="h-4 w-4" />
                        <span className="text-sm font-medium">{change.value}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
