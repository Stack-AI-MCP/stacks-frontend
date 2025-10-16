"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Velar Token Price type based on API response from https://api.velar.co/prices
type VelarTokenPrice = {
  symbol: string;
  name: string;
  contractAddress: string;
  imageUrl: string;
  tokenDecimalNum: number;
  assetName: string;
  price: number;
  percent_change_24h: number;
  socialLinks?: {
    website?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
};

type VelarTokenPricesResponse = {
  success: boolean;
  data: {
    limit: number;
    offset: number;
    total: number;
    data: VelarTokenPrice[];
  };
  error?: string;
  message?: string;
};

export interface VelarTokenPricesProps {
  data: VelarTokenPricesResponse;
  isLoading: boolean;
}

export default function VelarTokenPrices({ data, isLoading }: VelarTokenPricesProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Token Prices</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Velar token prices"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data: tokens, total } = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg">Velar Token Prices</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            {total} tokens
          </Badge>
        </div>
        <CardDescription>
          Current prices and 24h changes for all tokens on Velar
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No token prices available
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map((token) => {
                  const priceChange = token.percent_change_24h;
                  const isPositive = priceChange > 0;

                  return (
                    <TableRow key={token.contractAddress}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {token.imageUrl && (
                            <img src={token.imageUrl} alt={token.symbol} className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">{token.symbol}</span>
                              <Badge variant="outline" className="text-xs">{token.name}</Badge>
                            </div>
                            <code className="text-xs text-zinc-500">{token.contractAddress.slice(0, 20)}...</code>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className="text-white text-lg">
                          ${token.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: token.price < 1 ? 8 : 2
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
