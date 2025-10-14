import { getLocalStorage } from "@stacks/connect";
import { useState, useEffect } from "react";

/**
 * Safe wallet hook
 * Provides wallet address with client-side safety checks
 */
export function useSafeWallet() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const userData = getLocalStorage();
    const stxAddress = userData?.addresses?.stx?.[0]?.address || null;
    setAddress(stxAddress);
  }, []);

  return { address };
}
