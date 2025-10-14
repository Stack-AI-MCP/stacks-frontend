import { tool } from "ai";
import z from "zod";

export const signMessage = tool({
  description: `Request a cryptographic signature for a message without making an on-chain transaction.

  Message signing is used for:
  - Authentication (proving you control an address)
  - Authorization (granting permissions)
  - Off-chain agreements (verifiable statements)
  - Gasless signatures for meta-transactions
  - Proving ownership for airdrops or gated content

  The signature can be verified off-chain without any gas costs.`,

  inputSchema: z.object({
    from: z.string().describe("The signer's Stacks address"),
    message: z.string().describe("The message to sign (plain text)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
    comment: z.string().optional().describe("Description of why this signature is needed"),
  }),

  execute: async ({
    from,
    message,
    network,
    comment,
  }) => {
    try {
      // Build the message signing request
      const signRequest = {
        type: "sign_message" as const,
        from,
        message,
        network,
        comment: comment || "Sign this message to prove you control this address",
        // The signature response will include:
        // - signature: string (the cryptographic signature)
        // - publicKey: string (the public key used for signing)
      };

      console.log("Stacks message signing request:", signRequest);

      return {
        success: true,
        signRequest,
        message: `Message signing prepared. Please review and sign in your wallet.`,
        messagePreview: message.length > 100
          ? `${message.substring(0, 100)}...`
          : message,
        instructions: [
          "1. Review the message carefully in your wallet",
          "2. Ensure you trust the application requesting the signature",
          "3. Sign the message (no gas fee required)",
          "4. The signature proves you control the address without revealing your private key",
        ],
        securityNotes: [
          "✓ Message signing is free (no transaction fee)",
          "✓ Does not move any funds or change blockchain state",
          "✓ Signature can be verified off-chain",
          "⚠️ Only sign messages you understand and trust",
          "⚠️ Malicious apps could use signatures to impersonate you",
        ],
      };
    } catch (error: any) {
      console.error("Error creating message signing request:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create message signing request",
      };
    }
  },
});
