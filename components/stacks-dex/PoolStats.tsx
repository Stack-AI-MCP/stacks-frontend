'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, DollarSign, BarChart3, Percent } from 'lucide-react';
import { safeParseNumber, safeToFixed } from '@/lib/utils/format';

type PoolStatsData = {
  success: boolean;
  data?: {
    // Generic fields
    pool_id?: string | number;
    pool_name?: string;
    token0?: string;
    token1?: string;
    tvl?: number;
    volume_24h?: number;
    volume_7d?: number;
    fees_24h?: number;
    apr?: number | string;
    apy?: number | string;
    liquidity?: number;
    price?: number;
    reserve0?: number;
    reserve1?: number;
    total_supply?: number;
    // ALEX Pools fields
    token_x?: string;
    token_y?: string;
    apr_24h?: number;
    apr_7d?: number;
    balance_x?: number;
    balance_y?: number;
    // Velar fields
    symbol?: string;
    token0Symbol?: string;
    token1Symbol?: string;
    stats?: {
      apy?: string | number;
      reserve0?: number;
      reserve1?: number;
      totalSupply?: number;
      totalStaked?: number;
      volume_usd?: { value: number };
      tvl_usd?: { value: number };
      fees_usd?: { value: number };
    };
  };
  error?: string;
  message?: string;
};

export default function PoolStats({
  data,
  isLoading = false
}: {
  data: PoolStatsData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Pool Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-zinc-800 p-4 rounded-lg space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Pool Stats Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load pool statistics'}</p>
        </CardContent>
      </Card>
    );
  }

  const pool = data.data;

  // Extract token names from different formats
  const token0Name = pool.token0Symbol || pool.token0 ||
    (pool.token_x ? pool.token_x.split('.').pop()?.replace('token-', '').replace('w', '') : undefined) ||
    (pool.symbol ? pool.symbol.split('-')[0] : undefined) || 'Token0';

  const token1Name = pool.token1Symbol || pool.token1 ||
    (pool.token_y ? pool.token_y.split('.').pop()?.replace('token-', '').replace('w', '') : undefined) ||
    (pool.symbol ? pool.symbol.split('-')[1] : undefined) || 'Token1';

  // Extract values from different formats (Velar uses nested stats)
  const tvl = pool.stats?.tvl_usd?.value || pool.tvl || pool.liquidity;
  const volume24h = pool.stats?.volume_usd?.value || pool.volume_24h;
  const fees24h = pool.stats?.fees_usd?.value || pool.fees_24h;
  const reserve0 = pool.stats?.reserve0 || pool.reserve0 || pool.balance_x;
  const reserve1 = pool.stats?.reserve1 || pool.reserve1 || pool.balance_y;
  const totalSupply = pool.stats?.totalSupply || pool.total_supply;
  const apy = pool.stats?.apy || pool.apy;
  const apr = pool.apr || pool.apr_24h || pool.apr_7d;

  const formatCurrency = (value: number | string | undefined | null) => {
    const num = safeParseNumber(value);
    if (num === 0 && value === undefined) return 'N/A';
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: number | string | undefined | null) => {
    const num = safeParseNumber(value);
    if (num === 0 && value === undefined) return 'N/A';
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatPercentage = (value: number | string | undefined | null) => {
    // Handle string values like "--" from Velar
    if (typeof value === 'string' && value === '--') return 'N/A';
    const num = safeParseNumber(value);
    if (num === 0 && value === undefined) return 'N/A';
    return `${safeToFixed(num, 2)}%`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Pool Statistics
        </CardTitle>
        {pool.pool_name && (
          <p className="text-sm text-zinc-400 mt-1">{pool.pool_name}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Pair */}
        <div className="flex items-center gap-2 justify-center">
          <Badge className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1">
            {token0Name}
          </Badge>
          <span className="text-zinc-500">/</span>
          <Badge className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1">
            {token1Name}
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TVL/Liquidity */}
          {tvl !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Total Value Locked</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(tvl)}
              </p>
            </div>
          )}

          {/* 24h Volume */}
          {volume24h !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">24h Volume</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {formatCurrency(volume24h)}
              </p>
            </div>
          )}

          {/* 7d Volume */}
          {pool.volume_7d !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">7d Volume</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {formatCurrency(pool.volume_7d)}
              </p>
            </div>
          )}

          {/* 24h Fees */}
          {fees24h !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-sky-400" />
                <span className="text-sm text-zinc-400">24h Fees</span>
              </div>
              <p className="text-2xl font-bold text-sky-400">
                {formatCurrency(fees24h)}
              </p>
            </div>
          )}

          {/* APR */}
          {apr !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">APR</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatPercentage(apr)}
              </p>
            </div>
          )}

          {/* APY */}
          {apy !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">APY</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatPercentage(apy)}
              </p>
            </div>
          )}
        </div>

        {/* Reserves */}
        {(reserve0 !== undefined || reserve1 !== undefined) && (
          <div className="pt-4 border-t border-zinc-700 space-y-2">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Reserves</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reserve0 !== undefined && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-xs text-zinc-500">{token0Name}</span>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatNumber(reserve0)}
                  </p>
                </div>
              )}
              {reserve1 !== undefined && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-xs text-zinc-500">{token1Name}</span>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatNumber(reserve1)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          {pool.price !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Price:</span>
              <span className="text-white font-semibold">{formatCurrency(pool.price)}</span>
            </div>
          )}
          {totalSupply !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total Supply:</span>
              <span className="text-white font-semibold">{formatNumber(totalSupply)}</span>
            </div>
          )}
          {pool.stats?.totalStaked !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total Staked:</span>
              <span className="text-white font-semibold">{formatNumber(pool.stats.totalStaked)}</span>
            </div>
          )}
          {pool.pool_id && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Pool ID:</span>
              <code className="text-xs text-white font-mono">{pool.pool_id}</code>
            </div>
          )}
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
