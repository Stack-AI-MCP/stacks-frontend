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
  const [isLoading, setIsLoading] = useState(false);

  const connected = isConnected();

  useEffect(() => {
    const handleUserAuth = async () => {
      if (connected) {
        const userData = getLocalStorage();
        const stxAddress = userData?.addresses?.stx?.[0]?.address;

        if (stxAddress) {
          setAddress(stxAddress);
          setIsLoading(true);

          try {
            // Register/authenticate user with backend
            const response = await fetch('/api/users/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: stxAddress })
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
        }
      } else {
        setAddress(null);
        setUser(null);
      }
    };

    handleUserAuth();
  }, [connected]);

  return {
    user,
    isConnected: connected,
    isLoading,
    address,
  };
}
