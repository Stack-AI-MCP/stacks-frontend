"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PenLine, Info, Shield, AlertCircle } from "lucide-react";

// Message Signing Request Response
type MessageSignRequest = {
  type: "sign_message";
  from: string;
  message: string;
  network: string;
  comment?: string;
};

type MessageSignatureResponse = {
  success: boolean;
  signRequest?: MessageSignRequest;
  messagePreview?: string;
  instructions?: string[];
  securityNotes?: string[];
  error?: string;
  message?: string;
};

export interface MessageSignatureProps {
  data: MessageSignatureResponse;
  isLoading: boolean;
}

export default function MessageSignature({ data, isLoading }: MessageSignatureProps) {
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
          <CardDescription>{data.error || "Unable to prepare message signing request"}</CardDescription>
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
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenLine className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-xl">Sign Message</CardTitle>
        </div>
        <CardDescription className="text-zinc-300">
          Cryptographic signature request (off-chain)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message to Sign */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-cyan-500/20">
          <span className="text-sm text-zinc-400 mb-3 block">Message to Sign</span>
          <div className="bg-black/30 p-4 rounded-lg max-h-64 overflow-auto">
            <p className="text-sm text-white whitespace-pre-wrap break-words font-mono">
              {signRequest.message}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {signRequest.message.length} characters
            </Badge>
          </div>
        </div>

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
            ✓ This signature is free (no transaction fee required)
          </p>
          <p className="text-xs text-green-300">
            ✓ Does not move funds or change blockchain state
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

        {/* Use Cases */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="mb-2">
            <span className="text-sm text-blue-300 font-semibold">Common Use Cases:</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-blue-300">
              • Authentication - Prove you control an address
            </p>
            <p className="text-xs text-blue-300">
              • Authorization - Grant permissions off-chain
            </p>
            <p className="text-xs text-blue-300">
              • Airdrops - Claim tokens without gas fees
            </p>
            <p className="text-xs text-blue-300">
              • Gated Content - Access without on-chain transactions
            </p>
          </div>
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
            <p className="text-sm text-cyan-300">{data.message}</p>
          </div>
        )}

        {/* Signature Ready Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 px-6 py-2">
            Ready to sign in wallet
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
