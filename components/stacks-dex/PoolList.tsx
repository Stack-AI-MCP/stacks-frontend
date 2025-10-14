"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface PoolListProps {
  data: {
    success: boolean;
    data?: {
      pools?: Array<{
        id?: string;
        token0?: string;
        token1?: string;
        tokenX?: string;
        tokenY?: string;
        reserve0?: string | number;
        reserve1?: string | number;
        reserveX?: string | number;
        reserveY?: string | number;
        tvl?: string | number;
        volume24h?: string | number;
        apy?: string | number;
        fee?: string | number;
      }>;
      protocol?: string;
      totalPools?: number;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function PoolList({ data, isLoading }: PoolListProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.pools) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Pools</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve pool information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { pools, protocol, totalPools } = data.data;

  const formatNumber = (num: string | number | undefined): string => {
    if (!num) return "0";
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Liquidity Pools</CardTitle>
          {totalPools && (
            <Badge variant="secondary">{totalPools} pools</Badge>
          )}
        </div>
        {protocol && (
          <CardDescription>Available pools on {protocol}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead className="text-right">TVL</TableHead>
                <TableHead className="text-right">Volume 24h</TableHead>
                <TableHead className="text-right">APY</TableHead>
                <TableHead className="text-right">Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No pools available
                  </TableCell>
                </TableRow>
              ) : (
                pools.map((pool, index) => {
                  const token0 = pool.token0 || pool.tokenX || "Token0";
                  const token1 = pool.token1 || pool.tokenY || "Token1";
                  const tvl = pool.tvl || 0;
                  const volume = pool.volume24h || 0;
                  const apy = pool.apy || 0;
                  const fee = pool.fee || 0;

                  return (
                    <TableRow key={pool.id || index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{token0}</span>
                          <span className="text-muted-foreground">/</span>
                          <span>{token1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(tvl)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(volume)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {typeof apy === "number" ? `${apy.toFixed(2)}%` : apy}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {typeof fee === "number" ? `${fee}%` : fee}
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
