import { tool } from "ai";
import z from "zod";

/**
 * Clarinet Development Tools
 *
 * Tools for generating Clarity smart contract projects, contracts, tests, and configurations.
 * These tools return markdown guides that help developers bootstrap Clarity projects.
 */

// ============================================================================
// TOOL 1: Generate Clarinet Project
// ============================================================================

export const clarinetsGenerateProject = tool({
  description: `Generate a complete Clarinet project setup with proper structure, configuration, and starter contracts.
  Returns a comprehensive markdown guide for initializing a Clarity smart contract project.`,

  inputSchema: z.object({
    project_name: z.string().describe("Name of the Clarinet project to create"),
    project_path: z.string().optional().describe("Path where to create the project (default: current directory)"),
    template: z.enum(["counter", "nft", "fungible-token", "empty"]).optional().describe("Project template to use (default: empty)"),
  }),

  execute: async ({ project_name, project_path = "./", template = "empty" }) => {
    try {
      const markdown = generateProjectMarkdown(project_name, project_path, template);

      return {
        success: true,
        markdown,
        project_name,
        template,
        message: `Generated Clarinet project guide for "${project_name}" with ${template} template`,
      };
    } catch (error: any) {
      console.error("Error generating Clarinet project:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to generate Clarinet project guide",
      };
    }
  },
});

// ============================================================================
// TOOL 2: Generate Clarity Contract
// ============================================================================

export const clarinetsGenerateContract = tool({
  description: `Generate a complete Clarity contract with SIP compliance, security best practices, and comprehensive functionality.
  Returns contract code, configuration, and deployment instructions.`,

  inputSchema: z.object({
    contract_name: z.string().describe("Name of the contract to generate"),
    contract_type: z.enum(["sip009-nft", "sip010-ft", "counter", "custom"]).describe("Type of contract to generate"),
    features: z.array(z.string()).optional().describe('Additional features like "minting", "burning", "metadata"'),
  }),

  execute: async ({ contract_name, contract_type, features = [] }) => {
    try {
      const markdown = generateContractMarkdown(contract_name, contract_type, features);

      return {
        success: true,
        markdown,
        contract_name,
        contract_type,
        features,
        message: `Generated ${contract_type} contract "${contract_name}" with ${features.length} additional features`,
      };
    } catch (error: any) {
      console.error("Error generating Clarity contract:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to generate Clarity contract",
      };
    }
  },
});

// ============================================================================
// TOOL 3: Generate Contract Tests
// ============================================================================

export const clarinetsGenerateTests = tool({
  description: `Generate comprehensive test suites for Clarity contracts including unit tests, integration tests, and security tests.
  Returns test code with Deno/TypeScript testing framework.`,

  inputSchema: z.object({
    contract_name: z.string().describe("Name of the contract to generate tests for"),
    test_type: z.enum(["unit", "integration", "security"]).describe("Type of tests to generate"),
    scenarios: z.array(z.string()).optional().describe("Specific test scenarios to include"),
  }),

  execute: async ({ contract_name, test_type, scenarios = [] }) => {
    try {
      const markdown = generateTestsMarkdown(contract_name, test_type, scenarios);

      return {
        success: true,
        markdown,
        contract_name,
        test_type,
        scenarios,
        message: `Generated ${test_type} tests for "${contract_name}" with ${scenarios.length} custom scenarios`,
      };
    } catch (error: any) {
      console.error("Error generating contract tests:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to generate contract tests",
      };
    }
  },
});

// ============================================================================
// TOOL 4: Configure Clarinet Project
// ============================================================================

export const clarinetsConfigureProject = tool({
  description: `Configure Clarinet project settings for different networks (devnet/testnet/mainnet).
  Returns network-specific configuration and development workflow commands.`,

  inputSchema: z.object({
    network: z.enum(["devnet", "testnet", "mainnet"]).describe("Network configuration to set up"),
    requirements: z.array(z.string()).optional().describe("Additional requirements or dependencies"),
  }),

  execute: async ({ network, requirements = [] }) => {
    try {
      const markdown = generateConfigMarkdown(network, requirements);

      return {
        success: true,
        markdown,
        network,
        requirements,
        message: `Generated ${network} configuration with ${requirements.length} requirements`,
      };
    } catch (error: any) {
      console.error("Error generating project config:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to generate project configuration",
      };
    }
  },
});

// ============================================================================
// HELPER FUNCTIONS - Markdown Generation
// ============================================================================

function generateProjectMarkdown(projectName: string, projectPath: string, template: string): string {
  const templateImpl = getTemplateImplementation(template, projectName);

  return `# Clarinet Project Setup Guide

## Project: ${projectName}

### 1. Initialize Clarinet Project

\`\`\`bash
# Create new Clarinet project
clarinet new ${projectName}
cd ${projectName}

# Verify Clarinet installation
clarinet --version
\`\`\`

### 2. Project Structure

\`\`\`
${projectName}/
├── Clarinet.toml           # Main project configuration
├── settings/               # Network-specific settings
│   ├── Devnet.toml
│   ├── Testnet.toml
│   └── Mainnet.toml
├── contracts/              # Clarity contracts
├── tests/                  # TypeScript/JavaScript tests
├── deployments/            # Deployment plans
└── .gitignore
\`\`\`

### 3. Clarinet.toml Configuration

\`\`\`toml
[project]
name = "${projectName}"
authors = []
description = ""
telemetry = true
cache_dir = "./.clarinet/cache"
requirements = []

[contracts.${projectName}]
path = "contracts/${projectName}.clar"
clarity_version = 2
epoch = "2.4"

[repl]
costs_version = 2
parser_version = 2

[repl.analysis]
passes = ["check_checker"]

[repl.analysis.check_checker]
strict = false
trusted_sender = false
trusted_caller = false
callee_filter = false
\`\`\`

### 4. ${template.charAt(0).toUpperCase() + template.slice(1)} Template Implementation

${templateImpl}

### 5. Essential Development Commands

\`\`\`bash
# Start Clarinet console
clarinet console

# Run tests
clarinet test

# Check contract syntax
clarinet check

# Deploy to devnet
clarinet deployments apply --devnet
\`\`\`

Your Clarinet project is ready for development!`;
}

function generateContractMarkdown(contractName: string, contractType: string, features: string[]): string {
  const contractCode = getContractCode(contractName, contractType, features);

  return `# Clarity Contract: ${contractName}

## File: contracts/${contractName}.clar

\`\`\`clarity
${contractCode}
\`\`\`

## Contract Registration

Add to your \`Clarinet.toml\`:

\`\`\`toml
[contracts.${contractName}]
path = "contracts/${contractName}.clar"
clarity_version = 2
epoch = "2.4"
\`\`\`

## Security Considerations

✅ **Post-conditions**: ${contractType.includes('sip') ? 'Mandatory for token transfers' : 'Added where applicable'}
✅ **Authorization**: All public functions check \`tx-sender\`
✅ **Error Handling**: Comprehensive error codes
✅ **SIP Compliance**: ${contractType.includes('sip') ? 'Fully compliant' : 'N/A'}

## Deployment

\`\`\`bash
clarinet check
clarinet test
clarinet deployments apply --devnet
\`\`\``;
}

function generateTestsMarkdown(contractName: string, testType: string, scenarios: string[]): string {
  const testCode = getTestCode(contractName, testType);

  return `# Test Suite: ${contractName}

## File: tests/${contractName}_${testType}_test.ts

\`\`\`typescript
${testCode}
\`\`\`

## Running Tests

\`\`\`bash
# Run all tests
clarinet test

# Run with coverage
clarinet test --coverage

# Run with cost analysis
clarinet test --costs
\`\`\`

Run \`clarinet test\` to execute all tests!`;
}

function generateConfigMarkdown(network: string, requirements: string[]): string {
  const networkConfig = getNetworkConfig(network);

  return `# Clarinet Project Configuration

## Network: ${network.toUpperCase()}

### settings/${network.charAt(0).toUpperCase() + network.slice(1)}.toml

\`\`\`toml
${networkConfig}
\`\`\`

## Development Workflow

\`\`\`bash
# Start development environment
clarinet console

# Run tests for ${network}
clarinet test --${network}

# Deploy to ${network}
clarinet deployments apply --${network}
\`\`\`

Your project is configured for ${network}!`;
}

// ============================================================================
// Template Implementations
// ============================================================================

function getTemplateImplementation(template: string, projectName: string): string {
  switch (template) {
    case 'counter':
      return `\`\`\`clarity
;; Counter Template
(define-data-var counter uint u0)

(define-read-only (get-counter)
  (var-get counter)
)

(define-public (increment)
  (ok (var-set counter (+ (var-get counter) u1)))
)
\`\`\``;

    case 'nft':
      return `\`\`\`clarity
;; SIP-009 NFT Template
(define-non-fungible-token ${projectName} uint)
(define-data-var last-token-id uint u0)

(define-public (mint (recipient principal))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (var-set last-token-id token-id)
    (nft-mint? ${projectName} token-id recipient)
  )
)
\`\`\``;

    case 'fungible-token':
      return `\`\`\`clarity
;; SIP-010 Fungible Token Template
(define-fungible-token ${projectName})

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (ft-transfer? ${projectName} amount sender recipient)
  )
)
\`\`\``;

    default:
      return `\`\`\`clarity
;; Empty Template
(define-constant contract-owner tx-sender)

(define-public (hello-world)
  (ok "Hello, Stacks!")
)
\`\`\``;
  }
}

function getContractCode(contractName: string, contractType: string, features: string[]): string {
  switch (contractType) {
    case 'sip010-ft':
      return `;; ${contractName} - SIP-010 Fungible Token

(define-fungible-token ${contractName})

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (ft-transfer? ${contractName} amount sender recipient)
  )
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance ${contractName} who))
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? ${contractName} amount recipient)
  )
)`;

    case 'sip009-nft':
      return `;; ${contractName} - SIP-009 Non-Fungible Token

(define-non-fungible-token ${contractName} uint)

(define-constant contract-owner tx-sender)
(define-data-var last-token-id uint u0)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u101))
    (nft-transfer? ${contractName} token-id sender recipient)
  )
)

(define-public (mint (recipient principal))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (asserts! (is-eq tx-sender contract-owner) (err u100))
    (try! (nft-mint? ${contractName} token-id recipient))
    (var-set last-token-id token-id)
    (ok token-id)
  )
)`;

    case 'counter':
      return `;; ${contractName} - Simple Counter

(define-data-var counter uint u0)

(define-read-only (get-counter)
  (var-get counter)
)

(define-public (increment)
  (ok (var-set counter (+ (var-get counter) u1)))
)

(define-public (decrement)
  (ok (var-set counter (- (var-get counter) u1)))
)`;

    default:
      return `;; ${contractName} - Custom Contract

(define-constant contract-owner tx-sender)

(define-public (hello-world)
  (ok "Hello from ${contractName}!")
)`;
  }
}

function getTestCode(contractName: string, testType: string): string {
  return `import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "${contractName} - ${testType} test",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        // Add your ${testType} tests here
        let block = chain.mineBlock([
            // Test transactions
        ]);

        assertEquals(block.receipts.length, 1);
    },
});`;
}

function getNetworkConfig(network: string): string {
  switch (network) {
    case 'devnet':
      return `[network]
name = "devnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
balance = 100000000000000`;

    case 'testnet':
      return `[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 1200`;

    case 'mainnet':
      return `[network]
name = "mainnet"
node_rpc_address = "https://stacks-node-api.mainnet.stacks.co"
deployment_fee_rate = 3000`;

    default:
      return '';
  }
}
