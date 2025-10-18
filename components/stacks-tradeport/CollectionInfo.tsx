"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "@/lib/utils/format";
import { ExternalLink, CheckCircle2, Users, TrendingUp, DollarSign } from "lucide-react";
import { convertToPublicIPFS } from "@/lib/utils/ipfs";

type Collection = {
  id: string;
  slug: string;
  semantic_slug?: string;
  title: string;
  description?: string;
  supply?: number;
  floor?: string;
  volume?: string;
  usd_volume?: string;
  cover_url?: string;
  verified?: boolean;
  discord?: string;
  twitter?: string;
  website?: string;
};

type CollectionInfoResponse = {
  success: boolean;
  collection: Collection;
  error?: string;
};

export interface CollectionInfoProps {
  data: CollectionInfoResponse;
  isLoading: boolean;
}

export default function CollectionInfo({ data, isLoading }: CollectionInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.collection) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Collection</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve collection information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const collection = data.collection;

  return (
    <Card className="w-full">
      {/* Collection Banner */}
      {collection.cover_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={convertToPublicIPFS(collection.cover_url) || collection.cover_url}
            alt={collection.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">{collection.title}</CardTitle>
              {collection.verified && (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              )}
            </div>
            {collection.description && (
              <CardDescription className="text-base">
                {collection.description}
              </CardDescription>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 mt-4">
          {collection.website && (
            <a
              href={collection.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Website
            </a>
          )}
          {collection.twitter && (
            <a
              href={`https://twitter.com/${collection.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </a>
          )}
          {collection.discord && (
            <a
              href={collection.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              Discord
            </a>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Collection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              Supply
            </div>
            <div className="text-2xl font-bold">
              {collection.supply?.toLocaleString() || "-"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Floor Price
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {collection.floor ? `${parseFloat(collection.floor).toFixed(2)} STX` : "-"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              Volume
            </div>
            <div className="text-2xl font-bold">
              {collection.volume ? `${parseFloat(collection.volume).toFixed(2)} STX` : "-"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              USD Volume
            </div>
            <div className="text-2xl font-bold text-green-400">
              {collection.usd_volume ? formatVolume(parseFloat(collection.usd_volume)) : "-"}
            </div>
          </div>
        </div>

        {/* TradePort Link */}
        <div className="mt-6 pt-4 border-t">
          <a
            href={`https://tradeport.xyz/stacks/collections/${collection.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-2"
          >
            View on TradePort
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
