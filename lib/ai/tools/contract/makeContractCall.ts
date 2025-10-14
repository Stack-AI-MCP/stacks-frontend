import { tool } from "ai";
import z from "zod";

/**
 * Clarity Value Types for Contract Arguments
 * These correspond to the Cl namespace types from @stacks/transactions
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
    "list",
    "tuple",
    "optional",
    "response"
  ]).describe("Clarity value type"),
  value: z.any().describe("The value - format depends on type"),
});

export const makeContractCall = tool({
  description: `Create a Stacks contract call transaction. Use this for calling smart contract functions like:
  - Token transfers (SIP-010 fungible tokens)
  - DEX swaps (ALEX, Velar, BitFlow, Charisma)
  - Lending operations (Arkadiko, Granite)
  - NFT operations (SIP-009 non-fungible tokens)
  - DeFi operations (staking, liquidity provision, etc.)

  The transaction will be returned for wallet signing and broadcasting.`,

  inputSchema: z.object({
    from: z.string().describe("The sender's Stacks address (SP* for mainnet, ST* for testnet)"),
    contractAddress: z.string().describe("The smart contract address"),
    contractName: z.string().describe("The contract name"),
    functionName: z.string().describe("The public function name to call"),
    functionArgs: z.array(ClarityValueSchema).optional().default([]).describe("Array of Clarity values for function arguments"),
    postConditions: z.array(z.object({
      type: z.enum(["stx", "fungible", "nonfungible"]),
      address: z.string(),
      amount: z.string().optional(),
      assetInfo: z.object({
        contractAddress: z.string(),
        contractName: z.string(),
        assetName: z.string(),
      }).optional(),
    })).optional().describe("Post-conditions to enforce (optional but recommended for security)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
    sponsored: z.boolean().optional().default(false).describe("Whether this is a sponsored transaction"),
    fee: z.string().optional().describe("Transaction fee in micro-STX (optional, will be estimated if not provided)"),
    comment: z.string().optional().describe("Human-readable description of what this transaction does"),
  }),

  execute: async ({
    from,
    contractAddress,
    contractName,
    functionName,
    functionArgs = [],
    postConditions,
    network,
    sponsored,
    fee,
    comment,
  }) => {
    try {
      // Build the transaction object that will be passed to @stacks/connect
      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        postConditions: postConditions || [],
        network,
        sponsored,
        fee,
        comment: comment || `Call ${functionName} on ${contractAddress}.${contractName}`,
        // Explorer link for after transaction is broadcast
        explorerUrlTemplate: network === "mainnet"
          ? "https://explorer.stacks.co/txid/{txId}"
          : "https://explorer.hiro.so/txid/{txId}?chain=testnet",
      };

      console.log("Stacks contract call transaction:", transaction);

      return {
        success: true,
        transaction,
        message: `Contract call prepared: ${contractName}.${functionName}(). Please confirm in your wallet.`,
        instructions: [
          "1. Review the transaction details in your wallet",
          "2. Check post-conditions (if any) to ensure asset safety",
          "3. Confirm the transaction to broadcast it to the network",
          "4. Transaction will be visible in the explorer once broadcast",
        ],
      };
    } catch (error: any) {
      console.error("Error creating contract call:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to create contract call for ${contractName}.${functionName}`,
      };
    }
  },
});
