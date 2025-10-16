"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume, safeToFixed, safeParseNumber } from "@/lib/utils/format";

// Velar Pool exact type based on API response from https://api.velar.co/pools
type VelarPool = {
  symbol: string; // Like "STX-aBTC"
  token0Symbol: string;
  token1Symbol: string;
  token0ContractAddress: string;
  token1ContractAddress: string;
  lpTokenContractAddress: string;
  stats: {
    apy: string | number; // Can be "--" string!
    totalSupply: number;
    totalStaked: number;
    reserve0: number;
    reserve1: number;
    volume_usd: { value: number }; // Nested!
    tvl_usd: { value: number }; // Nested!
    fees_usd: { value: number }; // Nested!
  };
};

type VelarPoolListResponse = {
  success: boolean;
  data: {
    skip: number;
    limit: number;
    total: number;
    data: VelarPool[];
  };
  error?: string;
};

export interface VelarPoolListProps {
  data: VelarPoolListResponse;
  isLoading: boolean;
}

export default function VelarPoolList({ data, isLoading }: VelarPoolListProps) {
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

  if (!data.success || !data.data?.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Velar Pools</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Velar pool information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data: pools, total } = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Velar Liquidity Pools</CardTitle>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {total} total pools
          </Badge>
        </div>
        <CardDescription>Multi-chain DEX pools on Velar Protocol</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead className="text-right">TVL</TableHead>
                <TableHead className="text-right">Volume 24h</TableHead>
                <TableHead className="text-right">Fees 24h</TableHead>
                <TableHead className="text-right">APY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No Velar pools available
                  </TableCell>
                </TableRow>
              ) : (
                pools.map((pool, index) => {
                  // Handle APY - can be string "--"
                  const apyValue = pool.stats.apy === "--"
                    ? null
                    : typeof pool.stats.apy === 'string'
                      ? parseFloat(pool.stats.apy)
                      : pool.stats.apy;

                  return (
                    <TableRow key={`velar-pool-${pool.symbol}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">{pool.token0Symbol}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-blue-400">{pool.token1Symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pool.stats.tvl_usd.value > 0
                          ? formatVolume(pool.stats.tvl_usd.value)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pool.stats.volume_usd.value > 0
                          ? formatVolume(pool.stats.volume_usd.value)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sky-600">
                        {pool.stats.fees_usd.value > 0
                          ? formatVolume(pool.stats.fees_usd.value)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {apyValue !== null && apyValue > 0
                          ? `${safeToFixed(apyValue, 2)}%`
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
