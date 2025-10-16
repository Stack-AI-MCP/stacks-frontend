"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, Folder } from "lucide-react";
import { Markdown } from "@/components/markdown";

type ClarinetsGuideResponse = {
  success: boolean;
  markdown?: string;
  project_name?: string;
  template?: string;
  error?: string;
  message?: string;
};

export interface ClarinetsGuideProps {
  data: ClarinetsGuideResponse;
  isLoading: boolean;
}

export default function ClarinetsGuide({ data, isLoading }: ClarinetsGuideProps) {
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
          <CardTitle className="text-destructive">Failed to Generate Project</CardTitle>
          <CardDescription>{data.error || "Unable to generate Clarinet project guide"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-slate-400" />
          <div className="flex-1">
            <CardTitle className="text-xl">Clarinet Project Guide</CardTitle>
            <CardDescription className="text-zinc-300">
              {data.project_name && `Project: ${data.project_name}`}
              {data.template && ` • Template: ${data.template}`}
            </CardDescription>
          </div>
          {data.template && (
            <Badge variant="outline" className="text-slate-400 border-slate-500/30">
              {data.template}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-slate-500/20 prose prose-invert max-w-none">
          <Markdown>{data.markdown}</Markdown>
        </div>

        {data.message && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300">💡 {data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
