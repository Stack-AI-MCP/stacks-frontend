"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "@/lib/utils/format";
import { Info, ExternalLink, TrendingUp } from "lucide-react";

// Velar Token Details type based on API response from https://api.velar.co/tokens
type VelarTokenDetail = {
  symbol: string;
  name: string;
  contractAddress: string;
  imageUrl?: string;
  timestamp?: string;
  price: string | number;
  decimal: string;
  tokenDecimalNum: number;
  assetName: string;
  percent_change_24h: string | number;
  socialLinks?: {
    website?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  stats?: {
    tvl: number;
    volume: number;
    fees: number;
  };
};

type VelarTokenDetailsResponse = {
  success: boolean;
  data: VelarTokenDetail | VelarTokenDetail[];
  error?: string;
  message?: string;
};

export interface VelarTokenDetailsProps {
  data: VelarTokenDetailsResponse;
  isLoading: boolean;
}

export default function VelarTokenDetails({ data, isLoading }: VelarTokenDetailsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
          <CardTitle className="text-destructive">Failed to Load Token Details</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Velar token details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tokens = Array.isArray(data.data) ? data.data : [data.data];
  const token = tokens[0]; // Show details for first token if array

  const priceNum = typeof token.price === 'string' ? parseFloat(token.price) : token.price;
  const changeNum = typeof token.percent_change_24h === 'string' ? parseFloat(token.percent_change_24h) : token.percent_change_24h;
  const isPositive = changeNum > 0;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500/5 to-purple-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          {token.imageUrl && (
            <img src={token.imageUrl} alt={token.symbol} className="w-12 h-12 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{token.symbol}</CardTitle>
              <Badge variant="outline">{token.name}</Badge>
            </div>
            <CardDescription>{token.assetName}</CardDescription>
          </div>
          <Info className="w-5 h-5 text-blue-400" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Display */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-zinc-400">Current Price</span>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-white">
              ${priceNum.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: priceNum < 1 ? 8 : 2
              })}
            </p>
            <span className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{changeNum.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Token Stats */}
        {token.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">TVL</span>
              <p className="text-xl font-bold text-green-400 mt-1">
                ${token.stats.tvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">24h Volume</span>
              <p className="text-xl font-bold text-purple-400 mt-1">
                ${token.stats.volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">24h Fees</span>
              <p className="text-xl font-bold text-yellow-400 mt-1">
                ${token.stats.fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Contract Address:</span>
            <code className="text-xs text-zinc-300 font-mono">{token.contractAddress}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Decimals:</span>
            <span className="text-white font-semibold">{token.tokenDecimalNum.toLocaleString()}</span>
          </div>
          {token.timestamp && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Listed Since:</span>
              <span className="text-xs text-zinc-400">{new Date(token.timestamp).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {token.socialLinks && Object.values(token.socialLinks).some(link => link) && (
          <div className="pt-4 border-t border-zinc-700">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Community Links</h4>
            <div className="flex flex-wrap gap-2">
              {token.socialLinks.website && (
                <a href={token.socialLinks.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-xs bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Website
                </a>
              )}
              {token.socialLinks.twitter && (
                <a href={token.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-xs bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Twitter
                </a>
              )}
              {token.socialLinks.discord && (
                <a href={token.socialLinks.discord} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-xs bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Discord
                </a>
              )}
              {token.socialLinks.telegram && (
                <a href={token.socialLinks.telegram} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-xs bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Telegram
                </a>
              )}
            </div>
          </div>
        )}

        {data.message && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
