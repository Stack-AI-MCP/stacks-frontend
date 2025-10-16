# Wallet Integration & MCP Tool Implementation Plan

**Created**: 2025-10-16
**Status**: Planning Phase
**Priority**: CRITICAL - Core functionality for user transaction signing

---

## 🎯 Executive Summary

This document outlines the complete implementation plan for:
1. Adding missing MCP server tools to frontend
2. Fixing wallet integration in all transaction components
3. Ensuring secure transaction handling with post-conditions

**Critical Issue Identified**: All transaction components created are DISPLAY-ONLY without wallet signing integration. Users cannot execute transactions.

---

## 📋 Two-Phase Implementation Plan

### Phase 1: Clarinet Development Tools Integration 🎯

**Goal**: Add Clarinet development tools to help developers create Clarity smart contracts

**Location**: `/stacks-mcp-server/` (separate repository)

**FOCUS**: Only Clarinet Development Tools (skip SIP-009 NFT, SIP-012 Performance, and Post-condition tools for now)

**Tools from** `stacks-clarity-mcp/src/tools/stacks_blockchain/development/clarinet_project.ts`:

```typescript
// 4 Clarinet Development Tools
1. generate_clarinet_project - Project scaffolding with Clarinet.toml setup
2. generate_clarity_contract - Generate SIP-010/SIP-009 contracts with best practices
3. generate_contract_tests - Generate unit/integration/security tests
4. configure_clarinet_project - Configure networks (devnet/testnet/mainnet)
```

**Why These Tools?**
- **Developer-Focused**: Help developers build on Stacks
- **Educational**: Teach Clarity best practices and SIP compliance
- **Scaffolding**: Quick-start for new Clarity projects
- **Testing**: Generate comprehensive test suites

**Success Criteria**:
- All 4 tools are exposed in MCP server
- Tools generate valid Clarinet configurations
- Generated contracts follow SIP standards
- Error messages are descriptive
- No mock implementations

---

### Phase 2: Frontend Clarinet Tools Integration 🔄

**Goal**: Add Clarinet development tools to frontend using AI tools pattern

**Location**: `/Users/apple/dev/hackathon/stacks/vechain-terminal-frontend/`

**Current State**: Frontend has 73 tools implemented, need to add 4 Clarinet tools

**IMPORTANT**: Use AI tools pattern (`lib/ai/tools/`) NOT API routes pattern

**Implementation Pattern** (follow existing pattern in `/lib/ai/tools/development/`):

```typescript
// Example: lib/ai/tools/development/clarinet.ts
import { tool } from "ai";
import { z } from "zod";

export const generateClarinetProjectTool = tool({
  description: "Generate a complete Clarinet project setup with proper structure, configuration, and starter contracts",
  parameters: z.object({
    projectName: z.string().describe("Name of the Clarinet project to create"),
    projectPath: z.string().optional().describe("Path where to create the project"),
    template: z.enum(["counter", "nft", "fungible-token", "empty"]).optional(),
  }),
  execute: async ({ projectName, projectPath, template }) => {
    // Call MCP server via fetch
    const response = await fetch('http://localhost:3000/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'generate_clarinet_project',
        params: { projectName, projectPath, template }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate project: ${await response.text()}`);
    }

    return response.json();
  }
});
```

**Files to Create**:

#### Clarinet Development Tools
**File**: `/lib/ai/tools/development/clarinet.ts`

**4 Tools to Add**:
1. `generateClarinetProjectTool` - Project scaffolding
   - Returns: Markdown guide with Clarinet.toml, directory structure, commands

2. `generateClarityContractTool` - Contract generation
   - Returns: Complete Clarity contract code with SIP compliance

3. `generateContractTestsTool` - Test generation
   - Returns: TypeScript/Deno test suites (unit/integration/security)

4. `configureClarinetProjectTool` - Network configuration
   - Returns: Network-specific settings (devnet/testnet/mainnet)

**Components to Create**:

**File**: `/components/stacks-contracts/ClarinetsGuide.tsx`
- Display Clarinet project setup guide
- Show generated Clarinet.toml configuration
- Display project directory structure
- Show development commands

**File**: `/components/stacks-contracts/ClarityContract.tsx`
- Display generated Clarity contract code
- Show contract features and security considerations
- Display deployment instructions
- Show integration examples

**File**: `/components/stacks-contracts/ContractTests.tsx`
- Display generated test suite code
- Show test categories and coverage
- Display test running commands
- Show CI/CD integration examples

**File**: `/components/stacks-contracts/ProjectConfig.tsx`
- Display network configuration
- Show environment setup
- Display deployment configuration
- Show IDE integration settings

**Use Cases**:
- Help developers bootstrap new Clarity projects
- Generate SIP-compliant contracts (SIP-010 FT, SIP-009 NFT)
- Create comprehensive test suites
- Configure for different networks (devnet/testnet/mainnet)
- Teach Clarity best practices and security patterns

---

### Phase 3: Fix Transaction Component Wallet Integration 🔧 (FUTURE)

**Goal**: Add wallet signing functionality to ALL transaction components

**Critical Problem**: All transaction components created are DISPLAY-ONLY without wallet signing integration. Users cannot execute transactions.

**Status**: DEFERRED - Will be implemented after Clarinet tools integration

**Reference Pattern**: `/components/transactions/TransactionWrapper.tsx`

This wrapper component shows the CORRECT pattern:
- Uses `useWalletAuth` to check wallet connection
- Uses `openContractCall` from `@stacks/connect` for transaction signing
- Has "Sign & Execute" button with gradient styling
- Shows transaction states: idle → signing → success/error
- Displays TransactionReceipt component on success with Explorer link

**Note**: We already have TransactionWrapper and TransactionReceipt components that handle wallet integration. Future work will refactor existing transaction components to use this pattern.

---

#### Transaction Components Requiring Wallet Integration (FUTURE)

**Total Components to Fix**: 11 (Granite components already moved to correct location)

##### DEX Transaction Components:
1. `/components/stacks-dex/arkadiko/ArkadikoSwapTransaction.tsx`
2. `/components/stacks-dex/velar/VelarSwapTransaction.tsx`
3. `/components/stacks-dex/bitflow/BitflowSwapTransaction.tsx`
4. `/components/stacks-dex/charisma/CharismaSwapTransaction.tsx`
5. `/components/stacks-dex/arkadiko/ArkadikoCreateVault.tsx`

##### Granite Lending Transaction Components (already in correct location):
6. `/components/stacks-dex/granite/GraniteBorrow.tsx`
7. `/components/stacks-dex/granite/GraniteRepay.tsx`
8. `/components/stacks-dex/granite/GraniteAddCollateral.tsx`
9. `/components/stacks-dex/granite/GraniteDeposit.tsx`
10. `/components/stacks-dex/granite/GraniteWithdraw.tsx`
11. `/components/stacks-dex/granite/GraniteStake.tsx`

---

#### Wallet Integration Pattern to Apply

**Step 1: Add Required Imports**
```typescript
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useHandleTransaction } from '@/hooks/useHandleTransaction';
import { useState } from 'react';
```

**Step 2: Add Wallet State Management**
```typescript
export default function ComponentName({ data, isLoading }: Props) {
  const { address, isConnected } = useWalletAuth();
  const { handleContractCall } = useHandleTransaction();

  const [txState, setTxState] = useState<'idle' | 'signing' | 'broadcasting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ... rest of component
}
```

**Step 3: Add Transaction Signing Handler**
```typescript
const handleSignAndSubmit = async () => {
  if (!isConnected || !address) {
    setError('Please connect your wallet first');
    return;
  }

  try {
    setTxState('signing');
    setError(null);

    // Generate post-conditions if transferring tokens/NFTs
    const postConditions = await generatePostConditions();

    const result = await handleContractCall({
      contractAddress: data.contractAddress,
      contractName: data.contractName,
      functionName: data.functionName,
      functionArgs: data.functionArgs,
      postConditions, // Add post-conditions
    });

    setTxState('broadcasting');
    setTxId(result.txid);

    // Wait for confirmation (optional)
    await waitForTxConfirmation(result.txid);

    setTxState('success');
  } catch (err) {
    setTxState('error');
    setError(err instanceof Error ? err.message : 'Transaction failed');
  }
};
```

**Step 4: Add UI Elements**
```typescript
return (
  <Card>
    {/* Existing display elements */}

    {/* Add Wallet Connection Check */}
    {!isConnected && (
      <Alert variant="warning">
        <AlertDescription>
          Please connect your Stacks wallet to execute this transaction
        </AlertDescription>
      </Alert>
    )}

    {/* Add Sign Button */}
    <Button
      onClick={handleSignAndSubmit}
      disabled={!isConnected || txState === 'signing' || txState === 'broadcasting'}
      className="w-full"
    >
      {txState === 'idle' && 'Sign & Submit Transaction'}
      {txState === 'signing' && 'Signing...'}
      {txState === 'broadcasting' && 'Broadcasting...'}
      {txState === 'success' && 'Transaction Successful!'}
      {txState === 'error' && 'Transaction Failed'}
    </Button>

    {/* Show Transaction Result */}
    {txId && (
      <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-sm text-green-300">Transaction ID:</p>
        <a
          href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 hover:text-green-300 underline break-all font-mono"
        >
          {txId}
        </a>
      </div>
    )}

    {/* Show Errors */}
    {error && (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </Card>
);
```

**Step 5: Add Post-Condition Generation (for token/NFT transfers)**
```typescript
const generatePostConditions = async () => {
  // For fungible token transfers
  if (data.transferType === 'fungible') {
    return await generateFungiblePostCondition({
      principal: address,
      conditionCode: 'less_equal',
      amount: data.amount,
      assetInfo: {
        contractAddress: data.tokenContract,
        contractName: data.tokenName,
        assetName: data.assetName
      }
    });
  }

  // For NFT transfers
  if (data.transferType === 'nft') {
    return await generateNonFungiblePostCondition({
      principal: address,
      conditionCode: 'sent',
      assetInfo: {
        contractAddress: data.nftContract,
        contractName: data.nftName,
        assetName: data.assetName
      },
      assetId: data.tokenId
    });
  }

  // For STX transfers
  if (data.transferType === 'stx') {
    return await generateSTXPostCondition({
      principal: address,
      conditionCode: 'less_equal',
      amount: data.amount
    });
  }

  return [];
};
```

---

#### Implementation Checklist (Per Component)

For EACH of the 15+ transaction components:

- [ ] Add `useWalletAuth` and `useHandleTransaction` imports
- [ ] Add wallet connection state management
- [ ] Add transaction state management (idle/signing/broadcasting/success/error)
- [ ] Add `handleSignAndSubmit` function
- [ ] Generate appropriate post-conditions for the transaction type
- [ ] Add wallet connection warning UI
- [ ] Add "Sign & Submit Transaction" button
- [ ] Add transaction status display
- [ ] Add transaction result display with Stacks Explorer link
- [ ] Add error display
- [ ] Test on Stacks testnet
- [ ] Test on Stacks mainnet

---

## 🔒 Security Considerations

### Post-Condition Requirements

**CRITICAL**: All token and NFT transfers MUST use post-conditions with `PostConditionMode.Deny`

**Why**: Post-conditions protect users from malicious contracts that might transfer more tokens than expected.

**Required for**:
- SIP-010 fungible token transfers
- SIP-009 NFT transfers
- STX transfers
- Any contract call that might transfer assets

**Example**:
```typescript
import { PostConditionMode } from '@stacks/transactions';

const txOptions = {
  ...baseOptions,
  postConditions: [
    // User should not transfer more than specified amount
    generateFungiblePostCondition({
      principal: userAddress,
      conditionCode: 'less_equal', // Transfer <= specified amount
      amount: transferAmount,
      assetInfo: tokenInfo
    })
  ],
  postConditionMode: PostConditionMode.Deny // REJECT if post-conditions fail
};
```

### Wallet Security Best Practices

1. **Never Store Private Keys**: All signing happens in user's wallet extension
2. **Always Show Transaction Details**: Display full transaction details before signing
3. **Use Descriptive Errors**: Help users understand what went wrong
4. **Check Wallet Connection**: Always verify `isConnected` before transaction attempts
5. **Validate Inputs**: Sanitize and validate all user inputs before building transactions
6. **Show Confirmation**: Display transaction result with block explorer link

---

## 📊 Implementation Progress Tracking

### Phase 1: Clarinet Development Tools (MCP Server)
- [ ] Verify `generate_clarinet_project` tool is exposed
- [ ] Verify `generate_clarity_contract` tool is exposed
- [ ] Verify `generate_contract_tests` tool is exposed
- [ ] Verify `configure_clarinet_project` tool is exposed
- [ ] Test tools generate valid Clarinet configurations
- [ ] Test generated contracts follow SIP standards
- [ ] Test generated tests are comprehensive
- [ ] Ensure no mock implementations

### Phase 2: Frontend Clarinet Tools Integration
- [ ] Create `/lib/ai/tools/development/clarinet.ts`
  - [ ] Add `generateClarinetProjectTool`
  - [ ] Add `generateClarityContractTool`
  - [ ] Add `generateContractTestsTool`
  - [ ] Add `configureClarinetProjectTool`
- [ ] Export tools in `/lib/ai/tools/index.ts`
- [ ] Create display components:
  - [ ] `/components/stacks-contracts/ClarinetGuide.tsx`
  - [ ] `/components/stacks-contracts/ClarityContract.tsx`
  - [ ] `/components/stacks-contracts/ContractTests.tsx`
  - [ ] `/components/stacks-contracts/ProjectConfig.tsx`
- [ ] Add tool handlers in `message.tsx`
- [ ] Test all tools end-to-end
- [ ] Verify markdown rendering works correctly

### Phase 3: Transaction Component Wallet Integration (FUTURE)
- [ ] Refactor DEX Components (5 components)
  - [ ] ArkadikoSwapTransaction.tsx
  - [ ] VelarSwapTransaction.tsx
  - [ ] BitflowSwapTransaction.tsx
  - [ ] CharismaSwapTransaction.tsx
  - [ ] ArkadikoCreateVault.tsx
- [ ] Refactor Granite Components (6 components)
  - [ ] GraniteBorrow.tsx
  - [ ] GraniteRepay.tsx
  - [ ] GraniteAddCollateral.tsx
  - [ ] GraniteDeposit.tsx
  - [ ] GraniteWithdraw.tsx
  - [ ] GraniteStake.tsx
- [ ] Test all components with real wallets
- [ ] Test on Stacks testnet
- [ ] Test on Stacks mainnet

---

## 🚀 Success Criteria

### Phase 1 Complete When:
- All 4 Clarinet tools are exposed in MCP server
- Tools generate valid Clarinet configurations (Clarinet.toml)
- Generated contracts follow SIP-010/SIP-009 standards
- Generated tests are comprehensive (unit/integration/security)
- No mock implementations exist
- Error handling is robust and descriptive

### Phase 2 Complete When:
- All 4 Clarinet tools are integrated into frontend using AI tools pattern
- Tools are exported in `/lib/ai/tools/index.ts`
- 4 display components render markdown output correctly
- Tool handlers are added to `message.tsx`
- Users can ask AI to generate Clarinet projects, contracts, and tests
- Generated code follows Stacks best practices

### Phase 3 Complete When (FUTURE):
- All 11 transaction components use TransactionWrapper pattern
- Users can sign and submit transactions from every component
- Transaction states are displayed correctly
- Transactions appear on Stacks Explorer after submission
- Error messages are clear and actionable

### Project Complete When:
- Users can execute ALL DeFi operations (swap, lend, borrow, stake, etc.)
- Developers can generate Clarity projects and contracts via AI chat
- All transactions use proper TransactionWrapper pattern
- No mock data exists anywhere in the codebase

---

## 📝 Notes and Reminders

1. **NO MOCKS**: Per project guidelines, throw descriptive errors instead of using mock data
2. **Use pnpm**: Always use pnpm for package management
3. **GPG Signing**: All commits must be GPG signed
4. **Reference VeChain Codebase**: Check `/Users/apple/dev/hackathon/vchain/vechain-mcp-server` for wallet integration patterns
5. **Check Documentation**: Always check `/docs/` for protocol-specific implementation details
6. **Use Context7**: Reference official Stacks/Clarity documentation when needed
7. **Simplest Solution**: Do the simplest and most elegant solution possible
8. **Use Existing Types**: Utilize existing types from npm dependencies instead of creating custom ones

---

## 🔗 Reference Files

### Existing Wallet Infrastructure (DO NOT RECREATE):
- `/hooks/use-wallet-auth.ts` - Wallet connection state
- `/components/transactions/TransactionWrapper.tsx` - Transaction signing wrapper (NEW PATTERN)
- `/components/transactions/TransactionReceipt.tsx` - Success display component
- `/components/providers/StacksWalletProvider.tsx` - Wallet provider context

### MCP Server Tools (Source of Truth):
- `/stacks-mcp-server/stacks-clarity-mcp/src/tools/stacks_blockchain/development/clarinet_project.ts` - Clarinet tools

### Existing AI Tools Pattern (REFERENCE):
- `/lib/ai/tools/` - All AI tools directory
- `/lib/ai/tools/index.ts` - Tool exports
- `/lib/ai/tools/defi/` - DeFi protocol tools (ALEX, Arkadiko, Bitflow, Velar, Charisma, Granite)
- `/lib/ai/tools/blockchain/` - Blockchain query tools

### Protocol Documentation:
- `/docs/bns.md` - BNS SDK documentation
- `/docs/alexlab-doc/` - ALEX Protocol
- `/docs/charisma/` - Charisma DEX
- `/docs/bitflow/docs.md` - BitFlow
- `/docs/velar/docs.md` - Velar
- `/docs/zest/docs.md` - Zest
- `/docs/granite/docs.md` - Granite
- `/docs/arkadiko/docs.md` - Arkadiko

---

## 🎯 Current Status

**Status**: Planning Phase - Documentation Updated
**Next Action**: Begin Phase 1 - Verify Clarinet tools in MCP Server
**Focus**: Developer tooling - help developers create Clarity contracts
**Blocked By**: None
**Owner**: Claude Code
**Created**: 2025-10-16
**Updated**: 2025-10-16

---

## 📝 Summary of Changes

**What Changed**:
1. **Narrowed scope** from 16 tools to 4 Clarinet development tools only
2. **Removed** SIP-009 NFT, SIP-012 Performance, and Post-condition tool integration (for now)
3. **Corrected** implementation pattern from API routes to AI tools pattern (`lib/ai/tools/`)
4. **Removed** NFT collection component (already have gallery)
5. **Clarified** that TransactionWrapper pattern already exists for wallet integration
6. **Updated** Phase 3 to "FUTURE" status - focus on Clarinet tools first

**Why These Changes**:
- **Developer Focus**: Clarinet tools provide value to developers building on Stacks
- **Simpler Scope**: 4 tools instead of 16 is more achievable
- **Correct Pattern**: AI tools pattern matches existing codebase architecture
- **Avoid Duplication**: Don't create components that already exist (NFT gallery, TransactionWrapper)

**Next Steps**:
1. Verify 4 Clarinet tools are working in `/stacks-mcp-server/`
2. Create `/lib/ai/tools/development/clarinet.ts` with 4 tools
3. Create 4 display components for Clarinet output
4. Test end-to-end: User asks AI to generate Clarinet project → AI calls tool → Display component shows output

---

**End of Wallet Integration & Clarinet Development Tools Implementation Plan**
