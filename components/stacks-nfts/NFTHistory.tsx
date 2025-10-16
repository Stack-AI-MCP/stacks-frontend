"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ExternalLink, ArrowRight, Sparkles } from "lucide-react";

// NFT History Event Response
type NFTHistoryEvent = {
  sender?: string;
  recipient?: string;
  event_index: number;
  event_type: string;
  tx_id: string;
  tx_index: number;
  block_height: number;
  asset_event_type?: string;
  value?: {
    repr: string;
    hex: string;
  };
};

type NFTHistoryData = {
  limit: number;
  offset: number;
  total: number;
  results: NFTHistoryEvent[];
};

type NFTHistoryResponse = {
  success: boolean;
  data?: NFTHistoryData;
  error?: string;
  message?: string;
};

export interface NFTHistoryProps {
  data: NFTHistoryResponse;
  isLoading: boolean;
}

export default function NFTHistory({ data, isLoading }: NFTHistoryProps) {
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
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load NFT History</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve NFT transfer history"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const history = data.data;
  const events = history.results || [];

  const getEventIcon = (eventType: string) => {
    if (eventType === "mint" || eventType === "nft_mint_event") {
      return <Sparkles className="w-5 h-5 text-green-400" />;
    }
    return <ArrowRight className="w-5 h-5 text-blue-400" />;
  };

  const getEventColor = (eventType: string) => {
    if (eventType === "mint" || eventType === "nft_mint_event") {
      return "bg-green-500/20 text-green-400 border-green-500/20";
    }
    return "bg-blue-500/20 text-blue-400 border-blue-500/20";
  };

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-400" />
          <CardTitle className="text-xl">NFT Transfer History</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          {history.total} total {history.total === 1 ? 'event' : 'events'} - Showing {events.length}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-zinc-900/50 p-8 rounded-lg border border-slate-500/20 text-center">
            <History className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No transfer history found for this NFT</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => {
              const explorerUrl = `https://explorer.hiro.so/txid/${event.tx_id}?chain=mainnet`;

              return (
                <div
                  key={`${event.tx_id}-${event.event_index}`}
                  className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 hover:border-indigo-500/30 transition-colors"
                >
                  {/* Event Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.event_type)}
                      <Badge variant="secondary" className={getEventColor(event.event_type)}>
                        {event.event_type.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {event.sender && (
                      <div>
                        <span className="text-xs text-zinc-500 block mb-1">From:</span>
                        <code className="text-xs text-white font-mono break-all">
                          {event.sender}
                        </code>
                      </div>
                    )}

                    {event.recipient && (
                      <div>
                        <span className="text-xs text-zinc-500 block mb-1">To:</span>
                        <code className="text-xs text-white font-mono break-all">
                          {event.recipient}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Transaction Info */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-700">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Block #{event.block_height.toLocaleString()}</span>
                      <span>Event #{event.event_index}</span>
                    </div>

                    {event.value?.repr && (
                      <Badge variant="outline" className="text-xs">
                        {event.value.repr.length > 20
                          ? event.value.repr.slice(0, 20) + '...'
                          : event.value.repr}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Info */}
        {history.total > events.length && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-300">
              Showing {events.length} of {history.total} events
              {history.offset > 0 && ` (offset: ${history.offset})`}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Mint events show when the NFT was created
            </p>
            <p className="text-xs text-blue-300">
              💡 Transfer events track ownership changes on the blockchain
            </p>
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
