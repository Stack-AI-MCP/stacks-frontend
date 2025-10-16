"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode, Code2 } from "lucide-react";
import { Markdown } from "@/components/markdown";

type ClarityContractResponse = {
  success: boolean;
  markdown?: string;
  contract_name?: string;
  contract_type?: string;
  features?: string[];
  error?: string;
  message?: string;
};

export interface ClarityContractProps {
  data: ClarityContractResponse;
  isLoading: boolean;
}

export default function ClarityContract({ data, isLoading }: ClarityContractProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.markdown) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Generate Contract</CardTitle>
          <CardDescription>{data.error || "Unable to generate Clarity contract"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getContractTypeColor = (type?: string) => {
    switch (type) {
      case 'sip010-ft':
        return 'text-green-400 border-green-500/30';
      case 'sip009-nft':
        return 'text-purple-400 border-purple-500/30';
      case 'counter':
        return 'text-blue-400 border-blue-500/30';
      default:
        return 'text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileCode className="w-6 h-6 text-indigo-400" />
          <div className="flex-1">
            <CardTitle className="text-xl">Clarity Contract</CardTitle>
            <CardDescription className="text-zinc-300">
              {data.contract_name && `Contract: ${data.contract_name}`}
              {data.contract_type && ` • Type: ${data.contract_type}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {data.contract_type && (
              <Badge variant="outline" className={getContractTypeColor(data.contract_type)}>
                {data.contract_type}
              </Badge>
            )}
            {data.features && data.features.length > 0 && (
              <Badge variant="outline" className="text-zinc-400 border-zinc-500/30">
                +{data.features.length} features
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-indigo-500/20 prose prose-invert max-w-none">
          <Markdown>{data.markdown}</Markdown>
        </div>

        {data.features && data.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-zinc-400">Features:</span>
            {data.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {data.message && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300">💡 {data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
