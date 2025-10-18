"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";

type Collection = {
  id: string;
  slug: string;
  title: string;
  cover_url?: string;
  floor?: string;
  volume?: string;
  verified?: boolean;
};

type CollectionTrending = {
  collection_id: string;
  current_trades_count: number;
  current_usd_volume: string;
  current_volume: string;
  previous_trades_count: number;
  previous_usd_volume: string;
  previous_volume: string;
  collection: Collection;
};

type TrendingCollectionsResponse = {
  success: boolean;
  trending: CollectionTrending[];
  period: string;
  trending_by: string;
  error?: string;
};

export interface TrendingCollectionsProps {
  data: TrendingCollectionsResponse;
  isLoading: boolean;
}

export default function TrendingCollections({ data, isLoading }: TrendingCollectionsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.trending) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Trending Collections</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve trending collections"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const trending = data.trending;

  const calculateChange = (current: string, previous: string): number => {
    const curr = parseFloat(current);
    const prev = parseFloat(previous);
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trending Collections</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
              {data.period.replace('days_', '')} days
            </Badge>
            <Badge variant="outline">
              By {data.trending_by.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <CardDescription>Top performing NFT collections on Stacks</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Trades</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No trending collections found
                  </TableCell>
                </TableRow>
              ) : (
                trending.map((item, index) => {
                  const volumeChange = calculateChange(item.current_usd_volume, item.previous_usd_volume);
                  const isPositive = volumeChange > 0;

                  return (
                    <TableRow key={item.collection_id}>
                      <TableCell className="font-bold text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.collection.cover_url && (
                            <img
                              src={item.collection.cover_url}
                              alt={item.collection.title}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.collection.title}</span>
                            {item.collection.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatVolume(parseFloat(item.current_usd_volume))}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.current_trades_count.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-mono font-medium">
                            {Math.abs(volumeChange).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
