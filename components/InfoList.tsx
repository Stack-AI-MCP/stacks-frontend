"use client";

import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useClientMounted } from "@/hooks/useClientMount";

export const InfoList = () => {
  const { address, isConnected, isLoading } = useWalletAuth();
  const mounted = useClientMounted();

  // Determine network from address (SP = mainnet, ST = testnet)
  const network = address ? (address.startsWith('SP') ? 'mainnet' : 'testnet') : 'unknown';

  return !mounted ? null : (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <section>
        <h2 className="mb-4 text-gray-800">Account Information</h2>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Address: {address || 'Not connected'}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Connected: {isConnected.toString()}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Network: {network}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Loading: {isLoading.toString()}
        </div>
      </section>
    </div>
  );
};
