"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Key, Shield } from "lucide-react";

// Charisma API Key type from API
type CharismaApiKey = {
  id: string;
  key?: string;
  name?: string;
  createdAt?: string;
  lastUsed?: string;
  permissions?: string[];
  status?: string;
  [key: string]: any;
};

type CharismaApiKeysResponse = {
  success: boolean;
  data: CharismaApiKey[];
  error?: string;
  message?: string;
};

export interface CharismaApiKeysProps {
  data: CharismaApiKeysResponse;
  isLoading: boolean;
}

export default function CharismaApiKeys({ data, isLoading }: CharismaApiKeysProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <CardTitle className="text-destructive">Failed to Load API Keys</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve API keys"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const apiKeys = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-lg">Charisma API Keys</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {apiKeys.length} keys
          </Badge>
        </div>
        <CardDescription>
          Manage API keys for automated trading
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <p className="text-xs text-sky-300">
              Keep your API keys secure. Never share them publicly.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No API keys found
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium text-white">
                      {apiKey.name || `API Key ${apiKey.id.slice(0, 8)}`}
                    </TableCell>
                    <TableCell>
                      {apiKey.key && (
                        <code className="text-xs text-zinc-400 font-mono">
                          {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                        </code>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-400">
                      {apiKey.createdAt ? new Date(apiKey.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-400">
                      {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      {apiKey.status && (
                        <Badge
                          variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                          className={apiKey.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}
                        >
                          {apiKey.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-xs text-purple-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
