"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins } from "lucide-react";

// BitFlow Token type from SDK
type BitflowToken = {
  id: string;
  symbol: string;
  name?: string;
  contractAddress?: string;
  decimals?: number;
  [key: string]: any; // Allow additional SDK fields
};

type BitflowTokenListResponse = {
  success: boolean;
  data: BitflowToken[];
  error?: string;
  message?: string;
};

export interface BitflowTokenListProps {
  data: BitflowTokenListResponse;
  isLoading: boolean;
}

export default function BitflowTokenList({ data, isLoading }: BitflowTokenListProps) {
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
          <CardTitle className="text-destructive">Failed to Load Tokens</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve BitFlow tokens"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tokens = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-lg">BitFlow Available Tokens</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {tokens.length} tokens
          </Badge>
        </div>
        <CardDescription>
          Tokens available for trading on BitFlow DEX
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>ID</TableHead>
                {tokens.some(t => t.decimals) && <TableHead className="text-right">Decimals</TableHead>}
                {tokens.some(t => t.contractAddress) && <TableHead>Contract Address</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No tokens available
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span className="text-white font-semibold">{token.symbol}</span>
                        {token.name && <div className="text-xs text-zinc-500">{token.name}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-zinc-400 font-mono">{token.id}</code>
                    </TableCell>
                    {tokens.some(t => t.decimals) && (
                      <TableCell className="text-right">
                        {token.decimals !== undefined ? token.decimals : '-'}
                      </TableCell>
                    )}
                    {tokens.some(t => t.contractAddress) && (
                      <TableCell>
                        {token.contractAddress && (
                          <code className="text-xs text-zinc-400 font-mono">
                            {token.contractAddress.slice(0, 20)}...
                          </code>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <p className="text-xs text-orange-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
