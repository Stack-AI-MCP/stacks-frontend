"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Info, Code, AlertCircle } from "lucide-react";

// Token Info Response
type TokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: number;
  total_supply?: string;
  token_uri?: string;
  description?: string;
  image_uri?: string;
  note?: string; // When metadata not available
};

type ContractInterface = {
  functions: Array<{
    name: string;
    access: string;
    args: Array<{
      name: string;
      type: string;
    }>;
    outputs: {
      type: string;
    };
  }>;
  variables: Array<{
    name: string;
    type: string;
    access: string;
  }>;
};

type TokenInfoData = {
  contractId: string;
  contractAddress: string;
  contractName: string;
  network: string;
  metadata: TokenMetadata;
  interface: ContractInterface;
};

type TokenInfoResponse = {
  success: boolean;
  data?: TokenInfoData;
  error?: string;
  message?: string;
};

export interface TokenInfoProps {
  data: TokenInfoResponse;
  isLoading: boolean;
}

export default function TokenInfo({ data, isLoading }: TokenInfoProps) {
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
          <CardTitle className="text-destructive">Failed to Load Token Info</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve token information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const token = data.data;
  const metadata = token.metadata;
  const hasMetadata = !metadata.note;

  return (
    <Card className="w-full bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-400" />
          <CardTitle className="text-xl">SIP-010 Token Info</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          {hasMetadata ? `${metadata.name} (${metadata.symbol})` : token.contractName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Token Metadata */}
        {hasMetadata ? (
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-amber-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Token Details</span>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Name:</span>
                <span className="text-lg font-bold text-amber-400">{metadata.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Symbol:</span>
                <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-lg">
                  {metadata.symbol}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Decimals:</span>
                <span className="text-white font-mono">{metadata.decimals}</span>
              </div>
              {metadata.total_supply && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Total Supply:</span>
                  <span className="text-white font-mono">{metadata.total_supply}</span>
                </div>
              )}
              {metadata.description && (
                <div className="pt-2 border-t border-zinc-700">
                  <span className="text-sm text-zinc-500 block mb-1">Description:</span>
                  <p className="text-xs text-white">{metadata.description}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300 text-sm">
              {metadata.note}
            </AlertDescription>
          </Alert>
        )}

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Contract Address</span>
            <code className="text-xs text-white font-mono break-all">
              {token.contractAddress}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Contract Name</span>
            <code className="text-xs text-white font-mono break-all">
              {token.contractName}
            </code>
          </div>
        </div>

        {/* Full Contract ID */}
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-amber-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Full Contract ID</span>
          <code className="text-sm text-amber-400 font-mono break-all">
            {token.contractId}
          </code>
        </div>

        {/* Network Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {token.network}
          </Badge>
        </div>

        {/* Contract Interface Summary */}
        {token.interface && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-blue-300 font-semibold">Contract Interface</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Functions:</span>
                <span className="text-2xl font-bold text-blue-400">
                  {token.interface.functions?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Variables:</span>
                <span className="text-2xl font-bold text-blue-400">
                  {token.interface.variables?.length || 0}
                </span>
              </div>
            </div>
            {token.interface.functions && token.interface.functions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <span className="text-xs text-zinc-500 block mb-2">Key Functions:</span>
                <div className="space-y-1">
                  {token.interface.functions.slice(0, 5).map((fn, idx) => (
                    <div key={idx} className="text-xs text-blue-300">
                      • {fn.name} ({fn.access})
                    </div>
                  ))}
                  {token.interface.functions.length > 5 && (
                    <div className="text-xs text-zinc-500 italic">
                      ... and {token.interface.functions.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 SIP-010 is the fungible token standard for Stacks
            </p>
            <p className="text-xs text-blue-300">
              💡 Decimals determine how the token amount is displayed (e.g., 6 decimals = divide by 1,000,000)
            </p>
            <p className="text-xs text-blue-300">
              💡 Common tokens: USDA (stablecoin), ALEX, DIKO (governance)
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-sm text-amber-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
