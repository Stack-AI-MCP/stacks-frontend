"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume, safeToFixed } from "@/lib/utils/format";

// ALEX Pool exact type based on API response from https://api.alexgo.io/v2/public/pools
type AlexPool = {
  pool_id: number;
  token_x: string; // Contract address like "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wxusd"
  token_y: string; // Contract address
  factor: number; // Fee percentage (0.05 = 5%)
  apr_24h: number;
  apr_7d: number;
  balance_x: number;
  balance_y: number;
  fee_24h: number;
  fee_7d: number;
  liquidity: number;
  volume_24h: number;
  volume_7d: number;
  total_supply: number;
  instant_price: number;
  pool_token_price: number;
};

type AlexPoolListResponse = {
  success: boolean;
  data: {
    data: AlexPool[];
  };
  error?: string;
};

export interface AlexPoolListProps {
  data: AlexPoolListResponse;
  isLoading: boolean;
}

export default function AlexPoolList({ data, isLoading }: AlexPoolListProps) {
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
          <CardTitle className="text-destructive">Failed to Load ALEX Pools</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX pool information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pools = data.data.data;

  // Extract token name from contract address
  // "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wxusd" → "wxusd"
  const extractTokenName = (contractAddress: string): string => {
    const parts = contractAddress.split('.');
    if (parts.length < 2) return contractAddress;
    return parts[1].replace('token-', '').replace('w', '').toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ALEX Liquidity Pools</CardTitle>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {pools.length} pools
          </Badge>
        </div>
        <CardDescription>AMM pools on ALEX Protocol</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead className="text-right">Liquidity</TableHead>
                <TableHead className="text-right">Volume 24h</TableHead>
                <TableHead className="text-right">APR 24h</TableHead>
                <TableHead className="text-right">Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No ALEX pools available
                  </TableCell>
                </TableRow>
              ) : (
                pools.map((pool) => {
                  const tokenX = extractTokenName(pool.token_x);
                  const tokenY = extractTokenName(pool.token_y);
                  const feePercent = pool.factor * 100; // 0.05 → 5%

                  return (
                    <TableRow key={`alex-pool-${pool.pool_id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400">{tokenX}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-blue-400">{tokenY}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            #{pool.pool_id}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pool.liquidity > 0 ? formatVolume(pool.liquidity) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pool.volume_24h > 0 ? formatVolume(pool.volume_24h) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {pool.apr_24h > 0 ? `${safeToFixed(pool.apr_24h, 2)}%` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {safeToFixed(feePercent, 2)}%
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
