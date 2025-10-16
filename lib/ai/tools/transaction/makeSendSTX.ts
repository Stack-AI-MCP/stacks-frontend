import { tool } from "ai";
import z from "zod";

export const makeSendSTX = tool({
  description: `Build an STX transfer transaction object. This prepares the transaction for wallet signature.
  The user's wallet (Leather/Xverse) will handle signing and broadcasting.
  Amount should be in human-readable format (e.g., 1.5 for 1.5 STX), NOT micro-STX.`,

  inputSchema: z.object({
    from: z.string().describe("Sender's Stacks address"),
    recipient: z.string().describe("Recipient's Stacks address (ST* for testnet, SP* for mainnet)"),
    amount: z.string().describe("Amount of STX to send in human-readable format (e.g., '1.5' for 1.5 STX)"),
    memo: z.string().optional().describe("Optional memo message (max 34 bytes)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({ from, recipient, amount, memo, network }) => {
    try {
      // Convert amount to micro-STX
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
      }

      const amountMicroStx = Math.floor(amountFloat * 1_000_000).toString();

      // Build transaction object
      const transaction = {
        type: "stx_transfer" as const,
        from,
        recipient,
        amount: amountMicroStx,
        amountSTX: `${amountFloat} STX`,
        memo: memo || undefined,
        network,
        comment: `Send ${amountFloat} STX to ${recipient}${memo ? ` (${memo})` : ''}`,
      };

      console.log("STX transfer transaction object:", transaction);

      return {
        success: true,
        transaction,
      };
    } catch (error: any) {
      console.error("Error building STX transfer:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to build STX transfer: ${error.message}`,
      };
    }
  },
});
