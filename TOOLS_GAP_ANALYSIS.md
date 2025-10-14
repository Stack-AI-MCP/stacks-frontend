# Frontend Tools Gap Analysis

## Current Status: Missing ALL Write Operations

### ✅ What We Have (Read Operations Only)
- Account queries (balance, transactions, nonces)
- Block queries
- ALEX DEX: Pool data, prices, TVL (READ only)
- Velar DEX: Pool data, prices, tickers (READ only)
- BitFlow DEX: Tokens, quotes (READ only)
- Arkadiko: Vault info, swap pairs, stake info (READ only)
- Charisma: Quotes, orders list (READ only)
- Granite: (READ operations only)
- NFT: Holdings, history (READ only)
- Token: Info queries (READ only)

### ❌ What We're Missing (Write Operations)

#### **1. Token Operations** (CRITICAL - Basic functionality)
- `transferFungibleToken` - Transfer SIP-010 tokens
- `approveFungibleToken` - Approve spending allowance
- `mintFungibleToken` - Mint new tokens (if authorized)

#### **2. NFT Operations** (CRITICAL - Basic functionality)
- `transferNFT` - Transfer SIP-009 NFT
- `mintNFT` - Mint new NFT (if authorized)
- `burnNFT` - Burn NFT (if authorized)

#### **3. ALEX DEX Operations**
- `alexSwapTokens` - Execute swap on ALEX
- `alexAddLiquidity` - Add liquidity to pool
- `alexRemoveLiquidity` - Remove liquidity from pool
- `alexStake` - Stake LP tokens
- `alexUnstake` - Unstake LP tokens
- `alexClaimRewards` - Claim staking rewards

#### **4. Velar DEX Operations**
- `velarSwapTokens` - Execute swap on Velar
- `velarAddLiquidity` - Add liquidity
- `velarRemoveLiquidity` - Remove liquidity
- `velarStake` - Stake tokens
- `velarUnstake` - Unstake tokens

#### **5. BitFlow DEX Operations**
- `bitflowSwapTokens` - Execute swap
- `bitflowAddLiquidity` - Add liquidity
- `bitflowRemoveLiquidity` - Remove liquidity
- `bitflowCreateKeeperOrder` - Create DCA order
- `bitflowCancelKeeperOrder` - Cancel DCA order

#### **6. Arkadiko Operations** (Already have some Granite prepare* tools, need more)
- `arkadikoCreateVault` - Create vault for USDA minting
- `arkadikoUpdateVault` - Update vault collateral/debt
- `arkadikoCloseVault` - Close vault
- `arkadikoSwapTokens` - Swap on Arkadiko DEX
- `arkadikoAddLiquidity` - Add liquidity
- `arkadikoRemoveLiquidity` - Remove liquidity
- `arkadikoStakeDiko` - Stake DIKO tokens
- `arkadikoUnstakeDiko` - Unstake DIKO
- `arkadikoVoteProposal` - Vote on governance
- `arkadikoCreateProposal` - Create governance proposal

#### **7. Charisma DEX Operations**
- `charismaCreateOrder` - Create limit order
- `charismaCancelOrder` - Cancel order
- `charismaExecuteSwap` - Execute immediate swap

#### **8. Granite Lending Operations** (We have prepare* tools, but need completion)
- Already have: prepareBorrow, prepareRepay, prepareAddCollateral, etc.
- These are good! Just need to ensure they work with components

## Frontend Architecture Pattern

### Transaction Flow:
```
1. AI Tool generates transaction object
2. Component receives transaction object
3. useHandleTransaction hook processes it
4. @stacks/connect requests wallet signature
5. User confirms in Leather/Xverse wallet
6. Transaction broadcasts to network
7. Component shows confirmation/explorer link
```

### Tool Return Format:
```typescript
{
  success: true,
  transaction: {
    type: "contract_call",
    from: "SP...",
    contractAddress: "SP...",
    contractName: "token-name",
    functionName: "transfer",
    functionArgs: [
      { type: "uint", value: "1000000" },
      { type: "principal", value: "SP..." }
    ],
    network: "mainnet",
    postConditions: [...]  // Optional security
  },
  message: "Transaction prepared. Confirm in wallet.",
  instructions: [...]
}
```

## Priority Order

1. **HIGH**: Token & NFT transfers (most common operations)
2. **HIGH**: DEX swaps (ALEX, Velar, BitFlow, Arkadiko, Charisma)
3. **MEDIUM**: Liquidity operations (add/remove)
4. **MEDIUM**: Staking operations
5. **LOW**: Governance operations

## Implementation Strategy

For each write operation:
1. Create tool in `/lib/ai/tools/<category>/<action>.ts`
2. Use Clarity value types (`{ type: "uint", value: ... }`)
3. Return transaction object (NOT execute on chain)
4. Include post-conditions for security where applicable
5. Add clear instructions for user
6. Export from index.ts

## Notes

- Frontend tools NEVER sign transactions themselves
- Tools return transaction objects for @stacks/connect
- Components handle the wallet interaction
- MCP server pattern is different (has private keys)
- Frontend pattern: prepare → present → user signs → broadcast
