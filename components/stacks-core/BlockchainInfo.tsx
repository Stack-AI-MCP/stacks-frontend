"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Blocks, Clock, Hash } from "lucide-react";

export interface BlockchainInfoProps {
  data: {
    success: boolean;
    data?: {
      blockInfo?: {
        height?: number;
        hash?: string;
        timestamp?: number;
        txCount?: number;
        miner?: string;
        burnBlock?: number;
      };
      transactionInfo?: {
        txId?: string;
        status?: string;
        txType?: string;
        sender?: string;
        fee?: string | number;
        blockHeight?: number;
        burnBlockTime?: number;
      };
      networkInfo?: {
        networkId?: string;
        chainId?: number;
        peerVersion?: number;
        poxConsensus?: string;
        burnBlockHeight?: number;
        stableBlockHeight?: number;
      };
    };
    error?: string;
  };
  isLoading: boolean;
}

export default function BlockchainInfo({ data, isLoading }: BlockchainInfoProps) {
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
          <CardTitle className="text-destructive">Failed to Load Data</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve blockchain information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { blockInfo, transactionInfo, networkInfo } = data.data;

  const formatDate = (timestamp: number | undefined): string => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatHash = (hash: string | undefined): string => {
    if (!hash) return "Unknown";
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "success":
      case "confirmed":
        return <Badge variant="default" className="bg-green-600">Confirmed</Badge>;
      case "pending":
        return <Badge variant="default" className="animate-pulse">Pending</Badge>;
      case "failed":
      case "aborted":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {blockInfo && <Blocks className="h-5 w-5" />}
            {transactionInfo && <Activity className="h-5 w-5" />}
            {networkInfo && <Hash className="h-5 w-5" />}
            {blockInfo ? "Block Information" : transactionInfo ? "Transaction Details" : "Network Status"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Block Information */}
        {blockInfo && (
          <div className="space-y-3">
            {blockInfo.height && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Block Height:</span>
                <span className="font-mono font-semibold">{blockInfo.height.toLocaleString()}</span>
              </div>
            )}

            {blockInfo.hash && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Block Hash:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {blockInfo.hash}
                </div>
              </div>
            )}

            {blockInfo.timestamp && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timestamp:
                </span>
                <span className="font-mono text-sm">{formatDate(blockInfo.timestamp)}</span>
              </div>
            )}

            {blockInfo.txCount !== undefined && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Transactions:</span>
                <span className="font-mono font-semibold">{blockInfo.txCount}</span>
              </div>
            )}

            {blockInfo.miner && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Miner:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {blockInfo.miner}
                </div>
              </div>
            )}

            {blockInfo.burnBlock && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Bitcoin Block:</span>
                <span className="font-mono font-semibold">{blockInfo.burnBlock.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Transaction Information */}
        {transactionInfo && (
          <div className="space-y-3">
            {transactionInfo.txId && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Transaction ID:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {transactionInfo.txId}
                </div>
              </div>
            )}

            {transactionInfo.status && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadge(transactionInfo.status)}
              </div>
            )}

            {transactionInfo.txType && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary">{transactionInfo.txType}</Badge>
              </div>
            )}

            {transactionInfo.sender && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Sender:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {transactionInfo.sender}
                </div>
              </div>
            )}

            {transactionInfo.fee && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Transaction Fee:</span>
                <span className="font-mono font-semibold">{transactionInfo.fee} STX</span>
              </div>
            )}

            {transactionInfo.blockHeight && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Block Height:</span>
                <span className="font-mono font-semibold">{transactionInfo.blockHeight.toLocaleString()}</span>
              </div>
            )}

            {transactionInfo.burnBlockTime && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time:
                </span>
                <span className="font-mono text-sm">{formatDate(transactionInfo.burnBlockTime)}</span>
              </div>
            )}
          </div>
        )}

        {/* Network Information */}
        {networkInfo && (
          <div className="space-y-3">
            {networkInfo.networkId && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Network:</span>
                <Badge variant="default">{networkInfo.networkId}</Badge>
              </div>
            )}

            {networkInfo.burnBlockHeight && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Bitcoin Block Height:</span>
                <span className="font-mono font-semibold">{networkInfo.burnBlockHeight.toLocaleString()}</span>
              </div>
            )}

            {networkInfo.stableBlockHeight && (
              <div className="flex justify-between items-center py-2 px-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Stable Block Height:</span>
                <span className="font-mono font-semibold">{networkInfo.stableBlockHeight.toLocaleString()}</span>
              </div>
            )}

            {networkInfo.poxConsensus && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">PoX Consensus:</span>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {networkInfo.poxConsensus}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explorer Links */}
        {(blockInfo?.hash || transactionInfo?.txId) && (
          <a
            href={
              blockInfo?.hash
                ? `https://explorer.stacks.co/block/${blockInfo.hash}?chain=mainnet`
                : `https://explorer.stacks.co/txid/${transactionInfo?.txId}?chain=mainnet`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 underline pt-4 border-t"
          >
            View on Stacks Explorer →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
