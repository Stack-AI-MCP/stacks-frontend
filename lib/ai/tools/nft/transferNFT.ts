import { tool } from "ai";
import z from "zod";

export const transferNFT = tool({
  description: `Transfer a SIP-009 non-fungible token (NFT) to another address.

  This creates an NFT transfer transaction following the SIP-009 standard.
  Use for:
  - Transferring NFT collectibles
  - Sending game items
  - Moving digital art
  - Any SIP-009 compliant NFT`,

  inputSchema: z.object({
    from: z.string().describe("Current owner's Stacks address"),
    contractAddress: z.string().describe("NFT contract address"),
    contractName: z.string().describe("NFT contract name"),
    tokenId: z.string().describe("The unique token ID to transfer"),
    recipient: z.string().describe("Recipient's Stacks address"),
    network: z.enum(["mainnet", "testnet"]).default("testnet").describe("Stacks network"),
  }),

  execute: async ({
    from,
    contractAddress,
    contractName,
    tokenId,
    recipient,
    network,
  }) => {
    try {
      // Build the SIP-009 transfer transaction
      // Standard SIP-009 transfer signature: (transfer (token-id uint) (sender principal) (recipient principal))
      const transaction = {
        type: "contract_call" as const,
        from,
        contractAddress,
        contractName,
        functionName: "transfer",
        functionArgs: [
          { type: "uint", value: tokenId },
          { type: "principal", value: from },
          { type: "principal", value: recipient }
        ],
        postConditions: [
          {
            type: "nonfungible",
            address: from,
            assetInfo: {
              contractAddress,
              contractName,
              assetName: contractName,
            },
            assetId: tokenId,
            condition: "sent"
          }
        ],
        network,
        comment: `Transfer NFT #${tokenId} from ${contractName} to ${recipient}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT transfer prepared: Token #${tokenId} from ${contractName}. Please confirm in your wallet.`,
        details: {
          nft: `${contractAddress}.${contractName}`,
          tokenId,
          from,
          to: recipient,
        },
        instructions: [
          "1. Review the NFT details in your wallet",
          "2. Verify you own this token and want to transfer it",
          "3. Verify the recipient address is correct",
          "4. Check the post-condition ensures you're transferring the right NFT",
          "5. Confirm the transaction",
        ],
        warnings: [
          "⚠️ NFT transfers are irreversible",
          "⚠️ Double-check the recipient address",
          "⚠️ Ensure you're transferring the correct token ID",
        ],
      };
    } catch (error: any) {
      console.error("Error creating NFT transfer:", error);
      return {
        success: false,
        error: error.message,
        message: `Failed to create NFT transfer for token #${tokenId}`,
      };
    }
  },
});
