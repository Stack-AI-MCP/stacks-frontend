'use client';

import { useEffect, useRef } from 'react';
import { useWalletAPI } from './useWalletAPI';

export function useAutoRegisterUser() {
  const { fetchWithWalletHeaders, address, isConnected, network, getWalletHeaders } = useWalletAPI();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (isConnected && address && !hasRegistered.current) {
      registerUser(address);
      hasRegistered.current = true;
    }

    // Reset registration flag when wallet disconnects
    if (!isConnected) {
      hasRegistered.current = false;
    }
  }, [isConnected, address]);

  const registerUser = async (walletAddress: string) => {
    try {
      const response = await fetchWithWalletHeaders('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const userData = await response.json();
      console.log('User registered/found:', userData);

      return userData;
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return {
    isRegistered: hasRegistered.current,
    address,
    isConnected,
    network,
    fetchWithWalletHeaders, // Export this for other components to use
    getWalletHeaders, // Export wallet headers helper
  };
}