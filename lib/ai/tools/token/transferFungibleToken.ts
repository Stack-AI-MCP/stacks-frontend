import { tool } from "ai";
import z from "zod";

export const transferFungibleToken = tool({
  description: `Transfer SIP-010 fungible tokens (like USDA, ALEX, DIKO, etc.) to another address.

  This creates a token transfer transaction following the SIP-010 standard.
  Common use cases:
  - Send stablecoins (USDA, sUSDT)
  - Send governance tokens (DIKO, ALEX)
  - Send wrapped assets (aBTC, xBTC)
  - Any SIP-010 compliant token`,

  inputSchema: z.object({
    from: z.string().describe("Sender's Stacks address"),
    contractAddress: z.string().describe("Token contract address"),
    contractName: z.string().describe("Token contract name"),
    recipient: z.string().describe("Recipient's Stacks address"),
    amount: z.string().describe("Amount to transfer in token's base units (e.g., micro-units)"),
    memo: z.string().optional().describe("Optional memo/note for the transfer"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    contractAddress,
    contractName,
    recipient,
    amount,
    memo,
    network,
  }) => {
    try {
      // Build the SIP-010 transfer transaction
      // Standard SIP-010 transfer signature: (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress,
        contractName,
        functionName: "transfer",
        functionArgs: [
          { type: "uint", value: amount },
          { type: "principal", value: from },
          { type: "principal", value: recipient },
          memo
            ? { type: "some", value: { type: "buffer", value: Buffer.from(memo, 'utf8').toString('hex') }}
            : { type: "none" }
        ],
        postConditions: [
          {
            type: "fungible",
            address: from,
            assetInfo: {
              contractAddress,
              contractName,
              assetName: contractName, // Usually the same as contract name
            },
            amount: amount,
            condition: "sent-equal-to"
          }
        ],
        network,
        comment: `Transfer ${amount} ${contractName} to ${recipient}`,
      };

      return {
        success: true,
        transaction,
        message: `Token transfer prepared: ${amount} ${contractName} to ${recipient}. Please confirm in your wallet.`,
        details: {
          token: `${contractAddress}.${contractName}`,
          amount,
          from,
          to: recipient,
          memo: memo || "none",
        },
        instructions: [
          "1. Review the transfer details in your wallet",
          "2. Verify the recipient address is correct",
          "3. Check the post-condition to ensure security",
          "4. Confirm the transaction",
        ],
      };
    } catch (error: any) {
      console.error("Error creating token transfer:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to create token transfer for ${contractName}`,
      };
    }
  },
});
