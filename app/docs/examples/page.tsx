"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Terminal,
  Code,
  TrendingUp,
  Shield,
  Zap,
  Coins,
  Globe,
  GitBranch,
  FileText,
  Layers,
  Database,
  Activity,
  Send,
  Box,
  Image as ImageIcon,
  Clock,
  Users
} from "lucide-react";

const toolCategories = [
  {
    protocol: "ALEX Protocol",
    icon: TrendingUp,
    color: "text-blue-500",
    toolCount: 34,
    examples: [
      { query: "Show me ALEX token prices", description: "Get real-time token prices from ALEX DEX" },
      { query: "What's the TVL on ALEX?", description: "Check total value locked across all pools" },
      { query: "Get ALEX pool stats for STX-ALEX", description: "View liquidity and volume for specific pool" },
      { query: "Show me all trading pairs on ALEX", description: "List all available trading pairs" },
      { query: "Get ALEX swap history", description: "View recent swap transactions" },
      { query: "Show token mappings for ALEX", description: "Get token contract addresses and metadata" }
    ]
  },
  {
    protocol: "Velar Protocol",
    icon: Globe,
    color: "text-purple-500",
    toolCount: 20,
    examples: [
      { query: "Show Velar token prices", description: "Get current token prices from Velar" },
      { query: "Get Velar tickers", description: "View all available tickers and trading pairs" },
      { query: "Show Velar pools", description: "List all liquidity pools on Velar" },
      { query: "Get price for STX on Velar", description: "Check specific token price" },
      { query: "Show Velar circulating supply for VELAR token", description: "Get token supply information" },
      { query: "Get historical prices for STX on Velar", description: "View price history" }
    ]
  },
  {
    protocol: "Charisma Protocol",
    icon: Zap,
    color: "text-yellow-500",
    toolCount: 22,
    examples: [
      { query: "Show my Charisma orders", description: "View your active orders on Charisma" },
      { query: "Get order details for order #123", description: "Check specific order information" },
      { query: "Get swap quote for 100 STX to USDA on Charisma", description: "Calculate swap amounts" },
      { query: "Show Charisma API keys", description: "View your API key status" },
      { query: "Execute Charisma swap", description: "Perform token swaps via Charisma" }
    ]
  },
  {
    protocol: "Arkadiko Protocol",
    icon: Coins,
    color: "text-orange-500",
    toolCount: 28,
    examples: [
      { query: "Show Arkadiko swap pairs", description: "View all available trading pairs" },
      { query: "Get swap pair details for STX-USDA", description: "Check pair liquidity and rates" },
      { query: "Show Arkadiko token price for DIKO", description: "Get current token price" },
      { query: "Create Arkadiko vault", description: "Open a new collateralized vault" },
      { query: "Get my Arkadiko vault info", description: "Check vault status and health" },
      { query: "Show Arkadiko proposals", description: "View governance proposals" },
      { query: "Get staking info for DIKO", description: "Check staking rewards and APY" }
    ]
  },
  {
    protocol: "Granite Protocol",
    icon: Database,
    color: "text-red-500",
    toolCount: 21,
    examples: [
      { query: "Deposit sBTC to Granite", description: "Supply collateral to Granite" },
      { query: "Borrow USDA from Granite", description: "Take out a loan against collateral" },
      { query: "Repay Granite loan", description: "Repay borrowed assets" },
      { query: "Withdraw from Granite", description: "Withdraw supplied assets" },
      { query: "Add collateral to Granite position", description: "Increase collateral" },
      { query: "Stake LP tokens on Granite", description: "Earn rewards by staking" }
    ]
  },
  {
    protocol: "Stacks Core",
    icon: Layers,
    color: "text-cyan-500",
    toolCount: 40,
    examples: [
      { query: "Show my STX balance", description: "Check STX balance for your address" },
      { query: "Get account info for ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", description: "View account details" },
      { query: "Show my transaction history", description: "View recent transactions" },
      { query: "Get current block height", description: "Check latest Stacks block" },
      { query: "Show block details for #12345", description: "View specific block information" },
      { query: "Get transaction details for 0xabc...", description: "Check transaction status" },
      { query: "Show mempool fee estimates", description: "Get current transaction fee rates" }
    ]
  },
  {
    protocol: "Smart Contracts",
    icon: Code,
    color: "text-pink-500",
    toolCount: 15,
    examples: [
      { query: "Deploy my Clarity contract", description: "Deploy a smart contract to Stacks" },
      { query: "Get contract info for SP2C2Y...", description: "View contract details" },
      { query: "Call contract function transfer", description: "Execute contract function" },
      { query: "Read contract function get-balance", description: "Query contract read-only function" },
      { query: "Get contract interface", description: "View contract ABI and functions" },
      { query: "Verify contract deployment", description: "Check deployment status" }
    ]
  },
  {
    protocol: "Transactions",
    icon: Send,
    color: "text-green-500",
    toolCount: 12,
    examples: [
      { query: "Send 100 STX to alice.btc", description: "Transfer STX tokens" },
      { query: "Transfer ALEX tokens to ST1...", description: "Send fungible tokens" },
      { query: "Get transaction receipt", description: "View transaction details" },
      { query: "Check transaction status", description: "Monitor transaction confirmation" },
      { query: "Search transactions by address", description: "View transaction history" }
    ]
  },
  {
    protocol: "NFT Operations",
    icon: ImageIcon,
    color: "text-violet-500",
    toolCount: 10,
    examples: [
      { query: "Show my NFTs", description: "View NFT collection" },
      { query: "Get NFT details for #123", description: "Check NFT metadata" },
      { query: "Transfer NFT to alice.btc", description: "Send NFT to another address" },
      { query: "Get NFT history", description: "View NFT transaction history" },
      { query: "Show NFT gallery", description: "Display all owned NFTs" }
    ]
  },
  {
    protocol: "PoX Stacking",
    icon: Clock,
    color: "text-amber-500",
    toolCount: 8,
    examples: [
      { query: "Show my stacking status", description: "Check current stacking state" },
      { query: "Get PoX cycle info", description: "View current cycle information" },
      { query: "Check stacking rewards", description: "View earned BTC rewards" },
      { query: "Show pool delegations", description: "View stacking pool information" },
      { query: "Get burnchain rewards", description: "Check Bitcoin rewards" }
    ]
  },
  {
    protocol: "Clarinet Development",
    icon: GitBranch,
    color: "text-teal-500",
    toolCount: 4,
    examples: [
      { query: "Generate Clarinet project for NFT marketplace", description: "Create new Clarity project" },
      { query: "Create SIP-010 token contract", description: "Generate fungible token template" },
      { query: "Generate test suite for counter contract", description: "Create unit tests" },
      { query: "Show project configuration guide", description: "Get Clarinet setup instructions" }
    ]
  }
];

export default function ExamplesPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <Terminal className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Tool Examples</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          148+ Tools & Example Queries
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          Explore all the natural language queries you can use with Stacks AI. Simply type what you want to do,
          and the AI will execute the appropriate tools across 8 Bitcoin DeFi protocols.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-cyan-500">148+</div>
            <div className="text-sm text-muted-foreground">Total Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">8</div>
            <div className="text-sm text-muted-foreground">Protocols</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">11</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-500">Live</div>
            <div className="text-sm text-muted-foreground">Real Data</div>
          </div>
        </div>
      </motion.div>

      {/* Tool Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">All Tool Categories</h2>

        <div className="space-y-8">
          {toolCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.protocol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">{category.protocol}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.toolCount} tools
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.examples.map((example, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted/30 rounded-lg border hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Terminal className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm mb-1 text-foreground">
                              "{example.query}"
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {example.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* How to Use */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">How to Use</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-cyan-500">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
            <p className="text-muted-foreground text-sm">
              Connect your Leather or Xverse wallet to enable blockchain operations.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-500">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Ask Naturally</h3>
            <p className="text-muted-foreground text-sm">
              Type your question or request in natural language. No need to remember command syntax.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-purple-500">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Results</h3>
            <p className="text-muted-foreground text-sm">
              AI executes the right tools and displays results with beautiful visualizations.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
          <h2 className="text-3xl font-bold mb-4">Pro Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Be specific:</strong> Instead of "swap tokens",
                try "swap 100 STX for ALEX on ALEX DEX"
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Use addresses or names:</strong> You can use
                Stacks addresses (ST...) or BNS names (alice.btc)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Combine queries:</strong> Ask follow-up questions
                to refine results or get more details
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Check examples:</strong> Browse the examples above
                to discover what's possible
              </p>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
