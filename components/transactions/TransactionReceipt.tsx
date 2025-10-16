"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export interface TransactionReceiptProps {
  txId: string;
  network?: "mainnet" | "testnet";
  contractId?: string; // For contract deployments
  onClose?: () => void;
}

export default function TransactionReceipt({
  txId,
  network = "mainnet",
  contractId,
  onClose
}: TransactionReceiptProps) {
  const [copied, setCopied] = useState(false);

  const explorerUrl = `https://explorer.stacks.co/txid/${txId}?chain=${network}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stacks Transaction',
          text: `Transaction ID: ${txId}`,
          url: explorerUrl,
        });
      } catch (err) {
        // User cancelled or share not supported
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/30 shadow-lg">
      <CardContent className="p-8">
        {/* Success Icon & Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {/* Animated success circle */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-20 h-20 rounded-full bg-green-500/20" />
            </div>
            <div className="relative w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-green-300 mb-2">Transaction Successful!</h3>
          <p className="text-sm text-zinc-400 text-center">
            Your transaction has been broadcast to the Stacks blockchain
          </p>
        </div>

        {/* Transaction ID Section */}
        <div className="space-y-4">
          {/* TX ID Card */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">Transaction ID</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <code className="text-sm text-green-400 font-mono break-all block bg-black/30 p-3 rounded">
              {txId}
            </code>
          </div>

          {/* Contract ID (if deployment) */}
          {contractId && (
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/20">
              <span className="text-xs text-zinc-400 mb-2 block">Contract ID</span>
              <code className="text-sm text-orange-400 font-mono break-all block bg-black/30 p-3 rounded">
                {contractId}
              </code>
            </div>
          )}

          {/* Network Badge */}
          <div className="flex justify-center">
            <div className="bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1">
              <span className="text-xs text-green-300 font-medium">
                {network === 'mainnet' ? '🌐 Mainnet' : '🧪 Testnet'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => window.open(explorerUrl, '_blank')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Powered by footer */}
          <div className="text-center mt-6 pt-6 border-t border-green-500/10">
            <p className="text-xs text-zinc-500">
              Powered by{" "}
              <span className="text-green-400 font-semibold">Stacks Terminal</span>
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Bitcoin DeFi made simple
            </p>
          </div>

          {/* Info Note */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-300 text-center">
              ℹ️ Transaction confirmation may take 10-20 minutes on the Bitcoin blockchain
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
