"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft } from "lucide-react";

// BitFlow Possible Swap type from SDK
type BitflowSwapOption = {
  tokenId: string;
  symbol?: string;
  [key: string]: any;
};

type BitflowPossibleSwapsResponse = {
  success: boolean;
  data: BitflowSwapOption[];
  error?: string;
  message?: string;
};

export interface BitflowPossibleSwapsProps {
  data: BitflowPossibleSwapsResponse;
  isLoading: boolean;
}

export default function BitflowPossibleSwaps({ data, isLoading }: BitflowPossibleSwapsProps) {
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
          <CardTitle className="text-destructive">Failed to Load Swap Options</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve possible swaps"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const swapOptions = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-lg">BitFlow Swap Options</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
            {swapOptions.length} options
          </Badge>
        </div>
        <CardDescription>
          Available tokens to swap to from selected token
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Token ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swapOptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No swap options available
                  </TableCell>
                </TableRow>
              ) : (
                swapOptions.map((option, idx) => (
                  <TableRow key={option.tokenId || idx}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                        <span className="text-white">
                          {option.symbol || option.tokenId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-zinc-400 font-mono">{option.tokenId}</code>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="mt-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-xs text-cyan-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
