"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp } from "lucide-react";

export interface TokenBalancesProps {
  data: {
    success: boolean;
    data?: {
      address?: string;
      stx?: {
        balance?: string | number;
        locked?: string | number;
        unlockHeight?: number;
      };
      fungibleTokens?: Array<{
        contractId?: string;
        name?: string;
        symbol?: string;
        balance?: string | number;
        decimals?: number;
        imageUrl?: string;
      }>;
      nonFungibleTokens?: Array<{
        contractId?: string;
        name?: string;
        count?: number;
        imageUrl?: string;
      }>;
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function TokenBalances({ data, isLoading }: TokenBalancesProps) {
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
          <CardTitle className="text-destructive">Failed to Load Balances</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve token balances"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { address, stx, fungibleTokens, nonFungibleTokens } = data.data;

  const formatBalance = (balance: string | number | undefined, decimals: number = 6): string => {
    if (!balance) return "0";
    const value = typeof balance === "string" ? parseFloat(balance) : balance;
    const divisor = Math.pow(10, decimals);
    return (value / divisor).toLocaleString(undefined, { maximumFractionDigits: decimals });
  };

  const totalTokens = (fungibleTokens?.length || 0) + (nonFungibleTokens?.length || 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balances
          </CardTitle>
          <Badge variant="secondary">{totalTokens + 1} assets</Badge>
        </div>
        {address && (
          <CardDescription className="font-mono text-xs truncate">{address}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* STX Balance */}
        {stx && (
          <div className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">STX</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Stacks</span>
                  <span className="text-xs text-muted-foreground">STX</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-lg font-bold">
                  {formatBalance(stx.balance, 6)}
                </span>
                {stx.locked && parseFloat(stx.locked.toString()) > 0 && (
                  <div className="flex items-center gap-1 text-xs text-cyan-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{formatBalance(stx.locked, 6)} locked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fungible Tokens (SIP-010) */}
        {fungibleTokens && fungibleTokens.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Fungible Tokens</h4>
            {fungibleTokens.map((token, index) => (
              <div
                key={token.contractId || index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {token.imageUrl ? (
                    <img
                      src={token.imageUrl}
                      alt={token.symbol || token.name || "Token"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {(token.symbol || token.name || "?").substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{token.name || "Unknown Token"}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {token.symbol || token.contractId?.split(".")[1] || ""}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-semibold">
                  {formatBalance(token.balance, token.decimals || 6)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Non-Fungible Tokens (SIP-009) */}
        {nonFungibleTokens && nonFungibleTokens.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">NFT Collections</h4>
            {nonFungibleTokens.map((nft, index) => (
              <div
                key={nft.contractId || index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {nft.imageUrl ? (
                    <img
                      src={nft.imageUrl}
                      alt={nft.name || "NFT"}
                      className="h-8 w-8 rounded"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {(nft.name || "NFT").substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{nft.name || "Unknown NFT"}</span>
                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                      {nft.contractId}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{nft.count || 0} NFTs</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!fungibleTokens || fungibleTokens.length === 0) &&
         (!nonFungibleTokens || nonFungibleTokens.length === 0) &&
         !stx && (
          <div className="text-center text-muted-foreground py-8">
            No tokens found for this address
          </div>
        )}
      </CardContent>
    </Card>
  );
}
