"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Unlock, Info, TrendingUp, Activity } from "lucide-react";

// Stacking Status Query Response
type StackingStatusData = {
  address: string;
  network: string;
  isStacking: boolean;
  locked: {
    amount: string;
    amountMicroStx: string | number;
    unlock_height: number;
  };
  pox: {
    current_cycle: number;
    next_cycle_in_blocks: number;
    min_threshold_ustx: string | number;
  } | null;
};

type StackingStatusResponse = {
  success: boolean;
  data?: StackingStatusData;
  error?: string;
  message?: string;
};

export interface StackingStatusProps {
  data: StackingStatusResponse;
  isLoading: boolean;
}

export default function StackingStatus({ data, isLoading }: StackingStatusProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Query Failed</CardTitle>
          <CardDescription>{data.error || "Unable to get stacking status"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { address, network, isStacking, locked, pox } = data.data;

  const formatNumber = (value: string | number): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          {isStacking ? (
            <Lock className="w-6 h-6 text-cyan-400" />
          ) : (
            <Unlock className="w-6 h-6 text-zinc-400" />
          )}
          <CardTitle className="text-xl">Stacking Status</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Current stacking state for address
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Address */}
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Address</span>
          <code className="text-xs text-white font-mono break-all">
            {address}
          </code>
        </div>

        {/* Network Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {network}
          </Badge>
        </div>

        {/* Stacking State */}
        <div className={`border rounded-lg p-4 ${isStacking ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-zinc-900/50 border-slate-500/20'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Activity className={`w-5 h-5 ${isStacking ? 'text-cyan-400' : 'text-zinc-400'}`} />
            <span className={`text-sm font-semibold ${isStacking ? 'text-cyan-300' : 'text-zinc-400'}`}>
              {isStacking ? "Currently Stacking" : "Not Stacking"}
            </span>
          </div>

          {isStacking ? (
            <div className="space-y-3">
              {/* Locked Amount */}
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Locked Amount</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">
                    {locked.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-500">In microSTX</span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {formatNumber(locked.amountMicroStx)} µSTX
                  </span>
                </div>
              </div>

              {/* Unlock Height */}
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-slate-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Unlock Height</span>
                  <span className="text-xs text-white font-mono">
                    Block #{formatNumber(locked.unlock_height)}
                  </span>
                </div>
              </div>

              {/* PoX Information */}
              {pox && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-blue-300 font-semibold">PoX Network Info</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Current Cycle</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                        Cycle #{pox.current_cycle}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Next Cycle In</span>
                      <span className="text-xs text-white font-mono">
                        {formatNumber(pox.next_cycle_in_blocks)} blocks
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Min Threshold</span>
                      <span className="text-xs text-white font-mono">
                        {formatNumber(parseInt(pox.min_threshold_ustx.toString()) / 1_000_000)} STX
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">
              This address does not have any STX locked for stacking.
            </p>
          )}
        </div>

        {/* Info Box */}
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300 text-sm">
            <div className="space-y-1 mt-2">
              <p>• Stacking locks STX tokens to earn Bitcoin rewards</p>
              <p>• Locked tokens cannot be transferred until unlock height</p>
              <p>• Rewards are paid in BTC at the end of each cycle</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Success Message */}
        {data.message && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-sm text-cyan-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
