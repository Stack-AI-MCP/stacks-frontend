import { tool } from "ai";
import z from "zod";

/**
 * Structured message signing uses Clarity values for better type safety
 * and domain separation (prevents signature reuse across different apps)
 */
const ClarityValueSchema = z.object({
  type: z.enum([
    "uint",
    "int",
    "bool",
    "principal",
    "stringAscii",
    "stringUtf8",
    "buffer",
    "tuple",
  ]),
  value: z.any(),
});

export const signStructuredMessage = tool({
  description: `Request a signature for structured data with domain separation.

  Structured message signing provides:
  - Type-safe message schemas using Clarity values
  - Domain separation (prevents cross-app signature reuse)
  - Better compatibility with on-chain verification
  - Clear structured data display in wallet

  Use this for:
  - Typed authorization requests
  - Structured permits or approvals
  - Complex off-chain agreements
  - Meta-transaction signatures
  - EIP-712 style structured signatures`,

  inputSchema: z.object({
    from: z.string().describe("The signer's Stacks address"),
    message: z.record(ClarityValueSchema).describe("Structured message as a Clarity tuple (key-value pairs)"),
    domain: z.object({
      name: z.string().describe("Application name"),
      version: z.string().describe("Application version"),
      chainId: z.number().describe("Chain ID (1 for mainnet, others for testnets)"),
    }).describe("Domain information for signature scoping"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
    comment: z.string().optional().describe("Description of what this signature authorizes"),
  }),

  execute: async ({
    from,
    message,
    domain,
    network,
    comment,
  }) => {
    try {
      // Validate chain ID matches network
      if (network === "mainnet" && domain.chainId !== 1) {
        throw new Error("Chain ID must be 1 for mainnet");
      }

      // Build the structured message signing request
      const signRequest = {
        type: "sign_structured_message" as const,
        from,
        message,
        domain,
        network,
        comment: comment || `Sign structured data for ${domain.name}`,
      };

      // Create a human-readable preview of the message
      const messagePreview = Object.entries(message)
        .map(([key, val]) => `  ${key}: ${JSON.stringify(val.value)}`)
        .join('\n');

      console.log("Stacks structured message signing request:", signRequest);

      return {
        success: true,
        signRequest,
        message: `Structured message signing prepared. Please review in your wallet.`,
        domainInfo: {
          application: domain.name,
          version: domain.version,
          chainId: domain.chainId,
        },
        messagePreview,
        instructions: [
          "1. Review the domain (application) requesting the signature",
          "2. Verify the structured message fields and values",
          "3. Ensure you trust the application",
          "4. Sign the message (no gas fee required)",
        ],
        securityNotes: [
          "✓ Domain separation prevents signature reuse in other apps",
          "✓ Structured data is type-safe and clearly displayed",
          "✓ No on-chain transaction or gas fee required",
          "✓ Can be verified off-chain or used in meta-transactions",
          "⚠️ Only sign if you understand what you're authorizing",
          "⚠️ Signatures may grant permissions or authorize actions",
        ],
        examples: {
          transferAuthorization: {
            message: {
              action: { type: "stringAscii", value: "transfer" },
              amount: { type: "uint", value: 1000 },
              recipient: { type: "principal", value: "ST1X..." },
              nonce: { type: "uint", value: 1 },
            },
            domain: {
              name: "MyDeFiApp",
              version: "1.0.0",
              chainId: 1,
            },
          },
        },
      };
    } catch (error: any) {
      console.error("Error creating structured message signing request:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create structured message signing request",
      };
    }
  },
});
