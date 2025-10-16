"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Brain,
  Code,
  Shield,
  Zap,
  Globe,
  Download,
  Settings,
  Check,
  ArrowRight,
  ExternalLink,
  Copy,
  Cpu,
  Database,
  Network,
  Lock,
  BookOpen,
  PlayCircle,
  GitBranch
} from "lucide-react";
import Link from "next/link";

const supportedAIs = [
  {
    name: "Claude Desktop",
    description: "Native integration with Anthropic's Claude Desktop application",
    icon: Brain,
    configPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    setupCommand: "pnpm setup:claude"
  },
  {
    name: "Cursor Editor",
    description: "AI-powered code editor with Bitcoin DeFi capabilities",
    icon: Code,
    configPath: "~/.cursor/mcp.json",
    setupCommand: "pnpm setup:cursor"
  },
  {
    name: "VS Code",
    description: "Microsoft Visual Studio Code with MCP integration",
    icon: Terminal,
    configPath: "~/Library/Application Support/Code/User/mcp.json",
    setupCommand: "pnpm setup:code"
  }
];

const pluginCategories = [
  {
    name: "ALEX Protocol",
    description: "AMM, orderbook, and launchpad operations",
    icon: Zap,
    tools: 25,
    examples: ["Swap STX for ALEX", "Check liquidity pools", "Place limit orders"]
  },
  {
    name: "Velar DEX",
    description: "Multi-chain DEX trading operations",
    icon: Globe,
    tools: 20,
    examples: ["Trade on Velar", "Manage LP positions", "Track volume"]
  },
  {
    name: "BitFlow",
    description: "Stable-focused DEX operations",
    icon: Shield,
    tools: 18,
    examples: ["Swap stablecoins", "Check pool health", "Optimize yields"]
  },
  {
    name: "Charisma",
    description: "Composable vaults and Blaze protocol",
    icon: GitBranch,
    tools: 22,
    examples: ["Create vault strategy", "Execute intents", "Automate farming"]
  },
  {
    name: "Arkadiko",
    description: "Lending and USDA stablecoin",
    icon: Database,
    tools: 20,
    examples: ["Mint USDA", "Manage collateral", "Track debt"]
  },
  {
    name: "Granite",
    description: "Multi-collateral lending markets",
    icon: Network,
    tools: 15,
    examples: ["Supply assets", "Borrow funds", "Monitor health"]
  }
];

export default function McpServerPage() {
  const configExample = `{
  "mcpServers": {
    "stacks-mcp": {
      "command": "node",
      "args": ["/Users/apple/dev/hackathon/stacks/stacks-mcp-server/dist/index.js"],
      "env": {
        "WALLET_PRIVATE_KEY": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "STACKS_NETWORK": "testnet",
        "STACKS_MAINNET_API_URL": "https://api.hiro.so",
        "STACKS_TESTNET_API_URL": "https://api.testnet.hiro.so",
        "BITFLOW_API_HOST": "https://api.bitflow.finance",
        "BITFLOW_API_KEY": "placeholder_key_request_from_bitflow_team",
        "BITFLOW_PROVIDER_ADDRESS": "placeholder_address",
        "READONLY_CALL_API_HOST": "https://api.bitflow.finance",
        "READONLY_CALL_API_KEY": "placeholder_key",
        "KEEPER_API_HOST": "https://keeper.bitflow.finance",
        "KEEPER_API_KEY": "placeholder_key"
      }
    }
  }
}`;

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
          <Terminal className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Model Context Protocol</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Stacks MCP Server
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          The Model Context Protocol server that brings Bitcoin DeFi operations to Claude Desktop, Cursor, and VS Code.
          Stop visiting websites - start talking to Bitcoin DeFi through your favorite AI assistant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="https://github.com/Stack-AI-MCP/stacks-mcp-server" target="_blank">
              <Download className="mr-2 h-5 w-5" />
              Get MCP Server
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <BookOpen className="mr-2 h-5 w-5" />
            Quick Start Guide
          </Button>
        </div>
      </motion.div>

      {/* What is MCP Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Brain className="h-8 w-8 text-cyan-500" />
          The Future of Bitcoin DeFi
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Stacks MCP Server enables AI assistants to interact directly with Bitcoin DeFi through natural language.
              Instead of navigating complex DApps, users simply tell their AI what they want to do.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>148+ Bitcoin DeFi operation tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Claude Desktop, Cursor, VS Code support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Natural language blockchain operations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>8 DeFi protocols integrated</span>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
            <h3 className="text-xl font-semibold mb-4">Example Conversation</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <span className="font-medium text-blue-400">You:</span> "Swap 100 STX for ALEX on ALEX DEX"
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <span className="font-medium text-green-400">Claude:</span> "I'll help you swap 100 STX for ALEX. Let me check the current exchange rate..."
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <span className="font-medium text-purple-400">Result:</span> "Transaction successful! You received 450.23 ALEX tokens."
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Supported AI Applications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-cyan-500" />
          Supported AI Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportedAIs.map((ai, index) => {
            const Icon = ai.icon;
            return (
              <motion.div
                key={ai.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="p-3 bg-cyan-500/10 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6 text-cyan-500" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{ai.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{ai.description}</p>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <strong>Config Path:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs break-all">
                      {ai.configPath}
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Setup Command:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs">
                      {ai.setupCommand}
                    </code>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Plugin Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-cyan-500" />
          Protocol Operation Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pluginCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Icon className="h-6 w-6 text-cyan-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.tools} tools
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Examples</h4>
                  {category.examples.map((example, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      "{example}"
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Installation Guide */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Settings className="h-8 w-8 text-cyan-500" />
          Quick Installation
        </h2>

        <div className="space-y-8">
          {/* Automated Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-green-500" />
              Automated Setup (Recommended)
            </h3>
            <div className="space-y-4">
              <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-foreground">
{`git clone https://github.com/Stack-AI-MCP/stacks-mcp-server
cd stacks-mcp-server
pnpm install && pnpm build
cp .env.example .env`}
                    <span className="text-cyan-500 font-semibold">
{`
pnpm setup`}
                    </span>
                  </code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                The setup script will automatically configure your preferred AI application with the correct paths and environment variables.
              </p>
            </div>
          </Card>

          {/* Application-Specific Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-500" />
              Application-Specific Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-blue-600">Claude Desktop</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:claude</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-purple-600">Cursor Editor</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:cursor</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-orange-600">VS Code</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:code</code>
              </div>
            </div>
          </Card>

          {/* Configuration Example */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Configuration Example
              </h3>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Configuration
              </Button>
            </div>
            <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <code className="text-foreground whitespace-pre-wrap">
{configExample}
                </code>
              </pre>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Security & Requirements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="h-8 w-8 text-cyan-500" />
          Security & Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Local Environment Variables</div>
                  <div className="text-sm text-muted-foreground">Private keys never leave your machine</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Testnet Support</div>
                  <div className="text-sm text-muted-foreground">Safe testing environment included</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Bitcoin Security</div>
                  <div className="text-sm text-muted-foreground">All transactions settle with Bitcoin finality</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Node.js 18+</div>
                  <div className="text-sm text-muted-foreground">Modern JavaScript runtime required</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">pnpm Package Manager</div>
                  <div className="text-sm text-muted-foreground">Fast, efficient dependency management</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Stacks Wallet</div>
                  <div className="text-sm text-muted-foreground">Leather or Xverse wallet required</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready for Bitcoin DeFi via AI?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Install Stacks MCP Server and experience Bitcoin DeFi operations through natural conversation.
            Built for the Stacks Vibe Coding Hackathon 2025.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="https://github.com/Stack-AI-MCP/stacks-mcp-server" target="_blank">
                <Download className="mr-2 h-5 w-5" />
                Download MCP Server
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs/getting-started">
                <PlayCircle className="mr-2 h-5 w-5" />
                Getting Started Guide
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
