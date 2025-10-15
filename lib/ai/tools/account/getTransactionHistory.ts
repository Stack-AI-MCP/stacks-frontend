import { tool } from "ai";
import z from "zod";

const STACKS_API_MAINNET = "https://api.mainnet.hiro.so";
const STACKS_API_TESTNET = "https://api.testnet.hiro.so";

export const getTransactionHistory = tool({
  description: `Get transaction history for a Stacks address.
  Returns recent transactions including STX transfers, contract calls, and other activity.`,

  inputSchema: z.object({
    address: z.string().describe("Stacks address (ST* for testnet, SP* for mainnet)"),
    limit: z.number().optional().default(20).describe("Number of transactions to return (max 50)"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ address, limit, offset, network }) => {
    try {
      const apiUrl = network === "mainnet" ? STACKS_API_MAINNET : STACKS_API_TESTNET;

      const params = new URLSearchParams({
        limit: Math.min(limit ?? 50, 50).toString() || '50',
        offset: offset?.toString() ?? '0',
      });

      const response = await fetch(`${apiUrl}/extended/v1/address/${address}/transactions?${params}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction history: ${response.statusText}`);
      }

      const data = await response.json();

      // Format transaction summaries
      const transactions = data.results.map((tx: any) => {
        const base = {
          tx_id: tx.tx_id,
          tx_type: tx.tx_type,
          tx_status: tx.tx_status,
          sender: tx.sender_address,
          fee_rate: tx.fee_rate,
          block_height: tx.block_height,
          block_time: tx.block_time_iso,
        };

        if (tx.tx_type === 'token_transfer') {
          return {
            ...base,
            recipient: tx.token_transfer?.recipient_address,
            amount: (parseInt(tx.token_transfer?.amount || '0') / 1_000_000).toFixed(6) + ' STX',
            memo: tx.token_transfer?.memo,
          };
        }

        if (tx.tx_type === 'contract_call') {
          return {
            ...base,
            contract_id: tx.contract_call?.contract_id,
            function_name: tx.contract_call?.function_name,
          };
        }

        return base;
      });

      return {
        success: true,
        data: {
          address,
          total: data.total,
          limit: data.limit,
          offset: data.offset,
          results: transactions,
        },
        message: `Found ${data.total} transactions for ${address}`,
      };
    } catch (error: any) {
      console.error("Error getting transaction history:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get transaction history for ${address}`,
      };
    }
  },
});
