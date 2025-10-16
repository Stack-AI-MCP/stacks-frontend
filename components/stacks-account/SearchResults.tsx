"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Blocks, User, Code, ExternalLink } from "lucide-react";

// Search Results Response
type SearchResultData = {
  found: boolean;
  result: {
    entity_type: string;
    entity_id: string;
    [key: string]: any;
  };
};

type SearchResultResponse = {
  success: boolean;
  data?: SearchResultData | {
    entity_type?: string;
    entity_id?: string;
    [key: string]: any;
  };
  error?: string;
  message?: string;
};

export interface SearchResultsProps {
  data: SearchResultResponse;
  isLoading: boolean;
}

export default function SearchResults({ data, isLoading }: SearchResultsProps) {
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
          <CardTitle className="text-destructive">Search Failed</CardTitle>
          <CardDescription>{data.error || "Unable to find the requested entity"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Handle both formats: { found, result } and direct entity response
  const entityData = 'result' in data.data && data.data.result
    ? data.data.result
    : data.data;

  const entityType = entityData.entity_type;
  const entityId = entityData.entity_id;

  const getIcon = () => {
    switch (entityType) {
      case 'tx_id':
      case 'mempool_tx_id':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'block_hash':
        return <Blocks className="w-6 h-6 text-green-400" />;
      case 'standard_address':
      case 'contract_address':
        return <User className="w-6 h-6 text-purple-400" />;
      case 'contract_id':
        return <Code className="w-6 h-6 text-orange-400" />;
      default:
        return <Search className="w-6 h-6 text-zinc-400" />;
    }
  };

  const getTypeColor = () => {
    switch (entityType) {
      case 'tx_id':
      case 'mempool_tx_id':
        return 'bg-blue-500/20 text-blue-400';
      case 'block_hash':
        return 'bg-green-500/20 text-green-400';
      case 'standard_address':
      case 'contract_address':
        return 'bg-purple-500/20 text-purple-400';
      case 'contract_id':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const getExplorerUrl = () => {
    const network = entityData.network || 'mainnet';
    const baseUrl = network === 'mainnet'
      ? 'https://explorer.hiro.so'
      : 'https://explorer.hiro.so';

    switch (entityType) {
      case 'tx_id':
      case 'mempool_tx_id':
        return `${baseUrl}/txid/${entityId}?chain=${network}`;
      case 'block_hash':
        return `${baseUrl}/block/${entityId}?chain=${network}`;
      case 'standard_address':
      case 'contract_address':
        return `${baseUrl}/address/${entityId}?chain=${network}`;
      case 'contract_id':
        return `${baseUrl}/txid/${entityId}?chain=${network}`;
      default:
        return null;
    }
  };

  const explorerUrl = getExplorerUrl();

  return (
    <Card className="w-full bg-gradient-to-br from-slate-500/5 to-zinc-500/5 border-slate-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-xl">Search Result</CardTitle>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View in Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        <CardDescription className="text-zinc-300">
          Found entity on Stacks blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Entity Type Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className={getTypeColor()}>
            {entityType?.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Entity ID */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-slate-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Entity ID</span>
          <code className="text-sm text-white font-mono break-all">
            {entityId}
          </code>
        </div>

        {/* Additional Data */}
        {Object.keys(entityData).length > 2 && (
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400 block mb-3">Additional Information</span>
            <div className="space-y-2">
              {Object.entries(entityData)
                .filter(([key]) => key !== 'entity_type' && key !== 'entity_id')
                .slice(0, 5)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-xs text-zinc-500 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-xs text-white font-mono max-w-xs truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Use the explorer link to view full details
            </p>
            {entityType === 'tx_id' && (
              <p className="text-xs text-blue-300">
                💡 Transaction IDs can be used to track transaction status
              </p>
            )}
            {entityType === 'block_hash' && (
              <p className="text-xs text-blue-300">
                💡 Block hashes uniquely identify blocks on the blockchain
              </p>
            )}
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
