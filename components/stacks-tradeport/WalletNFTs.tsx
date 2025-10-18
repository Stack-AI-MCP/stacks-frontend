"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

type Collection = {
  id: string;
  title: string;
  slug: string;
  floor?: string;
};

type NFT = {
  id: string;
  token_id: string;
  name: string;
  media_url?: string;
  media_type?: string;
  ranking?: number;
  owner?: string;
  burned?: boolean;
  staked?: boolean;
  collection?: Collection;
  listings?: Array<{
    id: string;
    price: string;
  }>;
};

type WalletNFTsResponse = {
  success: boolean;
  wallet_address: string;
  nfts: NFT[];
  total: number;
  error?: string;
};

export interface WalletNFTsProps {
  data: WalletNFTsResponse;
  isLoading: boolean;
}

export default function WalletNFTs({ data, isLoading }: WalletNFTsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.nfts) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Wallet NFTs</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve wallet NFT holdings"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const nfts = data.nfts;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">NFT Holdings</CardTitle>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {data.total} NFTs
          </Badge>
        </div>
        <CardDescription className="font-mono text-xs">
          {data.wallet_address}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {nfts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No NFTs found in this wallet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts.map((nft) => {
              const hasListing = nft.listings && nft.listings.length > 0;
              const lowestListing = hasListing
                ? nft.listings?.reduce((min, listing) =>
                    parseFloat(listing.price) < parseFloat(min.price) ? listing : min
                  )
                : null;

              return (
                <div
                  key={nft.id}
                  className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* NFT Image */}
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {nft.media_url ? (
                      nft.media_type?.startsWith('video') ? (
                        <video
                          src={nft.media_url}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={nft.media_url}
                          alt={nft.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {nft.staked && (
                        <Badge variant="secondary" className="bg-orange-500/90 text-white text-xs">
                          Staked
                        </Badge>
                      )}
                      {hasListing && (
                        <Badge variant="secondary" className="bg-green-500/90 text-white text-xs">
                          Listed
                        </Badge>
                      )}
                    </div>

                    {/* Ranking Badge */}
                    {nft.ranking !== undefined && nft.ranking > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-purple-500/90 text-white">
                          #{nft.ranking}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* NFT Info */}
                  <div className="p-3 space-y-2">
                    <div>
                      <div className="font-medium truncate text-sm">{nft.name}</div>
                      {nft.collection && (
                        <div className="text-xs text-muted-foreground truncate">
                          {nft.collection.title}
                        </div>
                      )}
                    </div>

                    {/* Price Info */}
                    {lowestListing ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-muted-foreground">Listed:</span>
                        <span className="font-bold text-green-500">
                          {parseFloat(lowestListing.price).toFixed(2)} STX
                        </span>
                      </div>
                    ) : nft.collection?.floor ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-muted-foreground">Floor:</span>
                        <span className="font-mono text-sm">
                          {parseFloat(nft.collection.floor).toFixed(2)} STX
                        </span>
                      </div>
                    ) : null}

                    {/* View on TradePort */}
                    {nft.collection && (
                      <a
                        href={`https://tradeport.xyz/stacks/collections/${nft.collection.slug}/${nft.token_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
