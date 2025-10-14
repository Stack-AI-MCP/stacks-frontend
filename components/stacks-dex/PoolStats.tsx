'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, DollarSign, BarChart3, Percent } from 'lucide-react';

type PoolStatsData = {
  success: boolean;
  data?: {
    pool_id?: string;
    pool_name?: string;
    token0?: string;
    token1?: string;
    tvl?: number;
    volume_24h?: number;
    volume_7d?: number;
    fees_24h?: number;
    apr?: number;
    apy?: number;
    liquidity?: number;
    price?: number;
    reserve0?: number;
    reserve1?: number;
    total_supply?: number;
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

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
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
        {(pool.token0 || pool.token1) && (
          <div className="flex items-center gap-2 justify-center">
            <Badge className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1">
              {pool.token0 || 'Token0'}
            </Badge>
            <span className="text-zinc-500">/</span>
            <Badge className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1">
              {pool.token1 || 'Token1'}
            </Badge>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TVL */}
          {pool.tvl !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Total Value Locked</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(pool.tvl)}
              </p>
            </div>
          )}

          {/* Liquidity */}
          {pool.liquidity !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Liquidity</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {formatCurrency(pool.liquidity)}
              </p>
            </div>
          )}

          {/* 24h Volume */}
          {pool.volume_24h !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">24h Volume</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {formatCurrency(pool.volume_24h)}
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
          {pool.fees_24h !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-400">24h Fees</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(pool.fees_24h)}
              </p>
            </div>
          )}

          {/* APR */}
          {pool.apr !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">APR</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatPercentage(pool.apr)}
              </p>
            </div>
          )}

          {/* APY */}
          {pool.apy !== undefined && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">APY</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatPercentage(pool.apy)}
              </p>
            </div>
          )}
        </div>

        {/* Reserves */}
        {(pool.reserve0 !== undefined || pool.reserve1 !== undefined) && (
          <div className="pt-4 border-t border-zinc-700 space-y-2">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Reserves</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pool.reserve0 !== undefined && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-xs text-zinc-500">{pool.token0 || 'Token0'}</span>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatNumber(pool.reserve0)}
                  </p>
                </div>
              )}
              {pool.reserve1 !== undefined && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-xs text-zinc-500">{pool.token1 || 'Token1'}</span>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatNumber(pool.reserve1)}
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
          {pool.total_supply !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total Supply:</span>
              <span className="text-white font-semibold">{formatNumber(pool.total_supply)}</span>
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
