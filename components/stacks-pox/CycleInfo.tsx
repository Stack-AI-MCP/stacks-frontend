'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Hash, Users, DollarSign } from 'lucide-react';

type CycleInfoData = {
  success: boolean;
  data?: {
    cycle_number?: number;
    block_height?: number;
    index_block_hash?: string;
    total_weight?: number;
    total_stacked?: string;
    total_signers?: number;
    // For multiple cycles
    results?: Array<{
      cycle_number: number;
      block_height: number;
      total_weight?: number;
      total_stacked?: string;
      total_signers?: number;
    }>;
    // For cycle signers
    signers?: Array<{
      signing_key: string;
      weight: number;
      stacked_amount?: string;
      weight_percent?: number;
    }>;
    limit?: number;
    offset?: number;
    total?: number;
  };
  error?: string;
  message?: string;
};

export default function CycleInfo({
  data,
  isLoading = false
}: {
  data: CycleInfoData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>PoX Cycle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
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
          <CardTitle className="text-red-400">PoX Cycle Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load PoX cycle information'}</p>
        </CardContent>
      </Card>
    );
  }

  const cycleData = data.data;

  const formatSTX = (value: string | number | undefined) => {
    if (value === undefined) return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const stx = num / 1e6;
    return `${stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} STX`;
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  // Render single cycle view
  if (cycleData.cycle_number !== undefined && !cycleData.results) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            PoX Cycle #{cycleData.cycle_number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Block Height</span>
              </div>
              <p className="text-2xl font-bold text-white">
                #{cycleData.block_height?.toLocaleString()}
              </p>
            </div>

            {cycleData.total_signers !== undefined && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-zinc-400">Total Signers</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {cycleData.total_signers.toLocaleString()}
                </p>
              </div>
            )}

            {cycleData.total_stacked && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-zinc-400">Total Stacked</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {formatSTX(cycleData.total_stacked)}
                </p>
              </div>
            )}

            {cycleData.total_weight !== undefined && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-zinc-400">Total Weight</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {cycleData.total_weight.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Block Hash */}
          {cycleData.index_block_hash && (
            <div className="pt-4 border-t border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Index Block Hash:</span>
                <code className="text-xs font-mono text-white">
                  {shortenHash(cycleData.index_block_hash)}
                </code>
              </div>
            </div>
          )}

          {/* Signers List */}
          {cycleData.signers && cycleData.signers.length > 0 && (
            <div className="pt-4 border-t border-zinc-700 space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Cycle Signers</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cycleData.signers.map((signer, index) => (
                  <div
                    key={signer.signing_key}
                    className="bg-zinc-800 p-3 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          #{index + 1}
                        </Badge>
                        <code className="text-xs font-mono text-zinc-400">
                          {shortenHash(signer.signing_key)}
                        </code>
                      </div>
                      {signer.weight_percent !== undefined && (
                        <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                          {signer.weight_percent.toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-zinc-500">Weight:</span>
                        <span className="text-white ml-1">{signer.weight.toLocaleString()}</span>
                      </div>
                      {signer.stacked_amount && (
                        <div>
                          <span className="text-zinc-500">Stacked:</span>
                          <span className="text-white ml-1">{formatSTX(signer.stacked_amount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.message && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-300">{data.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render multiple cycles view
  if (cycleData.results && cycleData.results.length > 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              PoX Cycles
            </div>
            {cycleData.total && (
              <span className="text-sm font-normal text-zinc-400">
                {cycleData.total} total
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cycleData.results.map((cycle) => (
              <div
                key={cycle.cycle_number}
                className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-750 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Cycle #{cycle.cycle_number}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Block #{cycle.block_height.toLocaleString()}
                    </p>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {cycle.total_signers !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-zinc-400">
                        {cycle.total_signers} signers
                      </span>
                    </div>
                  )}
                  {cycle.total_weight !== undefined && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-zinc-400">
                        {cycle.total_weight.toLocaleString()} weight
                      </span>
                    </div>
                  )}
                  {cycle.total_stacked && (
                    <div className="col-span-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white font-semibold">
                        {formatSTX(cycle.total_stacked)} stacked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {cycleData.total && cycleData.total > cycleData.results.length && (
            <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
              <p className="text-xs text-zinc-400">
                Showing {cycleData.results.length} of {cycleData.total} cycles
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
