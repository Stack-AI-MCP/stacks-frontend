"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Network } from "lucide-react";
import { Markdown } from "@/components/markdown";

type ProjectConfigResponse = {
  success: boolean;
  markdown?: string;
  network?: string;
  requirements?: string[];
  error?: string;
  message?: string;
};

export interface ProjectConfigProps {
  data: ProjectConfigResponse;
  isLoading: boolean;
}

export default function ProjectConfig({ data, isLoading }: ProjectConfigProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.markdown) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Generate Configuration</CardTitle>
          <CardDescription>{data.error || "Unable to generate project configuration"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getNetworkColor = (network?: string) => {
    switch (network) {
      case 'mainnet':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'testnet':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'devnet':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default:
        return 'text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          <div className="flex-1">
            <CardTitle className="text-xl">Project Configuration</CardTitle>
            <CardDescription className="text-zinc-300">
              {data.network && `Network: ${data.network}`}
              {data.requirements && data.requirements.length > 0 && ` • ${data.requirements.length} requirements`}
            </CardDescription>
          </div>
          {data.network && (
            <Badge variant="outline" className={getNetworkColor(data.network)}>
              <Network className="w-3 h-3 mr-1" />
              {data.network}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-cyan-500/20 prose prose-invert max-w-none">
          <Markdown>{data.markdown}</Markdown>
        </div>

        {data.requirements && data.requirements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-zinc-400">Requirements:</span>
            {data.requirements.map((req, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {req}
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
