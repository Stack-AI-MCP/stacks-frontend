import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getTransactionInfo = tool({
  description: `Get detailed information about a Stacks transaction by its transaction ID.
  Returns transaction status, type, sender, recipient, amount, fees, and block information.`,

  inputSchema: z.object({
    tx_id: z.string().describe("Transaction ID (0x-prefixed hex string)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ tx_id, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const response = await fetch(`${apiUrl}/extended/v1/tx/${tx_id}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          tx_id: data.tx_id,
          tx_status: data.tx_status,
          tx_type: data.tx_type,
          sender_address: data.sender_address,
          fee_rate: data.fee_rate,
          nonce: data.nonce,
          block_height: data.block_height,
          block_time_iso: data.block_time_iso,
          canonical: data.canonical,
          // Include type-specific details
          ...(data.tx_type === 'token_transfer' && {
            recipient: data.token_transfer?.recipient_address,
            amount: data.token_transfer?.amount,
            amountSTX: (parseInt(data.token_transfer?.amount || '0') / 1_000_000).toFixed(6) + ' STX',
            memo: data.token_transfer?.memo,
          }),
          ...(data.tx_type === 'contract_call' && {
            contract_id: data.contract_call?.contract_id,
            function_name: data.contract_call?.function_name,
            function_args: data.contract_call?.function_args,
          }),
        },
        message: `Transaction ${tx_id} status: ${data.tx_status}`,
      };
    } catch (error: any) {
      console.error("Error getting transaction info:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get transaction info for ${tx_id}`,
      };
    }
  },
});
