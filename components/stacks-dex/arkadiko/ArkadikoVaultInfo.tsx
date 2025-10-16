"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "@/lib/utils/format";
import { Vault, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

// Arkadiko Vault Info type based on MCP server response
type ArkadikoVaultData = {
  vault_id: number;
  owner: string;
  collateral_type: string;
  collateral_amount: number;
  debt_amount: number;
  collateral_usd_value?: number;
  collateralization_ratio: number;
  liquidation_price?: number;
  liquidation_ratio: number;
  status: "active" | "liquidated" | "closed";
  last_updated?: string;
};

type ArkadikoVaultInfoResponse = {
  success: boolean;
  data: ArkadikoVaultData;
  error?: string;
  message?: string;
};

export interface ArkadikoVaultInfoProps {
  data: ArkadikoVaultInfoResponse;
  isLoading: boolean;
}

export default function ArkadikoVaultInfo({ data, isLoading }: ArkadikoVaultInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
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
          <CardTitle className="text-destructive">Failed to Load Vault Info</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko vault information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const vault = data.data;
  const ratio = vault.collateralization_ratio;

  // Determine health status
  const getHealthStatus = (ratio: number) => {
    if (ratio >= 200) return { label: "Safe", color: "text-green-400", bgColor: "bg-green-500/20" };
    if (ratio >= 150) return { label: "Moderate", color: "text-sky-400", bgColor: "bg-sky-500/20" };
    return { label: "At Risk", color: "text-red-400", bgColor: "bg-red-500/20" };
  };

  const health = getHealthStatus(ratio);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vault className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg">Arkadiko Vault #{vault.vault_id}</CardTitle>
          </div>
          <Badge
            variant={vault.status === "active" ? "default" : "secondary"}
            className={vault.status === "active" ? "bg-green-500/20 text-green-400" : ""}
          >
            {vault.status}
          </Badge>
        </div>
        <CardDescription>
          Collateral and debt information for vault owner
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Health Status */}
        <div className={`${health.bgColor} p-4 rounded-lg border ${health.bgColor.replace('bg-', 'border-')}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${health.color}`} />
            <span className="text-sm text-zinc-400">Vault Health</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${health.color}`}>{health.label}</span>
            <span className={`text-3xl font-bold ${health.color}`}>{ratio.toFixed(2)}%</span>
          </div>
        </div>

        {/* Collateral & Debt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">Collateral Amount</span>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {formatVolume(vault.collateral_amount / 1e8)}
            </p>
            <span className="text-xs text-zinc-500">{vault.collateral_type}</span>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400">Debt (USDA)</span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {formatVolume(vault.debt_amount / 1e8)}
            </p>
            <span className="text-xs text-zinc-500">USDA minted</span>
          </div>
        </div>

        {/* USD Value & Liquidation */}
        {(vault.collateral_usd_value || vault.liquidation_price) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vault.collateral_usd_value && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-zinc-400">Collateral USD Value</span>
                </div>
                <p className="text-xl font-bold text-green-400">
                  ${vault.collateral_usd_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
            {vault.liquidation_price && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-zinc-400">Liquidation Price</span>
                </div>
                <p className="text-xl font-bold text-red-400">
                  ${vault.liquidation_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Liquidation Ratio:</span>
            <span className="text-white font-semibold">{vault.liquidation_ratio}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Owner:</span>
            <code className="text-xs text-zinc-300 font-mono">{vault.owner.slice(0, 8)}...{vault.owner.slice(-6)}</code>
          </div>
          {vault.last_updated && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Last Updated:</span>
              <span className="text-xs text-zinc-400">{new Date(vault.last_updated).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Warning if at risk */}
        {ratio < 200 && ratio >= 150 && (
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3">
            <p className="text-xs text-sky-300">
              ⚠️ Collateralization ratio below 200%. Consider adding more collateral to maintain a safe buffer.
            </p>
          </div>
        )}
        {ratio < 150 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-xs text-red-300">
              ❌ DANGER: Ratio below {vault.liquidation_ratio}% - vault is at risk of liquidation!
            </p>
          </div>
        )}

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
