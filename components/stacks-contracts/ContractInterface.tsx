"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode, Code2, Variable, Info } from "lucide-react";

// Contract Interface Response (from /v2/contracts/interface)
type ContractFunction = {
  name: string;
  access: string;
  args: Array<{
    name: string;
    type: string;
  }>;
  outputs: {
    type: string;
  };
};

type ContractVariable = {
  name: string;
  type: string;
  access: string;
};

type ContractInterfaceData = {
  functions: ContractFunction[];
  variables: ContractVariable[];
  maps?: Array<{
    name: string;
    key: string;
    value: string;
  }>;
  fungible_tokens?: Array<{
    name: string;
  }>;
  non_fungible_tokens?: Array<{
    name: string;
    type: string;
  }>;
};

type ContractInfoResponse = {
  success: boolean;
  data?: ContractInterfaceData;
  error?: string;
  message?: string;
};

export interface ContractInterfaceProps {
  data: ContractInfoResponse;
  isLoading: boolean;
}

export default function ContractInterface({ data, isLoading }: ContractInterfaceProps) {
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
          <CardTitle className="text-destructive">Failed to Load Contract</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve contract information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const contract = data.data;

  const getAccessBadgeColor = (access: string) => {
    switch (access) {
      case "public":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "private":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "read_only":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileCode className="w-6 h-6 text-violet-400" />
          <CardTitle className="text-xl">Contract Interface</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Clarity smart contract functions and variables
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-violet-500/20 text-center">
            <div className="text-3xl font-bold text-violet-400">{contract.functions?.length || 0}</div>
            <div className="text-xs text-zinc-400 mt-1">Functions</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-violet-500/20 text-center">
            <div className="text-3xl font-bold text-violet-400">{contract.variables?.length || 0}</div>
            <div className="text-xs text-zinc-400 mt-1">Variables</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-violet-500/20 text-center">
            <div className="text-3xl font-bold text-violet-400">{contract.maps?.length || 0}</div>
            <div className="text-xs text-zinc-400 mt-1">Maps</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-violet-500/20 text-center">
            <div className="text-3xl font-bold text-violet-400">
              {(contract.fungible_tokens?.length || 0) + (contract.non_fungible_tokens?.length || 0)}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Tokens</div>
          </div>
        </div>

        {/* Functions */}
        {contract.functions && contract.functions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-violet-400" />
              <span className="text-lg font-semibold text-white">Functions</span>
              <Badge variant="outline" className="ml-auto">{contract.functions.length}</Badge>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contract.functions.map((fn, idx) => (
                <div key={idx} className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 hover:border-violet-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-violet-400">{fn.name}</code>
                    <Badge variant="outline" className={getAccessBadgeColor(fn.access)}>
                      {fn.access}
                    </Badge>
                  </div>
                  {fn.args && fn.args.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-xs text-zinc-500">Arguments:</span>
                      <div className="space-y-1">
                        {fn.args.map((arg, argIdx) => (
                          <div key={argIdx} className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary" className="text-xs">{arg.name}</Badge>
                            <span className="text-zinc-400">{arg.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {fn.outputs && (
                    <div className="mt-2">
                      <span className="text-xs text-zinc-500">Returns: </span>
                      <span className="text-xs text-white font-mono">{fn.outputs.type}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variables */}
        {contract.variables && contract.variables.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Variable className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-white">Variables</span>
              <Badge variant="outline" className="ml-auto">{contract.variables.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {contract.variables.map((variable, idx) => (
                <div key={idx} className="bg-zinc-900/50 p-3 rounded-lg border border-slate-500/20">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-blue-400">{variable.name}</code>
                    <Badge variant="outline" className={`${getAccessBadgeColor(variable.access)} text-xs`}>
                      {variable.access}
                    </Badge>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{variable.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tokens */}
        {((contract.fungible_tokens && contract.fungible_tokens.length > 0) ||
          (contract.non_fungible_tokens && contract.non_fungible_tokens.length > 0)) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-amber-300 font-semibold">Token Definitions</span>
            </div>
            <div className="space-y-2">
              {contract.fungible_tokens?.map((token, idx) => (
                <div key={idx} className="text-xs text-amber-300">
                  ✓ Fungible Token: {token.name}
                </div>
              ))}
              {contract.non_fungible_tokens?.map((token, idx) => (
                <div key={idx} className="text-xs text-amber-300">
                  ✓ Non-Fungible Token: {token.name} ({token.type})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              💡 Public functions can be called by anyone
            </p>
            <p className="text-xs text-blue-300">
              💡 Read-only functions don't modify state
            </p>
            <p className="text-xs text-blue-300">
              💡 Private functions are only callable within the contract
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
            <p className="text-sm text-violet-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
