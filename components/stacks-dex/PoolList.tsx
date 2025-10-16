"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume, safeToFixed } from "@/lib/utils/format";

export interface PoolListProps {
  data: {
    success: boolean;
    data?:
      // Format 1: ALEX Tickers - direct array
      | Array<{
          ticker: string;
          base: string;
          target: string;
        }>
      // Format 2: ALEX Pools - nested data
      | {
          data?: Array<{
            pool_id?: number;
            token_x?: string;
            token_y?: string;
            apr_24h?: number;
            apr_7d?: number;
            volume_24h?: number;
            volume_7d?: number;
            liquidity?: number;
            factor?: number;
            balance_x?: number;
            balance_y?: number;
          }>;
          protocol?: string;
        }
      // Format 3: Velar Pools - paginated
      | {
          skip?: number;
          limit?: number;
          data?: Array<{
            symbol?: string;
            token0Symbol?: string;
            token1Symbol?: string;
            token0ContractAddress?: string;
            token1ContractAddress?: string;
            stats?: {
              apy?: string | number;
              totalSupply?: number;
              totalStaked?: number;
              reserve0?: number;
              reserve1?: number;
              volume_usd?: { value: number };
              tvl_usd?: { value: number };
              fees_usd?: { value: number };
            };
          }>;
          total?: number;
          protocol?: string;
        }
      // Format 4: Generic pools
      | {
          pools?: Array<{
            id?: string;
            token0?: string;
            token1?: string;
            tokenX?: string;
            tokenY?: string;
            base?: string;
            target?: string;
            ticker?: string;
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

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Pools</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve pool information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Handle multiple formats:
  // 1. ALEX Tickers: Direct array [{ticker, base, target}, ...]
  // 2. ALEX Pools: Nested {data: [{pool_id, token_x, token_y, ...}]}
  // 3. Velar Pools: Paginated {skip, limit, data: [{symbol, stats: {...}}], total}
  // 4. Generic: {pools: [...], protocol, totalPools}
  let pools: Array<any> = [];
  let protocol: string | undefined;
  let totalPools: number;

  const responseData = data.data;

  if (Array.isArray(responseData)) {
    // Format 1: Direct array (ALEX tickers)
    pools = responseData;
    totalPools = pools.length;
  } else if (responseData && 'data' in responseData && Array.isArray(responseData.data)) {
    // Format 2 & 3: Nested data array (ALEX pools or Velar pools)
    pools = responseData.data;
    protocol = responseData.protocol;
    // Check if it's Velar pagination format
    if ('total' in responseData && responseData.total !== undefined) {
      totalPools = responseData.total;
      protocol = protocol || 'Velar';
    } else {
      totalPools = pools.length;
      protocol = protocol || 'ALEX';
    }
  } else if (responseData && 'pools' in responseData && responseData.pools) {
    // Format 4: Object with pools property
    pools = responseData.pools;
    protocol = responseData.protocol;
    totalPools = responseData.totalPools || pools.length;
  } else {
    pools = [];
    totalPools = 0;
  }

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
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
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
                  // Extract token symbols from different formats
                  // ALEX Tickers: {base, target}
                  // ALEX Pools: {token_x, token_y} (contract addresses)
                  // Velar: {token0Symbol, token1Symbol} or {symbol: "X-Y"}
                  let token0: string;
                  let token1: string;

                  if (pool.symbol && pool.symbol.includes('-')) {
                    // Velar format: "STX-aBTC"
                    const parts = pool.symbol.split('-');
                    token0 = parts[0] || "Token0";
                    token1 = parts[1] || "Token1";
                  } else if (pool.token0Symbol && pool.token1Symbol) {
                    // Velar detailed format
                    token0 = pool.token0Symbol;
                    token1 = pool.token1Symbol;
                  } else if (pool.token_x && pool.token_y) {
                    // ALEX Pools: Extract token name from contract address
                    token0 = pool.token_x.split('.').pop()?.replace('token-', '').replace('w', '') || "Token0";
                    token1 = pool.token_y.split('.').pop()?.replace('token-', '').replace('w', '') || "Token1";
                  } else {
                    // ALEX Tickers or generic format
                    token0 = pool.base || pool.token0 || pool.tokenX || "Token0";
                    token1 = pool.target || pool.token1 || pool.tokenY || "Token1";
                  }

                  // Extract TVL from different formats
                  // Velar: stats.tvl_usd.value
                  // ALEX Pools: liquidity
                  // Generic: tvl
                  const tvl = pool.stats?.tvl_usd?.value || pool.liquidity || pool.tvl || 0;

                  // Extract volume from different formats
                  // Velar: stats.volume_usd.value
                  // ALEX Pools: volume_24h
                  // Generic: volume24h
                  const volume = pool.stats?.volume_usd?.value || pool.volume_24h || pool.volume24h || 0;

                  // Extract APY/APR from different formats
                  // Velar: stats.apy (can be string "--")
                  // ALEX Pools: apr_24h or apr_7d (number)
                  // Generic: apy (number)
                  let apy: number | null = null;
                  if (pool.stats?.apy) {
                    apy = pool.stats.apy === '--' ? null : parseFloat(pool.stats.apy);
                  } else if (pool.apr_24h !== undefined) {
                    apy = pool.apr_24h;
                  } else if (pool.apr_7d !== undefined) {
                    apy = pool.apr_7d;
                  } else if (pool.apy !== undefined) {
                    apy = typeof pool.apy === 'string' ? parseFloat(pool.apy) : pool.apy;
                  }

                  // Extract fee from different formats
                  // ALEX Pools: factor (e.g., 0.05 = 5%)
                  // Generic: fee
                  const fee = pool.factor ? pool.factor * 100 : (pool.fee || 0);

                  return (
                    <TableRow key={`${pool.ticker || pool.symbol || pool.pool_id || 'pool'}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="uppercase">{token0}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="uppercase">{token1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {tvl > 0 ? formatVolume(tvl) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {volume > 0 ? formatVolume(volume) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {apy !== null && apy > 0 ? `${safeToFixed(apy, 2)}%` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {fee > 0 ? `${safeToFixed(fee, 2)}%` : "-"}
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
