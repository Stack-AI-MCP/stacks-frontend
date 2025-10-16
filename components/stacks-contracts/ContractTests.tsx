"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube, Shield, Box } from "lucide-react";
import { Markdown } from "@/components/markdown";

type ContractTestsResponse = {
  success: boolean;
  markdown?: string;
  contract_name?: string;
  test_type?: string;
  scenarios?: string[];
  error?: string;
  message?: string;
};

export interface ContractTestsProps {
  data: ContractTestsResponse;
  isLoading: boolean;
}

export default function ContractTests({ data, isLoading }: ContractTestsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.markdown) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Generate Tests</CardTitle>
          <CardDescription>{data.error || "Unable to generate contract tests"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getTestTypeIcon = (type?: string) => {
    switch (type) {
      case 'unit':
        return <Box className="w-6 h-6 text-green-400" />;
      case 'integration':
        return <TestTube className="w-6 h-6 text-blue-400" />;
      case 'security':
        return <Shield className="w-6 h-6 text-red-400" />;
      default:
        return <TestTube className="w-6 h-6 text-zinc-400" />;
    }
  };

  const getTestTypeColor = (type?: string) => {
    switch (type) {
      case 'unit':
        return 'text-green-400 border-green-500/30';
      case 'integration':
        return 'text-blue-400 border-blue-500/30';
      case 'security':
        return 'text-red-400 border-red-500/30';
      default:
        return 'text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getTestTypeIcon(data.test_type)}
          <div className="flex-1">
            <CardTitle className="text-xl">Contract Test Suite</CardTitle>
            <CardDescription className="text-zinc-300">
              {data.contract_name && `Contract: ${data.contract_name}`}
              {data.test_type && ` • Type: ${data.test_type}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {data.test_type && (
              <Badge variant="outline" className={getTestTypeColor(data.test_type)}>
                {data.test_type}
              </Badge>
            )}
            {data.scenarios && data.scenarios.length > 0 && (
              <Badge variant="outline" className="text-zinc-400 border-zinc-500/30">
                +{data.scenarios.length} scenarios
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-emerald-500/20 prose prose-invert max-w-none">
          <Markdown>{data.markdown}</Markdown>
        </div>

        {data.scenarios && data.scenarios.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-zinc-400">Custom Scenarios:</span>
            {data.scenarios.map((scenario, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {scenario}
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
