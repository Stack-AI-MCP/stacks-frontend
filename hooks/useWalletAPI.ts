'use client';

import { getLocalStorage, isConnected } from '@stacks/connect';
import { useCallback } from 'react';
import { useWalletAuth } from './use-wallet-auth';

/**
 * Stacks Wallet API Hook
 * Provides utilities for making authenticated API requests with wallet context
 */
export function useWalletAPI() {
  const { address, isConnected: connected } = useWalletAuth();

  /**
   * Make fetch request with Stacks wallet authentication headers
   */
  const fetchWithWalletHeaders = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add Stacks wallet headers if connected
    if (connected && address) {
      headers['X-Stacks-Address'] = address;

      // Determine network from address prefix (SP = mainnet, ST = testnet)
      const network = address.startsWith('SP') ? 'mainnet' : 'testnet';
      headers['X-Stacks-Network'] = network;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [connected, address]);

  /**
   * Get wallet authentication headers for manual requests
   */
  const getWalletHeaders = useCallback(() => {
    const headers: Record<string, string> = {};

    if (connected && address) {
      headers['X-Stacks-Address'] = address;

      // Determine network from address prefix
      const network = address.startsWith('SP') ? 'mainnet' : 'testnet';
      headers['X-Stacks-Network'] = network;
    }

    return headers;
  }, [connected, address]);

  /**
   * Get current network (mainnet or testnet) based on address
   */
  const getNetwork = useCallback(() => {
    if (!address) return null;
    return address.startsWith('SP') ? 'mainnet' : 'testnet';
  }, [address]);

  return {
    fetchWithWalletHeaders,
    getWalletHeaders,
    getNetwork,
    // Wallet state
    address,
    isConnected: connected,
    network: getNetwork(),
  };
}
