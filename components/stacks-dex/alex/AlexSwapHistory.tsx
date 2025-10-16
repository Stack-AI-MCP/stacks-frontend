"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume } from "@/lib/utils/format";
import { ArrowRightLeft } from "lucide-react";

// ALEX AllSwaps exact type based on API response from https://api.alexgo.io/v1/allswaps
type AlexSwapPair = {
  id: number;
  base: string; // Like "token-wxusd"
  baseSymbol: string; // Like "wrapped-usd"
  baseId: string; // Contract address
  quote: string; // Like "token-wusda"
  quoteSymbol: string; // Like "usda"
  quoteId: string; // Contract address
  baseVolume: number;
  quoteVolume: number;
  lastBasePriceInUSD: number;
  lastQuotePriceInUSD: number;
};

type AlexSwapHistoryResponse = {
  success: boolean;
  data: AlexSwapPair[]; // Direct array, NOT wrapped
  error?: string;
};

export interface AlexSwapHistoryProps {
  data: AlexSwapHistoryResponse;
  isLoading: boolean;
}

export default function AlexSwapHistory({ data, isLoading }: AlexSwapHistoryProps) {
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
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load ALEX Swap Pairs</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX swap information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const swaps = data.data;
  // Filter swaps with actual volume
  const activeSwaps = swaps.filter(s => s.baseVolume > 0 || s.quoteVolume > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-lg">ALEX Swap Pairs</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {swaps.length} pairs ({activeSwaps.length} active)
          </Badge>
        </div>
        <CardDescription>All available swap pairs with volume and price data</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Base Volume</TableHead>
                <TableHead className="text-right">Quote Volume</TableHead>
                <TableHead className="text-right">Base Price</TableHead>
                <TableHead className="text-right">Quote Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swaps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No swap pairs available
                  </TableCell>
                </TableRow>
              ) : (
                swaps.map((swap) => {
                  return (
                    <TableRow key={`alex-swap-${swap.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400">{swap.baseSymbol.toUpperCase()}</span>
                          <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                          <span className="text-blue-400">{swap.quoteSymbol.toUpperCase()}</span>
                          <Badge variant="outline" className="ml-2 text-xs">#{swap.id}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {swap.baseVolume > 0 ? formatVolume(swap.baseVolume) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {swap.quoteVolume > 0 ? formatVolume(swap.quoteVolume) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {swap.lastBasePriceInUSD > 0
                          ? `$${swap.lastBasePriceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {swap.lastQuotePriceInUSD > 0
                          ? `$${swap.lastQuotePriceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
