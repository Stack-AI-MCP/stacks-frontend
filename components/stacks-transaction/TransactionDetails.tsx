"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, CheckCircle2, Clock, XCircle, FileCode } from "lucide-react";

// Transaction Details Response
type TransactionDetailsData = {
  tx_id: string;
  tx_status: string;
  tx_type: string;
  sender_address: string;
  fee_rate: string;
  nonce: number;
  block_height?: number;
  block_time_iso?: string;
  canonical?: boolean;
  // Token transfer specific
  recipient?: string;
  amount?: string;
  amountSTX?: string;
  memo?: string;
  // Contract call specific
  contract_id?: string;
  function_name?: string;
  function_args?: any[];
};

type TransactionDetailsResponse = {
  success: boolean;
  data?: TransactionDetailsData;
  error?: string;
  message?: string;
};

export interface TransactionDetailsProps {
  data: TransactionDetailsResponse;
  isLoading: boolean;
}

export default function TransactionDetails({ data, isLoading }: TransactionDetailsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load Transaction</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve transaction details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tx = data.data;

  const getStatusColor = () => {
    switch (tx.tx_status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      case "pending":
        return "bg-sky-500/20 text-sky-400 border-sky-500/20";
      case "failed":
      case "abort_by_response":
      case "abort_by_post_condition":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
    }
  };

  const getStatusIcon = () => {
    switch (tx.tx_status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-sky-400" />;
      case "failed":
      case "abort_by_response":
      case "abort_by_post_condition":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeIcon = () => {
    if (tx.tx_type === "token_transfer") {
      return <FileText className="w-6 h-6 text-purple-400" />;
    }
    if (tx.tx_type === "contract_call") {
      return <FileCode className="w-6 h-6 text-cyan-400" />;
    }
    return <FileText className="w-6 h-6 text-blue-400" />;
  };

  const explorerUrl = tx.tx_id
    ? `https://explorer.hiro.so/txid/${tx.tx_id}?chain=mainnet`
    : null;

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-xl">Transaction Details</CardTitle>
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
          {tx.tx_type.replace(/_/g, " ")} on Stacks blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-center gap-3">
          {getStatusIcon()}
          <Badge variant="secondary" className={getStatusColor()}>
            {tx.tx_status.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>

        {/* Transaction ID */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-purple-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Transaction ID</span>
          <code className="text-sm text-white font-mono break-all">
            {tx.tx_id}
          </code>
        </div>

        {/* Transaction Type Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {tx.tx_type.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Sender</span>
            <code className="text-xs text-white font-mono break-all">
              {tx.sender_address}
            </code>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Fee Rate</span>
            <p className="text-sm text-white font-mono">{tx.fee_rate}</p>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Nonce</span>
            <p className="text-sm text-white font-mono">{tx.nonce}</p>
          </div>

          {tx.block_height && (
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">Block Height</span>
              <p className="text-sm text-white font-mono">{tx.block_height.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Token Transfer Details */}
        {tx.tx_type === "token_transfer" && tx.recipient && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <span className="text-sm text-purple-300 block mb-3 font-semibold">Transfer Details</span>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs text-zinc-400">Recipient:</span>
                <code className="text-xs text-white font-mono max-w-xs break-all">
                  {tx.recipient}
                </code>
              </div>
              {tx.amountSTX && (
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-400">Amount:</span>
                  <span className="text-sm text-green-400 font-bold">
                    {tx.amountSTX}
                  </span>
                </div>
              )}
              {tx.memo && (
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-400">Memo:</span>
                  <span className="text-xs text-white max-w-xs break-all">
                    {tx.memo}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contract Call Details */}
        {tx.tx_type === "contract_call" && tx.contract_id && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <span className="text-sm text-cyan-300 block mb-3 font-semibold">Contract Call Details</span>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs text-zinc-400">Contract:</span>
                <code className="text-xs text-white font-mono max-w-xs break-all">
                  {tx.contract_id}
                </code>
              </div>
              {tx.function_name && (
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-400">Function:</span>
                  <span className="text-xs text-cyan-300 font-mono">
                    {tx.function_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Block Time */}
        {tx.block_time_iso && (
          <div className="bg-zinc-800 p-4 rounded-lg">
            <span className="text-sm text-zinc-400 block mb-2">Block Time</span>
            <p className="text-sm text-white">
              {new Date(tx.block_time_iso).toLocaleString()}
            </p>
          </div>
        )}

        {/* Canonical Status */}
        {tx.canonical !== undefined && (
          <div className="flex justify-center">
            <Badge variant={tx.canonical ? "default" : "secondary"} className="text-xs">
              {tx.canonical ? "Canonical" : "Non-canonical"}
            </Badge>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Use the explorer link to view full transaction details
            </p>
            {tx.tx_status === "pending" && (
              <p className="text-xs text-blue-300">
                💡 Pending transactions may take a few minutes to confirm
              </p>
            )}
            {tx.canonical === false && (
              <p className="text-xs text-blue-300">
                💡 Non-canonical transactions are on a microblock fork
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
