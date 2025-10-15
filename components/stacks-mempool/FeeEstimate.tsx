'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Activity, Zap } from 'lucide-react';

type FeeEstimateData = {
  success: boolean;
  data?: {
    cost_scalar_change_by_byte?: number;
    estimated_cost_scalar?: number;
    estimations?: Array<{
      fee_rate?: number;
      fee?: number;
    }>;
    cost_scalar?: {
      low: number;
      middle: number;
      high: number;
    };
    // Transformed format from getFeeEstimates tool
    low?: number;
    medium?: number;
    high?: number;
    estimatedCost?: number;
  };
  error?: string;
};

export default function FeeEstimate({
  data,
  isLoading = false
}: {
  data: FeeEstimateData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Fee Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
          <CardTitle className="text-red-400">Fee Estimate Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load fee estimates'}</p>
        </CardContent>
      </Card>
    );
  }

  const feeData = data.data;

  const formatSTX = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const stx = num / 1e6; // STX has 6 decimals
    return `${stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} STX`;
  };

  // Handle transformed data structure from getFeeEstimates tool
  // Tool returns: {low, medium, high, estimatedCost}
  const hasTransformedFees = feeData.low !== undefined && feeData.medium !== undefined && feeData.high !== undefined;

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Fee Estimates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Scalar Options */}
        {(feeData.cost_scalar || hasTransformedFees) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Fee Tiers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Low</Badge>
                  <span className="text-xs text-zinc-500">Slower</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {(hasTransformedFees ? (feeData.low ?? 0) : (feeData.cost_scalar?.low ?? 0)).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Cost Scalar</p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Medium</Badge>
                  <span className="text-xs text-zinc-500">Average</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {(hasTransformedFees ? (feeData.medium ?? 0) : (feeData.cost_scalar?.middle ?? 0)).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Cost Scalar</p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500/20 text-red-400 text-xs">High</Badge>
                  <span className="text-xs text-zinc-500">Faster</span>
                </div>
                <p className="text-2xl font-bold text-red-400">
                  {(hasTransformedFees ? (feeData.high ?? 0) : (feeData.cost_scalar?.high ?? 0)).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Cost Scalar</p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Estimations */}
        {feeData.estimations && feeData.estimations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Detailed Estimates</span>
            </div>

            <div className="space-y-2">
              {feeData.estimations.map((estimate, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      Option {index + 1}
                    </Badge>
                    {estimate.fee_rate && (
                      <span className="text-sm text-zinc-400">
                        Rate: {estimate.fee_rate}
                      </span>
                    )}
                  </div>
                  {estimate.fee && (
                    <span className="text-lg font-semibold text-white">
                      {formatSTX(estimate.fee)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scalar Change Info */}
        {(feeData.cost_scalar_change_by_byte !== undefined || feeData.estimated_cost_scalar !== undefined) && (
          <div className="pt-4 border-t border-zinc-700 space-y-2">
            {feeData.estimated_cost_scalar !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Estimated Cost Scalar:</span>
                <span className="text-white font-semibold">
                  {feeData.estimated_cost_scalar.toLocaleString()}
                </span>
              </div>
            )}
            {feeData.cost_scalar_change_by_byte !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Change per Byte:</span>
                <span className="text-white font-semibold">
                  {feeData.cost_scalar_change_by_byte}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Info Badge */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            💡 Higher cost scalars result in faster transaction confirmation times.
            Choose based on your urgency and budget.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
