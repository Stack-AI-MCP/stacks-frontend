'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ExternalLink, Clock, Hash } from 'lucide-react';

type Event = {
  event_index: number;
  event_type: string;
  tx_id: string;
  contract_log?: {
    contract_id: string;
    topic: string;
    value: any;
  };
  stx_transfer_event?: {
    sender: string;
    recipient: string;
    amount: string;
  };
  asset?: {
    asset_id: string;
    value: string;
  };
};

type EventListData = {
  success: boolean;
  data?: {
    results?: Event[];
    limit?: number;
    offset?: number;
    total?: number;
  };
  error?: string;
};

export default function EventList({
  data,
  isLoading = false
}: {
  data: EventListData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Events</CardTitle>
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

  if (!data.success || !data.data?.results) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Events Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load events'}</p>
        </CardContent>
      </Card>
    );
  }

  const events = data.data.results;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatSTX = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${(num / 1e6).toFixed(6)} STX`;
  };

  const getEventTypeColor = (type: string) => {
    if (type.includes('transfer')) return 'bg-blue-500/20 text-blue-400';
    if (type.includes('mint')) return 'bg-green-500/20 text-green-400';
    if (type.includes('burn')) return 'bg-red-500/20 text-red-400';
    if (type.includes('log')) return 'bg-purple-500/20 text-purple-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Events
          </div>
          {data.data.total && (
            <span className="text-sm font-normal text-zinc-400">
              {data.data.total} total
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={`${event.tx_id}-${event.event_index}`}
              className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        #{event.event_index}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://explorer.hiro.so/txid/${event.tx_id}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-zinc-700 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                </a>
              </div>

              <div className="space-y-2 text-sm">
                {/* STX Transfer Event */}
                {event.stx_transfer_event && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">From:</span>
                      <code className="text-xs font-mono text-white">
                        {shortenAddress(event.stx_transfer_event.sender)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">To:</span>
                      <code className="text-xs font-mono text-white">
                        {shortenAddress(event.stx_transfer_event.recipient)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Amount:</span>
                      <span className="text-white font-semibold">
                        {formatSTX(event.stx_transfer_event.amount)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contract Log Event */}
                {event.contract_log && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Contract:</span>
                      <code className="text-xs font-mono text-white">
                        {shortenAddress(event.contract_log.contract_id)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Topic:</span>
                      <span className="text-white text-xs">
                        {event.contract_log.topic}
                      </span>
                    </div>
                    {event.contract_log.value && (
                      <div className="mt-2 pt-2 border-t border-zinc-700">
                        <p className="text-xs text-zinc-500 mb-1">Value:</p>
                        <code className="text-xs text-zinc-400 break-all block">
                          {JSON.stringify(event.contract_log.value, null, 2)}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {/* Asset Event */}
                {event.asset && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Asset:</span>
                      <code className="text-xs font-mono text-white">
                        {shortenAddress(event.asset.asset_id)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Value:</span>
                      <span className="text-white">{event.asset.value}</span>
                    </div>
                  </div>
                )}

                {/* Transaction Hash */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                  <span className="text-zinc-400">TX Hash:</span>
                  <code className="text-xs font-mono text-white">
                    {shortenAddress(event.tx_id)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.data.total && data.data.total > events.length && (
          <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">
              Showing {events.length} of {data.data.total} events
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
