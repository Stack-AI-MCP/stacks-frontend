"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, AlertCircle, Info, Shield } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// NFT Transfer Transaction Response
type NFTTransferTransactionData = {
  transaction: {
    type: "contract_call";
    from: string;
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: Array<{
      type: string;
      value: string;
    }>;
    postConditions: Array<{
      type: string;
      address: string;
      assetInfo: {
        contractAddress: string;
        contractName: string;
        assetName: string;
      };
      assetId: string;
      condition: string;
    }>;
    network: string;
    comment?: string;
  };
  details: {
    nft: string;
    tokenId: string;
    from: string;
    to: string;
  };
  instructions: string[];
  warnings: string[];
  message?: string;
};

type NFTTransferResponse = {
  success: boolean;
  transaction?: NFTTransferTransactionData["transaction"];
  details?: NFTTransferTransactionData["details"];
  instructions?: string[];
  warnings?: string[];
  error?: string;
  message?: string;
};

export interface NFTTransferProps {
  data: NFTTransferResponse;
  isLoading: boolean;
}

export default function NFTTransfer({ data, isLoading }: NFTTransferProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Transaction Failed</CardTitle>
          <CardDescription>{data.error || "Unable to prepare NFT transfer"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction;
  const details = data.details;

  if (!transaction || !details) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Response</CardTitle>
          <CardDescription>Transaction data is missing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Extract token ID from function args
  const tokenIdArg = transaction.functionArgs?.find(arg => arg.type === "uint");
  const tokenId = tokenIdArg?.value || details.tokenId;

  // Prepare transaction data for wrapper
  const transactionData: TransactionData = {
    type: "contract_call",
    contractAddress: transaction.contractAddress,
    contractName: transaction.contractName,
    functionName: transaction.functionName,
    functionArgs: transaction.functionArgs,
  };

  return (
    <TransactionWrapper
      transactionData={transactionData}
      network={transaction.network === "mainnet" ? "mainnet" : "testnet"}
      buttonText="Sign & Transfer NFT"
      buttonGradient="from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Card className="w-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-xl">Transfer NFT</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Ready to transfer {transaction.contractName} #{tokenId}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NFT Details */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-purple-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">NFT Contract</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                  {transaction.contractName}
                </Badge>
                <span className="text-lg font-bold text-purple-400">
                  #{tokenId}
                </span>
              </div>
              <code className="text-xs text-zinc-500 block mt-2">
                {details.nft}
              </code>
            </div>
          </div>

          {/* Transfer Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">From (Owner)</span>
              <code className="text-xs text-white font-mono break-all">
                {details.from}
              </code>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">To (Recipient)</span>
              <code className="text-xs text-white font-mono break-all">
                {details.to}
              </code>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {transaction.network}
            </Badge>
          </div>

          {/* Post Conditions */}
          {transaction.postConditions && transaction.postConditions.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300 font-semibold">Post-Condition Protection</span>
              </div>
              <div className="space-y-2">
                {transaction.postConditions.map((pc, idx) => (
                  <div key={idx} className="text-xs text-green-300">
                    ✓ Ensures NFT #{pc.assetId} from {pc.assetInfo.contractName} is {pc.condition}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {data.instructions && data.instructions.length > 0 && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-sm">
                <div className="space-y-1 mt-2">
                  {data.instructions.map((instruction, idx) => (
                    <p key={idx}>{instruction}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {data.warnings && data.warnings.length > 0 && (
            <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300 text-xs">
                <div className="space-y-1 mt-2">
                  {data.warnings.map((warning, idx) => (
                    <p key={idx}>{warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Transaction fees will be calculated by your wallet
              </p>
              <p className="text-xs text-blue-300">
                💡 Post-conditions protect you from sending the wrong NFT
              </p>
              <p className="text-xs text-blue-300">
                💡 Verify the recipient address carefully before confirming
              </p>
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-sm text-purple-300">{data.message}</p>
            </div>
          )}

          {/* Transaction Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 px-6 py-2">
              Transaction ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
