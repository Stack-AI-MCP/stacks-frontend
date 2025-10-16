"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft } from "lucide-react";

// ALEX Trading Pair exact type based on API response from https://api.alexgo.io/v1/pairs
type AlexTradingPair = {
  ticker: string; // Combined contract addresses separated by _
  base: string; // Token symbol
  target: string; // Token symbol
};

type AlexTradingPairsResponse = {
  success: boolean;
  data: AlexTradingPair[]; // Direct array, NOT wrapped in {data: [...]}
  error?: string;
};

export interface AlexTradingPairsProps {
  data: AlexTradingPairsResponse;
  isLoading: boolean;
}

export default function AlexTradingPairs({ data, isLoading }: AlexTradingPairsProps) {
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
          <CardTitle className="text-destructive">Failed to Load ALEX Trading Pairs</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX trading pair information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pairs = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-lg">ALEX Trading Pairs</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {pairs.length} pairs
          </Badge>
        </div>
        <CardDescription>Available swap pairs on ALEX DEX</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead className="text-left text-xs text-muted-foreground">Ticker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No trading pairs available
                  </TableCell>
                </TableRow>
              ) : (
                pairs.map((pair, index) => {
                  return (
                    <TableRow key={`alex-pair-${pair.ticker}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400">{pair.base.toUpperCase()}</span>
                          <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                          <span className="text-blue-400">{pair.target.toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono truncate max-w-md">
                        {pair.ticker}
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
