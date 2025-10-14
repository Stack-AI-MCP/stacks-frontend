import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getStackingInfo = tool({
  description: `Get Stacking status and information for a Stacks address.
  Stacking is the Stacks consensus mechanism where STX holders lock tokens to earn BTC rewards.
  Returns current stacking status, locked amount, unlock height, and reward information.`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address (ST* for testnet, SP* for mainnet)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ address, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      // Get account balances to see locked STX
      const balancesResponse = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!balancesResponse.ok) {
        throw new Error(`Failed to get account balances: ${balancesResponse.statusText}`);
      }

      const balances = await balancesResponse.json();
      const lockedSTX = parseInt(balances.stx.locked) / 1_000_000;
      const unlockHeight = balances.stx.unlock_height;

      // Get PoX info if stacking
      let poxInfo = null;
      if (lockedSTX > 0) {
        try {
          const poxResponse = await fetch(`${apiUrl}/v2/pox`, {
            headers: { 'Accept': 'application/json' }
          });

          if (poxResponse.ok) {
            poxInfo = await poxResponse.json();
          }
        } catch (error) {
          console.warn("Could not fetch PoX info:", error);
        }
      }

      return {
        success: true,
        data: {
          address,
          network,
          isStacking: lockedSTX > 0,
          locked: {
            amount: `${lockedSTX.toFixed(6)} STX`,
            amountMicroStx: balances.stx.locked,
            unlock_height: unlockHeight,
          },
          pox: poxInfo ? {
            current_cycle: poxInfo.current_cycle?.id,
            next_cycle_in_blocks: poxInfo.next_cycle?.blocks_until_prepare_phase,
            min_threshold_ustx: poxInfo.next_cycle?.min_threshold_ustx,
          } : null,
        },
        message: lockedSTX > 0
          ? `Address ${address} has ${lockedSTX.toFixed(6)} STX locked for stacking (unlocks at height ${unlockHeight})`
          : `Address ${address} is not currently stacking`,
      };
    } catch (error: any) {
      console.error("Error getting stacking info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get stacking info for ${address}`,
      };
    }
  },
});
