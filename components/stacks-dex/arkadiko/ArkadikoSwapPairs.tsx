"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume } from "@/lib/utils/format";
import { ArrowRightLeft } from "lucide-react";

// Arkadiko Swap Pair type based on getAllSwapPairs tool response
type ArkadikoSwapPair = {
  tokenX: string; // Like "wstx-token"
  tokenY: string; // Like "usda-token"
  name: string; // Like "wSTX/USDA"
  status: "active" | "inactive";
  reserve_x?: string;
  reserve_y?: string;
  total_supply?: string;
  fee_rate?: string;
  lp_token?: string;
  error?: string;
};

type ArkadikoSwapPairsResponse = {
  success: boolean;
  data: {
    pairs: ArkadikoSwapPair[];
    total_pairs: number;
    active_pairs: number;
    network: string;
    contract_address: string;
    contract_name: string;
  };
  error?: string;
  message?: string;
};

export interface ArkadikoSwapPairsProps {
  data: ArkadikoSwapPairsResponse;
  isLoading: boolean;
}

export default function ArkadikoSwapPairs({ data, isLoading }: ArkadikoSwapPairsProps) {
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

  if (!data.success || !data.data?.pairs) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Arkadiko Pairs</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko swap pair information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { pairs, total_pairs, active_pairs, network } = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg">Arkadiko Swap Pairs</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {active_pairs} active
            </Badge>
            <Badge variant="outline">
              {total_pairs} total
            </Badge>
          </div>
        </div>
        <CardDescription>
          Available swap pairs on Arkadiko DEX ({network})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Reserve X</TableHead>
                <TableHead className="text-right">Reserve Y</TableHead>
                <TableHead className="text-right">Total Supply</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No swap pairs available
                  </TableCell>
                </TableRow>
              ) : (
                pairs.map((pair, index) => {
                  const [token0, token1] = pair.name.split('/');
                  const reserveX = pair.reserve_x ? parseFloat(pair.reserve_x) : 0;
                  const reserveY = pair.reserve_y ? parseFloat(pair.reserve_y) : 0;
                  const totalSupply = pair.total_supply ? parseFloat(pair.total_supply) : 0;

                  return (
                    <TableRow key={`arkadiko-pair-${index}`} className={pair.status === "inactive" ? "opacity-50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">{token0}</span>
                          <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                          <span className="text-blue-400">{token1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pair.status === "active" && reserveX > 0
                          ? formatVolume(reserveX / 1e8) // Adjust for decimals
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pair.status === "active" && reserveY > 0
                          ? formatVolume(reserveY / 1e8) // Adjust for decimals
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pair.status === "active" && totalSupply > 0
                          ? formatVolume(totalSupply / 1e8) // Adjust for decimals
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={pair.status === "active" ? "default" : "secondary"}
                          className={pair.status === "active" ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {pair.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Additional Info */}
        {data.message && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
