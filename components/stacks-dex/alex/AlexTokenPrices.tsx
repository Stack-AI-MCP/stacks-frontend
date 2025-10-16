"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp } from "lucide-react";

// ALEX Token Price exact type based on API response from https://api.alexgo.io/v2/public/token-prices
type AlexTokenPrice = {
  contract_id: string; // Full contract like "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2"
  last_price_usd: number;
};

type AlexTokenPricesResponse = {
  success: boolean;
  data: {
    data: AlexTokenPrice[];
  };
  error?: string;
};

export interface AlexTokenPricesProps {
  data: AlexTokenPricesResponse;
  isLoading: boolean;
}

export default function AlexTokenPrices({ data, isLoading }: AlexTokenPricesProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load ALEX Token Prices</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX token price information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const prices = data.data.data;

  // Extract token name from contract_id
  // "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2" → "miamicoin-token-v2"
  const extractTokenName = (contractId: string): string => {
    const parts = contractId.split('.');
    if (parts.length < 2) return contractId;
    return parts[1].replace('token-', '').replace('-v2', '').toUpperCase();
  };

  // Filter out tokens with 0 price for cleaner display
  const activePrices = prices.filter(p => p.last_price_usd > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-lg">ALEX Token Prices</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {activePrices.length} tokens
          </Badge>
        </div>
        <CardDescription>Live USD prices from ALEX Protocol</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-left text-xs text-muted-foreground">Contract ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No token prices available
                  </TableCell>
                </TableRow>
              ) : (
                activePrices.map((token) => {
                  const tokenName = extractTokenName(token.contract_id);

                  return (
                    <TableRow key={`alex-price-${token.contract_id}`}>
                      <TableCell className="font-medium">
                        <span className="text-orange-400">{tokenName}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        ${token.last_price_usd.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8
                        })}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {token.contract_id}
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
