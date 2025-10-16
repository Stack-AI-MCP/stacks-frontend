'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Transaction = {
  tx_id: string;
  tx_type: string;
  nonce?: number;
  fee_rate: string;
  sender_address?: string;  // Hiro API format
  sender?: string;           // MCP server format
  sponsored?: boolean;
  post_condition_mode?: string;
  block_height: number;
  burn_block_time?: number;
  burn_block_time_iso?: string;  // Hiro API format
  block_time?: string;            // MCP server format
  canonical?: boolean;
  tx_status: string;
  tx_result?: {
    repr: string;
  };
  events?: any[];
  recipient?: string;
  amount?: string;
  memo?: string;
};

type TransactionHistoryData = {
  success: boolean;
  data?: {
    address?: string;
    results?: Transaction[];
    limit?: number;
    offset?: number;
    total?: number;
  };
  error?: string;
};

export default function TransactionHistory({
  data,
  isLoading = false,
  address
}: {
  data: TransactionHistoryData;
  isLoading?: boolean;
  address?: string;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-zinc-800 p-4 rounded-lg space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.results || data.data.results.length === 0) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Transaction History Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load transaction history'}</p>
        </CardContent>
      </Card>
    );
  }

  const transactions = data.data.results;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatSTX = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${(num / 1e6).toFixed(6)} STX`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-sky-500/20 text-sky-400';
      case 'abort_by_response':
      case 'abort_by_post_condition':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTxTypeIcon = (txType: string, senderAddr?: string) => {
    if (senderAddr && address && senderAddr.toLowerCase() === address?.toLowerCase()) {
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    }
    return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
  };

  const getTimestamp = (tx: Transaction): string => {
    // Try burn_block_time_iso first (Hiro API format)
    if (tx.burn_block_time_iso) {
      return new Date(tx.burn_block_time_iso).toLocaleString();
    }
    // Try block_time (MCP server format)
    if (tx.block_time) {
      return new Date(tx.block_time).toLocaleString();
    }
    // Fallback to burn_block_time as Unix timestamp
    if (tx.burn_block_time) {
      return new Date(tx.burn_block_time * 1000).toLocaleString();
    }
    return 'Unknown';
  };

  const getSenderAddress = (tx: Transaction): string => {
    return tx.sender_address || tx.sender || 'Unknown';
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction History</span>
          {data.data?.total && (
            <span className="text-sm font-normal text-zinc-400">
              {data.data.total} total
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx) => {
            const senderAddr = getSenderAddress(tx);
            return (
            <div
              key={tx.tx_id}
              className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTxTypeIcon(tx.tx_type, senderAddr)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white capitalize">
                        {tx.tx_type.replace(/_/g, ' ')}
                      </span>
                      <Badge className={getStatusColor(tx.tx_status)}>
                        {tx.tx_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Block #{tx.block_height.toLocaleString()}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://explorer.hiro.so/txid/${tx.tx_id}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-zinc-700 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                </a>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Hash:</span>
                  <code className="text-xs font-mono text-white">
                    {shortenAddress(tx.tx_id)}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">From:</span>
                  <code className="text-xs font-mono text-white">
                    {shortenAddress(senderAddr)}
                  </code>
                </div>

                {tx.recipient && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">To:</span>
                    <code className="text-xs font-mono text-white">
                      {shortenAddress(tx.recipient)}
                    </code>
                  </div>
                )}

                {tx.amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-white">{tx.amount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Fee:</span>
                  <span className="text-white">{formatSTX(tx.fee_rate)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Time:</span>
                  <span className="text-white text-xs">
                    {getTimestamp(tx)}
                  </span>
                </div>

                {tx.nonce !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Nonce:</span>
                    <span className="text-white">{tx.nonce}</span>
                  </div>
                )}

                {tx.sponsored && (
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    Sponsored
                  </Badge>
                )}
              </div>
            </div>
          );
          })}
        </div>

        {data.data?.total && data.data.total > transactions.length && (
          <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">
              Showing {transactions.length} of {data.data.total} transactions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
