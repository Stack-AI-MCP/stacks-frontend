"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  TrendingUp,
  Shield,
  Zap,
  Coins,
  Globe,
  GitBranch,
  FileText,
  Check,
  ExternalLink
} from "lucide-react";

const protocols = [
  {
    name: "ALEX",
    description: "Advanced automated market maker with orderbook and launchpad",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tools: 25,
    features: [
      "AMM token swaps",
      "Orderbook trading",
      "Launchpad for new tokens",
      "Yield farming pools",
      "Liquidity provision"
    ],
    capabilities: [
      "Swap tokens with optimal routing",
      "Place limit and market orders",
      "Participate in token launches",
      "Provide liquidity for fees",
      "Farm ALEX rewards"
    ],
    docs: "https://docs.alexlab.co"
  },
  {
    name: "Velar",
    description: "Multi-chain DEX with comprehensive liquidity solutions",
    icon: Globe,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tools: 20,
    features: [
      "Cross-chain swaps",
      "Liquidity pools",
      "LP token management",
      "Volume analytics",
      "Fee optimization"
    ],
    capabilities: [
      "Trade across multiple chains",
      "Manage LP positions",
      "Track trading volume",
      "Optimize fee structures",
      "Analyze pool performance"
    ],
    docs: "https://docs.velar.co"
  },
  {
    name: "BitFlow",
    description: "Stable-focused DEX for stablecoin and low-volatility trading",
    icon: Shield,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    tools: 18,
    features: [
      "Stablecoin swaps",
      "Low slippage trading",
      "Pool analytics",
      "Yield optimization",
      "Stability metrics"
    ],
    capabilities: [
      "Swap stablecoins efficiently",
      "Minimize price impact",
      "Track pool health",
      "Maximize yield returns",
      "Monitor peg stability"
    ],
    docs: "https://docs.bitflow.finance"
  },
  {
    name: "Charisma",
    description: "Composable vaults and Blaze intent-based protocol",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    tools: 22,
    features: [
      "Composable vaults",
      "Blaze intent protocol",
      "Yield strategies",
      "Vault management",
      "Intent execution"
    ],
    capabilities: [
      "Create custom vault strategies",
      "Execute complex intents",
      "Automate yield farming",
      "Compose DeFi operations",
      "Optimize returns automatically"
    ],
    docs: "https://docs.charisma.rocks"
  },
  {
    name: "Arkadiko",
    description: "Lending protocol with USDA stablecoin minting",
    icon: Coins,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tools: 20,
    features: [
      "Collateral management",
      "USDA stablecoin minting",
      "Loan operations",
      "Liquidation engine",
      "Interest accrual"
    ],
    capabilities: [
      "Deposit collateral for loans",
      "Mint USDA stablecoin",
      "Manage debt positions",
      "Monitor health factors",
      "Avoid liquidations"
    ],
    docs: "https://docs.arkadiko.finance"
  },
  {
    name: "Granite",
    description: "Multi-collateral lending markets with flexible terms",
    icon: GitBranch,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    tools: 15,
    features: [
      "Supply assets",
      "Borrow operations",
      "Interest rate models",
      "Health factor tracking",
      "Multiple collateral types"
    ],
    capabilities: [
      "Supply assets to earn interest",
      "Borrow against collateral",
      "Monitor interest rates",
      "Track position health",
      "Manage multiple assets"
    ],
    docs: "https://docs.granite.fi"
  },
  {
    name: "BNS (Bitcoin Name Service)",
    description: "Decentralized naming system for .btc domains",
    icon: FileText,
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    tools: 18,
    features: [
      "Domain registration",
      "Name resolution",
      "Domain transfers",
      "Renewal management",
      "Subdomain creation"
    ],
    capabilities: [
      "Register .btc domains",
      "Resolve names to addresses",
      "Transfer domain ownership",
      "Renew expiring domains",
      "Create subdomains"
    ],
    docs: "https://docs.bns.xyz"
  },
  {
    name: "Clarinet",
    description: "Smart contract development and testing framework",
    icon: Code,
    color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    tools: 10,
    features: [
      "Contract deployment",
      "Testing framework",
      "Console access",
      "Debugging tools",
      "Network simulation"
    ],
    capabilities: [
      "Deploy Clarity contracts",
      "Run comprehensive tests",
      "Debug contract execution",
      "Simulate network conditions",
      "Validate contract logic"
    ],
    docs: "https://docs.hiro.so/clarinet"
  }
];

export default function ProtocolsPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <GitBranch className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Protocol Documentation</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Integrated DeFi Protocols
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          Stacks AI integrates with 8 major Bitcoin DeFi protocols, providing 148+ tools for
          comprehensive DeFi operations. From trading and lending to domain registration and
          smart contract development.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-cyan-500">8</div>
            <div className="text-sm text-muted-foreground">Protocols</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">148+</div>
            <div className="text-sm text-muted-foreground">Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">100%</div>
            <div className="text-sm text-muted-foreground">Coverage</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-500">Real</div>
            <div className="text-sm text-muted-foreground">Implementation</div>
          </div>
        </div>
      </motion.div>

      {/* Protocol Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">All Protocols</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {protocols.map((protocol, index) => {
            const Icon = protocol.icon;
            return (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 ${protocol.color} border h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-background/50">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{protocol.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {protocol.tools} tools
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {protocol.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {protocol.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                      Capabilities
                    </h4>
                    <div className="space-y-2">
                      {protocol.capabilities.slice(0, 3).map((capability, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-current rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={protocol.docs} target="_blank" rel="noopener noreferrer">
                      View Documentation
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Integration Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Why Multi-Protocol Integration?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Best Execution</h3>
            <p className="text-muted-foreground text-sm">
              Compare rates across multiple DEXes and lending protocols to find the best
              execution price for your trades and optimal yields for your assets.
            </p>
          </Card>

          <Card className="p-6">
            <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4">
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unified Interface</h3>
            <p className="text-muted-foreground text-sm">
              Access all Bitcoin DeFi protocols through a single natural language interface.
              No need to learn multiple UIs or navigate different websites.
            </p>
          </Card>

          <Card className="p-6">
            <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Risk Diversification</h3>
            <p className="text-muted-foreground text-sm">
              Spread your assets across multiple protocols to minimize smart contract risk
              while maximizing opportunities for yield and trading.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Example Queries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Example Cross-Protocol Queries</h2>

        <div className="space-y-4">
          {[
            {
              query: "Compare STX/USDA swap rates on ALEX, Velar, and BitFlow",
              result: "Get the best rate across all three DEXes automatically"
            },
            {
              query: "Show me the best lending APY for STX collateral",
              result: "Compare Arkadiko and Granite lending rates in real-time"
            },
            {
              query: "Register bitcoin.btc and set up a Charisma vault",
              result: "Execute multiple protocol operations in sequence"
            },
            {
              query: "What's my total portfolio value across all protocols?",
              result: "Aggregate balances from ALEX, Velar, Arkadiko, and more"
            }
          ].map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50"
            >
              <div className="flex items-start gap-4">
                <Code className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-mono text-sm mb-2">{example.query}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    {example.result}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-cyan-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Bitcoin DeFi?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start using Stacks AI to interact with all 8 protocols through simple natural language.
            No complex UIs, just tell the AI what you want to do.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/chat">
                Launch Stacks AI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/getting-started">
                Getting Started Guide
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
