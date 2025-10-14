import { tool } from "ai";
import z from "zod";

export const deployContract = tool({
  description: `Deploy a new Clarity smart contract to the Stacks blockchain.

  Contracts are deployed to the sender's address and become immutable once deployed.
  Contract names must be unique per address.

  Common use cases:
  - Deploy custom tokens (SIP-010 fungible tokens)
  - Deploy NFT contracts (SIP-009)
  - Deploy DeFi protocols
  - Deploy DAO governance contracts
  - Deploy custom business logic contracts`,

  inputSchema: z.object({
    from: z.string().describe("The deployer's Stacks address (will own the contract)"),
    contractName: z.string()
      .regex(/^[a-zA-Z]([a-zA-Z0-9]|-)*$/)
      .max(40)
      .describe("Contract name (must start with letter, alphanumeric + hyphens, max 40 chars)"),
    codeBody: z.string().describe("The Clarity smart contract code"),
    clarityVersion: z.enum(["1", "2", "3"]).optional().default("3").describe("Clarity version (1, 2, or 3 - defaults to latest)"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
    fee: z.string().optional().describe("Transaction fee in micro-STX (optional, will be estimated if not provided)"),
    comment: z.string().optional().describe("Description of what this contract does"),
  }),

  execute: async ({
    from,
    contractName,
    codeBody,
    clarityVersion = "3",
    network,
    fee,
    comment,
  }) => {
    try {
      // Validate contract name format
      if (!/^[a-zA-Z]([a-zA-Z0-9]|-)*$/.test(contractName)) {
        throw new Error(
          "Invalid contract name. Must start with a letter and contain only letters, numbers, and hyphens."
        );
      }

      if (contractName.length > 40) {
        throw new Error("Contract name must be 40 characters or less.");
      }

      // Build the deployment transaction
      const transaction = {
        type: "contract_deploy" as const,
        from,
        contractName,
        codeBody,
        clarityVersion: parseInt(clarityVersion),
        network,
        fee,
        comment: comment || `Deploy contract: ${contractName}`,
        // The deployed contract will be at: {from}.{contractName}
        deployedContractId: `${from}.${contractName}`,
        explorerUrlTemplate: network === "mainnet"
          ? "https://explorer.stacks.co/txid/{txId}"
          : "https://explorer.hiro.so/txid/{txId}?chain=testnet",
      };

      console.log("Stacks contract deployment transaction:", transaction);

      return {
        success: true,
        transaction,
        deployedContractId: `${from}.${contractName}`,
        message: `Contract deployment prepared: ${contractName}. Please confirm in your wallet.`,
        instructions: [
          "1. Review the contract code carefully in your wallet",
          "2. Ensure the contract name is correct (contracts are immutable)",
          "3. Confirm the deployment transaction",
          "4. Wait for confirmation (usually 1-2 blocks, ~10-20 minutes)",
          `5. Your contract will be deployed at: ${from}.${contractName}`,
        ],
        warnings: [
          "⚠️ Smart contracts are immutable once deployed",
          "⚠️ Contract names cannot be reused on the same address",
          "⚠️ Test thoroughly on testnet before mainnet deployment",
          "⚠️ Consider security audits for contracts handling value",
        ],
      };
    } catch (error: any) {
      console.error("Error creating contract deployment:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to create deployment transaction for ${contractName}`,
      };
    }
  },
});
