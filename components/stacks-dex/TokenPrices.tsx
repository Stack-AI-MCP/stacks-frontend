"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { formatPrice, formatVolume, formatChange } from "@/lib/utils/format";

export interface TokenPricesProps {
  data: {
    success: boolean;
    data?: {
      data?: Array<{
        contract_id: string;
        last_price_usd: number;
        change24h?: number;
        volume24h?: number;
      }>;
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
      [key: string]: any;
    } | Array<any>;
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

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Prices</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve token prices"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Handle multiple formats:
  // 1. ALEX API: data.data.data = [{contract_id, last_price_usd}, ...]
  // 2. Array format: data.data.prices = [{symbol, price, ...}, ...]
  // 3. Object format: data.data = {token1: price1, token2: price2, ...}
  let prices: Array<{
    symbol: string;
    token?: string;
    price: string | number;
    priceUSD?: string | number;
    change24h?: string | number;
    volume24h?: string | number;
    marketCap?: string | number;
  }> = [];

  if (Array.isArray(data.data)) {
    // Direct array format
    prices = data.data.map((item: any) => ({
      symbol: item.symbol || item.contract_id?.split('.').pop() || 'Unknown',
      token: item.token || item.contract_id,
      price: item.last_price_usd || item.price || item.priceUSD || 0,
      priceUSD: item.last_price_usd || item.priceUSD || item.price || 0,
      change24h: item.change24h,
      volume24h: item.volume24h,
    }));
  } else if (data.data?.data && Array.isArray(data.data.data)) {
    // ALEX API format: {data: {data: [{contract_id, last_price_usd}]}}
    prices = data.data.data.map((item: any) => ({
      symbol: item.contract_id === 'STX' ? 'STX' : item.contract_id?.split('.').pop() || 'Unknown',
      token: item.contract_id,
      price: item.last_price_usd || 0,
      priceUSD: item.last_price_usd || 0,
      change24h: item.change24h,
      volume24h: item.volume24h,
    }));
  } else if (data.data?.prices) {
    if (Array.isArray(data.data.prices)) {
      // Array in prices property
      prices = data.data.prices.map((item: any) => ({
        symbol: item.symbol || item.token || 'Unknown',
        token: item.token,
        price: item.price || item.priceUSD || 0,
        priceUSD: item.priceUSD || item.price || 0,
        change24h: item.change24h,
        volume24h: item.volume24h,
      }));
    } else {
      // Object in prices property - convert to array
      prices = Object.entries(data.data.prices).map(([key, value]: [string, any]) => ({
        symbol: key,
        price: typeof value === 'object' ? value.price || value.priceUSD || value : value,
        priceUSD: typeof value === 'object' ? value.priceUSD || value.price || value : value,
        change24h: typeof value === 'object' ? value.change24h : undefined,
        volume24h: typeof value === 'object' ? value.volume24h : undefined,
      }));
    }
  } else if (typeof data.data === 'object' && !Array.isArray(data.data)) {
    // Direct object format - convert to array
    prices = Object.entries(data.data).filter(([key]) => key !== 'protocol').map(([key, value]: [string, any]) => ({
      symbol: key,
      price: typeof value === 'object' ? value.price || value.priceUSD || value : value,
      priceUSD: typeof value === 'object' ? value.priceUSD || value.price || value : value,
      change24h: typeof value === 'object' ? value.change24h : undefined,
      volume24h: typeof value === 'object' ? value.volume24h : undefined,
    }));
  }

  const protocol = (data.data as any)?.protocol;

  // Sort by price (highest to lowest)
  const sortedPrices = [...prices].sort((a, b) => {
    const priceA = typeof a.priceUSD === 'string' ? parseFloat(a.priceUSD) : (a.priceUSD || 0);
    const priceB = typeof b.priceUSD === 'string' ? parseFloat(b.priceUSD) : (b.priceUSD || 0);
    return priceB - priceA;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Token Prices</CardTitle>
          <Badge variant="secondary">{sortedPrices.length} tokens</Badge>
        </div>
        {protocol && (
          <CardDescription>Current prices on {protocol} (sorted by price)</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {sortedPrices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No token prices available
            </div>
          ) : (
            sortedPrices.map((token, index) => {
              const price = formatPrice(token.priceUSD || token.price);
              const change = formatChange(token.change24h);
              const volume = formatVolume(token.volume24h);

              return (
                <div
                  key={`${token.symbol}-${index}`}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-lg">{token.symbol}</span>
                    {token.token && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                          {token.token}
                        </span>
                        <a
                          href={`https://explorer.hiro.so/address/${token.token}?chain=mainnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="View contract in explorer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
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
