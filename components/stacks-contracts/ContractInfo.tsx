'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, ExternalLink, Hash, Code } from 'lucide-react';

type ContractInfoData = {
  success: boolean;
  data?: {
    contract_id?: string;
    tx_id?: string;
    canonical?: boolean;
    contract_type?: string;
    block_height?: number;
    source_code?: string;
    abi?: string;
    // For contract calls
    txid?: string;
    function_name?: string;
    arguments?: any[];
  };
  error?: string;
  message?: string;
};

export default function ContractInfo({
  data,
  isLoading = false
}: {
  data: ContractInfoData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Contract Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load contract information'}</p>
        </CardContent>
      </Card>
    );
  }

  const contract = data.data;

  const shortenString = (str: string, start = 10, end = 8) => {
    if (str.length <= start + end) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-purple-400" />
          Contract Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract ID / Transaction */}
        {contract.contract_id && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Contract ID</span>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg flex items-center justify-between">
              <code className="text-sm font-mono text-white break-all">
                {contract.contract_id}
              </code>
              <a
                href={`https://explorer.hiro.so/txid/${contract.tx_id}?chain=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-zinc-700 rounded ml-2 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
              </a>
            </div>
          </div>
        )}

        {/* Contract Call Info */}
        {contract.txid && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Transaction ID</span>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg flex items-center justify-between">
              <code className="text-sm font-mono text-white">
                {shortenString(contract.txid)}
              </code>
              <a
                href={`https://explorer.hiro.so/txid/${contract.txid}?chain=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-zinc-700 rounded ml-2 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
              </a>
            </div>
          </div>
        )}

        {/* Function Name */}
        {contract.function_name && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Function</span>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <code className="text-lg font-mono text-purple-400">
                {contract.function_name}
              </code>
            </div>
          </div>
        )}

        {/* Contract Type & Block Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contract.contract_type && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">Type</span>
              <p className="text-lg font-semibold text-white mt-1 capitalize">
                {contract.contract_type}
              </p>
            </div>
          )}

          {contract.block_height && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">Block Height</span>
              <p className="text-lg font-semibold text-white mt-1">
                #{contract.block_height.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Arguments (if any) */}
        {contract.arguments && contract.arguments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Arguments</span>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg space-y-2">
              {contract.arguments.map((arg: any, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs shrink-0">
                    {index}
                  </Badge>
                  <code className="text-sm text-zinc-300 break-all">
                    {JSON.stringify(arg, null, 2)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          {contract.canonical !== undefined && (
            <Badge className={contract.canonical ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
              {contract.canonical ? "Canonical" : "Non-Canonical"}
            </Badge>
          )}
          {data.success && (
            <Badge className="bg-green-500/20 text-green-400">Success</Badge>
          )}
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
