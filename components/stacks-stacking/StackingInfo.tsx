"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Lock, TrendingUp, CheckCircle } from "lucide-react";

export interface StackingInfoProps {
  data: {
    success: boolean;
    data?: {
      txId?: string;
      stackingDetails?: {
        amount?: string | number;
        lockPeriod?: number;
        poxAddress?: string;
        startCycle?: number;
        endCycle?: number;
        btcRewardEstimate?: string | number;
      };
      poxInfo?: {
        currentCycle?: number;
        nextCycle?: number;
        minThreshold?: string | number;
        totalStacked?: string | number;
        cycleLengthInBlocks?: number;
      };
      explorerUrl?: string;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function StackingInfo({ data, isLoading }: StackingInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Stacking Failed</CardTitle>
          <CardDescription>{data.error || "Unable to complete stacking operation"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { txId, stackingDetails, poxInfo, explorerUrl } = data.data;

  const formatSTX = (amount: string | number | undefined): string => {
    if (!amount) return "0";
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatBTC = (amount: string | number | undefined): string => {
    if (!amount) return "0";
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return value.toFixed(8);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5 text-cyan-600" />
            Stacking Operation
          </CardTitle>
          <Badge variant="default" className="bg-green-600">Success</Badge>
        </div>
        <CardDescription>STX successfully locked for Bitcoin rewards</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stacking Details */}
        {stackingDetails && (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 px-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <span className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Stacked Amount:
              </span>
              <span className="font-mono font-bold text-cyan-600 text-lg">
                {formatSTX(stackingDetails.amount)} STX
              </span>
            </div>

            {stackingDetails.lockPeriod && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Lock Period:</span>
                <span className="font-mono font-semibold">
                  {stackingDetails.lockPeriod} {stackingDetails.lockPeriod === 1 ? "cycle" : "cycles"}
                </span>
              </div>
            )}

            {stackingDetails.startCycle && stackingDetails.endCycle && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Lock Period:</span>
                <span className="font-mono font-semibold">
                  Cycle #{stackingDetails.startCycle} → #{stackingDetails.endCycle}
                </span>
              </div>
            )}

            {stackingDetails.poxAddress && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Bitcoin Reward Address:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {stackingDetails.poxAddress}
                </div>
              </div>
            )}

            {stackingDetails.btcRewardEstimate && (
              <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Estimated BTC Rewards:
                </span>
                <span className="font-mono font-bold text-green-600">
                  {formatBTC(stackingDetails.btcRewardEstimate)} BTC
                </span>
              </div>
            )}

            <Alert className="border-blue-600 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Your STX is now locked and earning Bitcoin rewards. Rewards will be sent to your BTC address at the end of each cycle.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* PoX Network Info */}
        {poxInfo && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm text-muted-foreground">PoX Network Status</h4>

            {poxInfo.currentCycle && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Current Cycle:</span>
                <span className="font-mono font-semibold">#{poxInfo.currentCycle}</span>
              </div>
            )}

            {poxInfo.minThreshold && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Min Threshold:</span>
                <span className="font-mono font-semibold">{formatSTX(poxInfo.minThreshold)} STX</span>
              </div>
            )}

            {poxInfo.totalStacked && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total Stacked:</span>
                <span className="font-mono font-semibold">{formatSTX(poxInfo.totalStacked)} STX</span>
              </div>
            )}

            {poxInfo.cycleLengthInBlocks && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Cycle Length:</span>
                <span className="font-mono font-semibold">{poxInfo.cycleLengthInBlocks.toLocaleString()} blocks</span>
              </div>
            )}
          </div>
        )}

        {/* Transaction ID */}
        {txId && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID:</span>
            </div>
            <div className="font-mono text-xs bg-muted p-2 rounded break-all">
              {txId}
            </div>
          </div>
        )}

        {/* Explorer Link */}
        {(explorerUrl || txId) && (
          <a
            href={explorerUrl || `https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View on Stacks Explorer →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
