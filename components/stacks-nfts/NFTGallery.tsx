'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

type NFTAsset = {
  asset_identifier: string;
  value: {
    repr: string;
    hex: string;
  };
  block_height: number;
  tx_id: string;
};

type NFTGalleryData = {
  success: boolean;
  data?: {
    results?: NFTAsset[];
    limit?: number;
    offset?: number;
    total?: number;
  };
  error?: string;
};

export default function NFTGallery({
  data,
  isLoading = false
}: {
  data: NFTGalleryData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>NFT Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                <div className="w-full h-32 bg-zinc-700 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.results) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">NFT Gallery Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load NFT holdings'}</p>
        </CardContent>
      </Card>
    );
  }

  const nfts = data.data.results;

  // Generate color based on asset identifier
  const generateColor = (identifier: string) => {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const parseAssetIdentifier = (identifier: string) => {
    const parts = identifier.split('::');
    if (parts.length >= 2) {
      return {
        contract: parts[0],
        assetName: parts[1],
        tokenId: parts[2] || ''
      };
    }
    return { contract: identifier, assetName: '', tokenId: '' };
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          NFT Holdings
          <span className="text-sm font-normal text-zinc-400">
            {nfts.length} {nfts.length === 1 ? 'NFT' : 'NFTs'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {nfts.map((nft, index) => {
            const { contract, assetName, tokenId } = parseAssetIdentifier(nft.asset_identifier);
            const color = generateColor(nft.asset_identifier);

            return (
              <div
                key={nft.asset_identifier + index}
                className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors"
              >
                {/* NFT Preview */}
                <div
                  className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <ImageIcon className="w-6 h-6 text-white/80" />
                  </div>
                </div>

                {/* NFT Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {assetName || 'Unknown NFT'}
                      </h3>
                      {tokenId && (
                        <p className="text-sm text-zinc-400">
                          #{tokenId}
                        </p>
                      )}
                    </div>
                    <a
                      href={`https://explorer.hiro.so/txid/${nft.tx_id}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-zinc-700 rounded ml-2 transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                    </a>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-700">
                    <p className="text-xs text-zinc-500 mb-1">Contract:</p>
                    <code className="text-xs text-zinc-400 break-all block">
                      {contract.slice(0, 10)}...{contract.slice(-8)}
                    </code>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Block:</span>
                    <span className="text-zinc-400">#{nft.block_height.toLocaleString()}</span>
                  </div>

                  {nft.value?.repr && (
                    <div className="mt-2">
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                        {nft.value.repr.length > 20
                          ? nft.value.repr.slice(0, 20) + '...'
                          : nft.value.repr}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {data.data.total && data.data.total > nfts.length && (
          <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">
              Showing {nfts.length} of {data.data.total} NFTs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
