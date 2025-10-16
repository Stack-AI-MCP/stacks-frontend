"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSignature, Info, Shield, AlertCircle, Layers } from "lucide-react";

// Structured Message Signing Request Response
type ClarityValue = {
  type: string;
  value: any;
};

type DomainInfo = {
  name: string;
  version: string;
  chainId: number;
};

type StructuredSignRequest = {
  type: "sign_structured_message";
  from: string;
  message: Record<string, ClarityValue>;
  domain: DomainInfo;
  network: string;
  comment?: string;
};

type StructuredMessageSignatureResponse = {
  success: boolean;
  signRequest?: StructuredSignRequest;
  domainInfo?: DomainInfo;
  messagePreview?: string;
  instructions?: string[];
  securityNotes?: string[];
  examples?: any;
  error?: string;
  message?: string;
};

export interface StructuredMessageSignatureProps {
  data: StructuredMessageSignatureResponse;
  isLoading: boolean;
}

export default function StructuredMessageSignature({ data, isLoading }: StructuredMessageSignatureProps) {
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
          <CardTitle className="text-destructive">Signature Request Failed</CardTitle>
          <CardDescription>{data.error || "Unable to prepare structured message signing"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const signRequest = data.signRequest;

  if (!signRequest) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Response</CardTitle>
          <CardDescription>Signature request data is missing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border-fuchsia-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSignature className="w-6 h-6 text-fuchsia-400" />
          <CardTitle className="text-xl">Sign Structured Message</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Type-safe message signing with domain separation
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Domain Information */}
        {data.domainInfo && (
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-fuchsia-400" />
              <span className="text-sm text-fuchsia-300 font-semibold">Domain</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Application:</span>
                <Badge variant="outline" className="text-fuchsia-400 border-fuchsia-500/30">
                  {data.domainInfo.name}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Version:</span>
                <span className="text-xs text-white font-mono">{data.domainInfo.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Chain ID:</span>
                <span className="text-xs text-white font-mono">{data.domainInfo.chainId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Structured Message Fields */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-fuchsia-500/20">
          <span className="text-sm text-zinc-400 mb-3 block">Structured Message</span>
          <div className="space-y-3">
            {signRequest.message && Object.entries(signRequest.message).map(([key, val]) => (
              <div key={key} className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{key}</Badge>
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">
                    {val.type}
                  </Badge>
                </div>
                <code className="text-sm text-white font-mono break-all block">
                  {typeof val.value === 'object' ? JSON.stringify(val.value, null, 2) : String(val.value)}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        {data.messagePreview && (
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
            <span className="text-sm text-zinc-400 mb-2 block">Message Preview</span>
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono">
              {data.messagePreview}
            </pre>
          </div>
        )}

        {/* Signer Address */}
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-500/20">
          <span className="text-sm text-zinc-400 mb-2 block">Signer Address</span>
          <code className="text-xs text-white font-mono break-all">
            {signRequest.from}
          </code>
        </div>

        {/* Network */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {signRequest.network}
          </Badge>
        </div>

        {/* Free Badge */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300 font-semibold">Gas-Free Signature</span>
          </div>
          <p className="text-xs text-green-300">
            ✓ Domain separation prevents signature reuse in other apps
          </p>
          <p className="text-xs text-green-300">
            ✓ Type-safe structured data with Clarity values
          </p>
        </div>

        {/* Security Notes */}
        {data.securityNotes && data.securityNotes.length > 0 && (
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300 text-xs">
              <div className="space-y-1 mt-2">
                {data.securityNotes.map((note, idx) => (
                  <p key={idx}>{note}</p>
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
        {signRequest.comment && (
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-slate-500/20">
            <p className="text-sm text-zinc-300 italic">{signRequest.comment}</p>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="mb-2">
            <span className="text-sm text-blue-300 font-semibold">Structured Signing Benefits:</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              • Type Safety - Clarity values ensure correct data types
            </p>
            <p className="text-xs text-blue-300">
              • Domain Separation - Prevents cross-app signature reuse
            </p>
            <p className="text-xs text-blue-300">
              • Clear Display - Wallet shows structured fields
            </p>
            <p className="text-xs text-blue-300">
              • EIP-712 Compatible - Similar to Ethereum's typed data
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-3">
            <p className="text-sm text-fuchsia-300">{data.message}</p>
          </div>
        )}

        {/* Signature Ready Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-400 px-6 py-2">
            Ready to sign in wallet
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
