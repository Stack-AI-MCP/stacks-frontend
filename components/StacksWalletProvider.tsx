'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/ui/loading-screen';

// Create QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

/**
 * Stacks Wallet Provider
 * Wraps the app with React Query provider for data fetching
 * No wallet-specific provider needed as @stacks/connect manages its own state
 */
export default function StacksWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <LoadingScreen
        message="Stacks Terminal"
        submessage="Initializing Bitcoin DeFi..."
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
