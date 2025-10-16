"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Info, AlertTriangle, Code } from "lucide-react";
import TransactionWrapper, { TransactionData } from "@/components/transactions/TransactionWrapper";

// Contract Deployment Transaction Response
type ContractDeploymentTransaction = {
  type: "contract_deploy";
  from: string;
  contractName: string;
  codeBody: string;
  clarityVersion: number;
  network: string;
  fee?: string;
  comment?: string;
  deployedContractId: string;
  explorerUrlTemplate?: string;
};

type ContractDeploymentResponse = {
  success: boolean;
  transaction?: ContractDeploymentTransaction;
  deployedContractId?: string;
  instructions?: string[];
  warnings?: string[];
  error?: string;
  message?: string;
};

export interface ContractDeploymentProps {
  data: ContractDeploymentResponse;
  isLoading: boolean;
}

export default function ContractDeployment({ data, isLoading }: ContractDeploymentProps) {
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
          <CardTitle className="text-destructive">Deployment Failed</CardTitle>
          <CardDescription>{data.error || "Unable to prepare contract deployment"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transaction = data.transaction;

  if (!transaction) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Response</CardTitle>
          <CardDescription>Transaction data is missing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const codeLines = transaction.codeBody.split('\n').length;
  const codeSize = new Blob([transaction.codeBody]).size;

  // Prepare transaction data for wrapper
  const transactionData: TransactionData = {
    type: "contract_deploy",
    name: transaction.contractName,
    code: transaction.codeBody,
    clarityVersion: transaction.clarityVersion,
  };

  return (
    <TransactionWrapper
      transactionData={transactionData}
      network={transaction.network === "mainnet" ? "mainnet" : "testnet"}
      buttonText="Sign & Deploy Contract"
      buttonGradient="from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
    >
      <Card className="w-full bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-6 h-6 text-orange-400" />
            <CardTitle className="text-xl">Deploy Contract</CardTitle>
          </div>
          <CardDescription className="text-zinc-300">
            Deploy {transaction.contractName} to the blockchain
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contract Name & ID */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-orange-500/20">
            <span className="text-sm text-zinc-400 mb-3 block">Contract Name</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-400 border-orange-500/30 text-lg px-4 py-1">
                  {transaction.contractName}
                </Badge>
              </div>
              <div className="mt-3">
                <span className="text-xs text-zinc-500 block mb-1">Will be deployed at:</span>
                <code className="text-sm text-orange-400 font-mono break-all">
                  {transaction.deployedContractId}
                </code>
              </div>
            </div>
          </div>

          {/* Code Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 text-center">
              <div className="text-2xl font-bold text-orange-400">{codeLines}</div>
              <div className="text-xs text-zinc-400 mt-1">Lines of Code</div>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 text-center">
              <div className="text-2xl font-bold text-orange-400">{Math.round(codeSize / 1024)}KB</div>
              <div className="text-xs text-zinc-400 mt-1">Contract Size</div>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20 text-center">
              <div className="text-2xl font-bold text-orange-400">v{transaction.clarityVersion}</div>
              <div className="text-xs text-zinc-400 mt-1">Clarity Version</div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-400">Contract Code Preview</span>
            </div>
            <div className="bg-black/30 p-3 rounded-lg max-h-48 overflow-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">
                {transaction.codeBody.split('\n').slice(0, 10).join('\n')}
                {codeLines > 10 && '\n...'}
              </pre>
            </div>
            {codeLines > 10 && (
              <p className="text-xs text-zinc-500 mt-2 text-center">
                Showing first 10 lines of {codeLines} total
              </p>
            )}
          </div>

          {/* Deployer Address */}
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Deployer Address</span>
            <code className="text-xs text-white font-mono break-all">
              {transaction.from}
            </code>
          </div>

          {/* Network & Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
              <span className="text-sm text-zinc-400 mb-2 block">Network</span>
              <Badge variant="outline" className="text-xs">
                {transaction.network}
              </Badge>
            </div>
            {transaction.fee && (
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
                <span className="text-sm text-zinc-400 mb-2 block">Fee</span>
                <span className="text-sm text-white font-mono">{transaction.fee} µSTX</span>
              </div>
            )}
          </div>

          {/* Warnings */}
          {data.warnings && data.warnings.length > 0 && (
            <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300 text-xs">
                <div className="space-y-1 mt-2">
                  {data.warnings.map((warning, idx) => (
                    <p key={idx}>{warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
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

          {/* Comment */}
          {transaction.comment && (
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-slate-500/20">
              <p className="text-sm text-zinc-300 italic">{transaction.comment}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-blue-300">
                💡 Contracts are immutable once deployed
              </p>
              <p className="text-xs text-blue-300">
                💡 Contract names cannot be reused on the same address
              </p>
              <p className="text-xs text-blue-300">
                💡 Always test on testnet before mainnet deployment
              </p>
              <p className="text-xs text-blue-300">
                💡 Consider a security audit for contracts handling value
              </p>
            </div>
          </div>

          {/* Success Message */}
          {data.message && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-sm text-orange-300">{data.message}</p>
            </div>
          )}

          {/* Deployment Ready Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 px-6 py-2">
              Deployment ready for signing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TransactionWrapper>
  );
}
