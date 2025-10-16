"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume } from "@/lib/utils/format";
import { TrendingUp, BarChart3 } from "lucide-react";

// Velar Ticker type based on API response from https://api.velar.co/tickers
type VelarTicker = {
  _id: string;
  ticker_id: string;
  ask: number;
  bid: number;
  last_price: number;
  high: number;
  low: number;
  base_currency: string;
  target_currency: string;
  base_volume: number;
  liquidity_in_usd: number;
  pool_id: string;
};

type VelarTickersResponse = {
  success: boolean;
  data: VelarTicker[];
  error?: string;
  message?: string;
};

export interface VelarTickersProps {
  data: VelarTickersResponse;
  isLoading: boolean;
}

export default function VelarTickers({ data, isLoading }: VelarTickersProps) {
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

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Tickers</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Velar ticker data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tickers = data.data;

  // Extract token symbols from contract addresses
  const extractSymbol = (address: string): string => {
    const parts = address.split('.');
    return parts[parts.length - 1].toUpperCase().replace('TOKEN-', '').replace('WSTX', 'STX');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg">Velar Market Tickers</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {tickers.length} pairs
          </Badge>
        </div>
        <CardDescription>
          Real-time market data for all Velar trading pairs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h Volume</TableHead>
                <TableHead className="text-right">Liquidity (USD)</TableHead>
                <TableHead className="text-right">24h Range</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No ticker data available
                  </TableCell>
                </TableRow>
              ) : (
                tickers.map((ticker) => {
                  const baseSymbol = extractSymbol(ticker.base_currency);
                  const targetSymbol = extractSymbol(ticker.target_currency);
                  const priceChange = ((ticker.last_price - ticker.low) / ticker.low) * 100;

                  return (
                    <TableRow key={ticker._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">{baseSymbol}</span>
                          <span className="text-zinc-500">/</span>
                          <span className="text-purple-400">{targetSymbol}</span>
                        </div>
                        <div className="text-xs text-zinc-500">Pool #{ticker.pool_id}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <div className="text-white">{ticker.last_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</div>
                        {priceChange !== 0 && (
                          <div className={`text-xs ${priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {ticker.base_volume > 0 ? formatVolume(ticker.base_volume) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ${ticker.liquidity_in_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <div className="text-xs">
                          <div className="text-green-400">H: {ticker.high.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                          <div className="text-red-400">L: {ticker.low.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
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
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
