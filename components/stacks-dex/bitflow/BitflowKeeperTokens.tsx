"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Coins } from "lucide-react";

// BitFlow Keeper Token type from SDK
type BitflowKeeperToken = {
  id: string;
  symbol: string;
  name?: string;
  [key: string]: any;
};

type BitflowKeeperTokensResponse = {
  success: boolean;
  data: BitflowKeeperToken[];
  error?: string;
  message?: string;
};

export interface BitflowKeeperTokensProps {
  data: BitflowKeeperTokensResponse;
  isLoading: boolean;
}

export default function BitflowKeeperTokens({ data, isLoading }: BitflowKeeperTokensProps) {
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
          <CardTitle className="text-destructive">Failed to Load Keeper Tokens</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve BitFlow Keeper tokens"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tokens = data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/5 to-sky-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-lg">BitFlow Keeper Tokens</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
            {tokens.length} tokens
          </Badge>
        </div>
        <CardDescription>
          Tokens available for automated DCA and scheduled swaps
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
          <p className="text-xs text-cyan-300">
            💡 Keeper system allows you to set up automated Dollar-Cost Averaging (DCA) and scheduled swaps for these tokens
          </p>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No Keeper tokens available
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="text-white font-semibold">{token.symbol}</span>
                          {token.name && <div className="text-xs text-zinc-500">{token.name}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-zinc-400 font-mono">{token.id}</code>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-xs text-cyan-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
