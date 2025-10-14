"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

export interface LendingInfoProps {
  data: {
    success: boolean;
    data?: {
      txId?: string;
      protocol?: string;
      action?: string;
      borrowDetails?: {
        amount?: string | number;
        collateral?: string | number;
        healthFactor?: string | number;
      };
      depositDetails?: {
        amount?: string | number;
        apy?: string | number;
      };
      vaultDetails?: {
        vaultId?: string;
        collateral?: string | number;
        debt?: string | number;
        collateralRatio?: string | number;
      };
      explorerUrl?: string;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function LendingInfo({ data, isLoading }: LendingInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
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
          <CardTitle className="text-destructive">Operation Failed</CardTitle>
          <CardDescription>{data.error || "Unable to complete lending operation"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    txId,
    protocol,
    action,
    borrowDetails,
    depositDetails,
    vaultDetails,
    explorerUrl
  } = data.data;

  const formatNumber = (num: string | number | undefined): string => {
    if (!num) return "0";
    const value = typeof num === "string" ? parseFloat(num) : num;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getHealthFactorColor = (healthFactor: string | number | undefined) => {
    if (!healthFactor) return "text-muted-foreground";
    const value = typeof healthFactor === "string" ? parseFloat(healthFactor) : healthFactor;
    if (value >= 2) return "text-green-600";
    if (value >= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getCollateralRatioColor = (ratio: string | number | undefined) => {
    if (!ratio) return "text-muted-foreground";
    const value = typeof ratio === "string" ? parseFloat(ratio) : ratio;
    if (value >= 200) return "text-green-600";
    if (value >= 150) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {protocol || "Lending Protocol"} - {action || "Operation"}
          </CardTitle>
          <Badge variant="default" className="bg-green-600">Success</Badge>
        </div>
        <CardDescription>Transaction submitted successfully</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Borrow Details */}
        {borrowDetails && (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Borrowed Amount:</span>
              <span className="font-mono font-semibold">{formatNumber(borrowDetails.amount)}</span>
            </div>

            {borrowDetails.collateral && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Collateral:</span>
                <span className="font-mono font-semibold">{formatNumber(borrowDetails.collateral)}</span>
              </div>
            )}

            {borrowDetails.healthFactor && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Health Factor:</span>
                <span className={`font-mono font-semibold ${getHealthFactorColor(borrowDetails.healthFactor)}`}>
                  {formatNumber(borrowDetails.healthFactor)}
                </span>
              </div>
            )}

            {borrowDetails.healthFactor && parseFloat(borrowDetails.healthFactor.toString()) < 1.5 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Warning: Low health factor. Your position may be liquidated if collateral value drops.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Deposit Details */}
        {depositDetails && (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Deposited Amount:</span>
              <span className="font-mono font-semibold">{formatNumber(depositDetails.amount)}</span>
            </div>

            {depositDetails.apy && (
              <div className="flex justify-between items-center py-2 px-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-muted-foreground">Current APY:</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-mono font-semibold text-green-600">
                    {formatNumber(depositDetails.apy)}%
                  </span>
                </div>
              </div>
            )}

            <Alert className="border-green-600 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your deposit is now earning yield. Interest accrues every block.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Vault Details */}
        {vaultDetails && (
          <div className="space-y-3">
            {vaultDetails.vaultId && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Vault ID:</span>
                <span className="font-mono font-semibold">{vaultDetails.vaultId}</span>
              </div>
            )}

            {vaultDetails.collateral && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total Collateral:</span>
                <span className="font-mono font-semibold">{formatNumber(vaultDetails.collateral)} STX</span>
              </div>
            )}

            {vaultDetails.debt && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total Debt:</span>
                <span className="font-mono font-semibold">{formatNumber(vaultDetails.debt)} USDA</span>
              </div>
            )}

            {vaultDetails.collateralRatio && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Collateral Ratio:</span>
                <span className={`font-mono font-semibold ${getCollateralRatioColor(vaultDetails.collateralRatio)}`}>
                  {formatNumber(vaultDetails.collateralRatio)}%
                </span>
              </div>
            )}

            {vaultDetails.collateralRatio && parseFloat(vaultDetails.collateralRatio.toString()) < 150 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Critical: Collateralization ratio below 150%. Add more collateral or repay debt to avoid liquidation.
                </AlertDescription>
              </Alert>
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
