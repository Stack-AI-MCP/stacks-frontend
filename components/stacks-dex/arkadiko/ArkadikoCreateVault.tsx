"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vault, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Arkadiko Create Vault Transaction type
type ArkadikoCreateVaultData = {
  transaction: {
    type: "contract_call";
    from: string;
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: Array<{ type: string; value: string }>;
    network: "mainnet" | "testnet";
    comment: string;
  };
  details: {
    collateralType: string;
    collateralAmount: string;
    usdaToMint: string;
    collateralizationRatio: string;
    health: "Safe" | "Moderate" | "At Risk";
  };
  instructions?: string[];
  warnings?: string[];
  tips?: string[];
};

type ArkadikoCreateVaultResponse = {
  success: boolean;
  transaction?: ArkadikoCreateVaultData["transaction"];
  details?: ArkadikoCreateVaultData["details"];
  instructions?: string[];
  warnings?: string[];
  tips?: string[];
  message?: string;
  error?: string;
};

export interface ArkadikoCreateVaultProps {
  data: ArkadikoCreateVaultResponse;
  isLoading: boolean;
}

export default function ArkadikoCreateVault({ data, isLoading }: ArkadikoCreateVaultProps) {
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

  if (!data.success) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Create Vault Transaction</CardTitle>
          <CardDescription>{data.error || "Unable to prepare Arkadiko vault creation"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction;
  const details = data.details;

  if (!transaction || !details) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Response</CardTitle>
          <CardDescription>Transaction data is missing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Safe":
        return { color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/20" };
      case "Moderate":
        return { color: "text-sky-400", bgColor: "bg-sky-500/20", borderColor: "border-sky-500/20" };
      case "At Risk":
        return { color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/20" };
      default:
        return { color: "text-zinc-400", bgColor: "bg-zinc-500/20", borderColor: "border-zinc-500/20" };
    }
  };

  const healthStyle = getHealthColor(details.health);

  // Prepare transaction data for wrapper
  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper
      transactionData={transactionData}
      network={transaction.network === "mainnet" ? "mainnet" : "testnet"}
      buttonText="Sign & Create Vault"
      buttonGradient="from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
    >
      <Card className="w-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Vault className="w-6 h-6 text-pink-400" />
            <CardTitle className="text-xl">Create Arkadiko Vault</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Mint {details.usdaToMint} USDA with {details.collateralAmount} {details.collateralType}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Vault Health */}
          <div className={`${healthStyle.bgColor} p-4 rounded-lg border ${healthStyle.borderColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${healthStyle.color}`} />
            <span className="text-sm text-zinc-400">Vault Health</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${healthStyle.color}`}>{details.health}</span>
            <span className={`text-3xl font-bold ${healthStyle.color}`}>{details.collateralizationRatio}</span>
          </div>
        </div>

          {/* Vault Configuration */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Vault Configuration</span>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Collateral Type:</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-400">{details.collateralType}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Collateral Amount:</span>
                <span className="text-white font-mono">{details.collateralAmount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">USDA to Mint:</span>
                <span className="text-white font-mono">{details.usdaToMint}</span>
              </div>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Warnings */}
          {data.warnings && data.warnings.length > 0 && (
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-sky-400 mt-0.5" />
                <div className="space-y-1">
                  {data.warnings.map((warning, idx) => (
                    <p key={idx} className="text-xs text-sky-300">{warning}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {data.instructions && data.instructions.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  {data.instructions.map((instruction, idx) => (
                    <p key={idx} className="text-xs text-blue-300">{instruction}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          {data.tips && data.tips.length > 0 && (
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-pink-400 mt-0.5" />
                <div className="space-y-1">
                  {data.tips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-pink-300">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {data.message && (
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <p className="text-sm text-pink-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 px-6 py-2">
              Vault ready for creation
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
