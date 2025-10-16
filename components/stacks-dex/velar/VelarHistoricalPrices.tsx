"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Clock } from "lucide-react";

// Velar Historical Price type
type VelarHistoricalPricePoint = {
  timestamp: string;
  price: number;
  volume?: number;
};

type VelarHistoricalPricesResponse = {
  success: boolean;
  data: VelarHistoricalPricePoint[];
  error?: string;
  message?: string;
};

export interface VelarHistoricalPricesProps {
  data: VelarHistoricalPricesResponse;
  isLoading: boolean;
}

export default function VelarHistoricalPrices({ data, isLoading }: VelarHistoricalPricesProps) {
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
          <CardTitle className="text-destructive">Failed to Load Historical Prices</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve historical price data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const prices = data.data;

  // Calculate price change from first to last
  const firstPrice = prices[0]?.price || 0;
  const lastPrice = prices[prices.length - 1]?.price || 0;
  const priceChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  const isPositive = priceChange > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-lg">Historical Prices</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {prices.length} data points
            </Badge>
            <Badge variant={isPositive ? "default" : "destructive"} className={isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </Badge>
          </div>
        </div>
        <CardDescription>
          Price history over selected time interval
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                {prices.some(p => p.volume !== undefined) && (
                  <TableHead className="text-right">Volume</TableHead>
                )}
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No historical data available
                  </TableCell>
                </TableRow>
              ) : (
                prices.map((point, index) => {
                  const prevPrice = index > 0 ? prices[index - 1].price : point.price;
                  const change = prevPrice > 0 ? ((point.price - prevPrice) / prevPrice) * 100 : 0;
                  const changePositive = change > 0;

                  return (
                    <TableRow key={point.timestamp}>
                      <TableCell className="font-mono text-xs">
                        {new Date(point.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-white">
                        ${point.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: point.price < 1 ? 8 : 2
                        })}
                      </TableCell>
                      {prices.some(p => p.volume !== undefined) && (
                        <TableCell className="text-right font-mono">
                          {point.volume !== undefined ? point.volume.toLocaleString() : '-'}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {index > 0 && change !== 0 && (
                          <span className={changePositive ? 'text-green-400' : 'text-red-400'}>
                            {changePositive ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-xs text-purple-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
