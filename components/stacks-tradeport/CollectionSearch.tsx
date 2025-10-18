"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVolume } from "@/lib/utils/format";
import { ExternalLink, CheckCircle2 } from "lucide-react";

type Collection = {
  id: string;
  slug: string;
  semantic_slug?: string;
  title: string;
  supply?: number;
  floor?: string;
  volume?: string;
  usd_volume?: string;
  cover_url?: string;
  verified?: boolean;
};

type CollectionSearchResponse = {
  success: boolean;
  collections: Collection[];
  total: number;
  error?: string;
};

export interface CollectionSearchProps {
  data: CollectionSearchResponse;
  isLoading: boolean;
}

export default function CollectionSearch({ data, isLoading }: CollectionSearchProps) {
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
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.collections) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Search Collections</CardTitle>
          <CardDescription>{data.error || "Unable to search NFT collections"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const collections = data.collections;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">NFT Collections</CardTitle>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {data.total} found
          </Badge>
        </div>
        <CardDescription>Search results from TradePort marketplace</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead className="text-right">Supply</TableHead>
                <TableHead className="text-right">Floor</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No collections found
                  </TableCell>
                </TableRow>
              ) : (
                collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {collection.cover_url && (
                          <img
                            src={collection.cover_url}
                            alt={collection.title}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{collection.title}</span>
                            {collection.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <a
                            href={`https://tradeport.xyz/stacks/collections/${collection.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {collection.slug}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {collection.supply?.toLocaleString() || "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {collection.floor ? `${parseFloat(collection.floor).toFixed(2)} STX` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {collection.usd_volume ? formatVolume(parseFloat(collection.usd_volume)) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
