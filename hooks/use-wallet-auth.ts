"use client";

import { useEffect, useState } from "react";
import { isConnected, getLocalStorage } from "@stacks/connect";
import type { User } from "@/lib/db/schema";

/**
 * Stacks Wallet Authentication Hook
 * Manages wallet connection state and user authentication
 */
export function useWalletAuth() {
  const [address, setAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      const connectionStatus = isConnected();

      if (connectionStatus) {
        const userData = getLocalStorage();
        const stxAddress = userData?.addresses?.stx?.[0]?.address;

        if (stxAddress && stxAddress !== address) {
          setAddress(stxAddress);
        }
      } else {
        if (address !== null) {
          setAddress(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    };

    // Check on mount
    checkConnection();

    // Poll for connection changes to detect wallet connection
    const interval = setInterval(checkConnection, 500);
    return () => clearInterval(interval);
  }, [address]);

  // Separate effect to handle user authentication when address changes
  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const authenticateUser = async () => {
      setIsLoading(true);
      try {
        // Register/authenticate user with backend
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to authenticate user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [address]);

  return {
    user,
    isConnected: !!address,
    isLoading,
    address,
  };
}
