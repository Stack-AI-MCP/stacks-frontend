'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, Clock, Hash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AccountInfoData = {
  success: boolean;
  data?: {
    address?: string;
    network?: string;
    stx?: {
      balance?: string;
      balanceMicroStx?: string;
      locked?: string;
      lockedMicroStx?: string;
      totalSent?: string;
      totalReceived?: string;
    };
    nonce?: number;
    fungibleTokens?: Record<string, any>;
    nonFungibleTokens?: Record<string, any>;
    // Legacy format support
    balance?: {
      stx: string;
      locked_stx?: string;
      unlock_height?: number;
    };
    locked?: string;
    unlock_height?: number;
    balance_proof?: string;
    nonce_proof?: string;
  };
  error?: string;
};

export default function AccountInfo({
  data,
  isLoading = false
}: {
  data: AccountInfoData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Account Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load account information'}</p>
        </CardContent>
      </Card>
    );
  }

  const account = data.data;

  const formatSTX = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const stx = num / 1e6; // STX has 6 decimals
    return `${stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} STX`;
  };

  // Handle new format (from getAccountInfo tool)
  if (account.stx) {
    const balanceSTX = account.stx.balanceMicroStx || '0';
    const lockedSTX = account.stx.lockedMicroStx || '0';

    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-400" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Balances</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <span className="text-sm text-zinc-400">Available Balance</span>
                <p className="text-2xl font-bold text-cyan-400 mt-1">
                  {account.stx.balance || formatSTX(balanceSTX)}
                </p>
              </div>

              {lockedSTX !== '0' && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <span className="text-sm text-zinc-400">Locked STX</span>
                  <p className="text-2xl font-bold text-sky-400 mt-1">
                    {account.stx.locked || formatSTX(lockedSTX)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {account.nonce !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-400">Account Nonce</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-lg font-mono text-white">
                  {account.nonce}
                </p>
                <span className="text-xs text-zinc-500">
                  Total transactions sent from this account
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Handle legacy format
  const balanceSTX = typeof account.balance === 'object' && account.balance?.stx
    ? account.balance.stx
    : typeof account.balance === 'string'
    ? account.balance
    : '0';

  const lockedSTX = typeof account.balance === 'object' && account.balance?.locked_stx
    ? account.balance.locked_stx
    : account.locked || '0';

  const unlockHeight = typeof account.balance === 'object' && account.balance?.unlock_height
    ? account.balance.unlock_height
    : account.unlock_height;

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Balances</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <span className="text-sm text-zinc-400">Available Balance</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {formatSTX(balanceSTX)}
              </p>
            </div>

            {lockedSTX !== '0' && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <span className="text-sm text-zinc-400">Locked STX</span>
                <p className="text-2xl font-bold text-sky-400 mt-1">
                  {formatSTX(lockedSTX)}
                </p>
                {unlockHeight && (
                  <span className="text-xs text-zinc-500 block mt-1">
                    Unlocks at block #{unlockHeight.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nonce */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Account Nonce</span>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg">
            <p className="text-lg font-mono text-white">
              {account.nonce}
            </p>
            <span className="text-xs text-zinc-500">
              Total transactions sent from this account
            </span>
          </div>
        </div>

        {/* Proofs (if available) */}
        {(account.balance_proof || account.nonce_proof) && (
          <div className="pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400 mb-2">State Proofs Available</p>
            <div className="flex gap-2">
              {account.balance_proof && (
                <Badge className="bg-green-500/20 text-green-400">Balance Proof</Badge>
              )}
              {account.nonce_proof && (
                <Badge className="bg-blue-500/20 text-blue-400">Nonce Proof</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
