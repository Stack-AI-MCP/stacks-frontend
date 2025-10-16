"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Database,
  Globe,
  Shield,
  Zap,
  Code,
  Layers,
  GitBranch,
  Server,
  Cloud,
  Lock,
  ArrowRight,
  Check,
  Cpu,
  Network,
  Workflow
} from "lucide-react";

const architecturePhases = [
  {
    layer: "Presentation Layer",
    description: "Next.js 15 App Router with React 19 providing modern SSR/SSG for Bitcoin DeFi",
    icon: Globe,
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    components: [
      "Next.js App Router",
      "React Server Components",
      "Static Generation",
      "Incremental Regeneration",
      "Edge Runtime Support"
    ]
  },
  {
    layer: "UI/UX Layer",
    description: "Component-driven architecture with Tailwind CSS and smooth animations",
    icon: Layers,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    components: [
      "Radix UI Primitives",
      "Tailwind CSS Utilities",
      "Framer Motion Animations",
      "Dark/Light Theme System",
      "Responsive Design Patterns"
    ]
  },
  {
    layer: "AI Integration Layer",
    description: "MCP server with 148+ Bitcoin DeFi operation tools across 8 protocols",
    icon: Brain,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    components: [
      "Model Context Protocol",
      "Claude AI Integration",
      "Tool Registry System",
      "Streaming Responses",
      "Context-Aware Processing"
    ]
  },
  {
    layer: "Blockchain Layer",
    description: "Stacks SDK integration with wallet connectivity and Bitcoin finality",
    icon: Shield,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    components: [
      "Leather Wallet Connect",
      "Xverse Wallet Support",
      "Stacks.js Client",
      "Clarity Contract Calls",
      "Bitcoin Settlement"
    ]
  },
  {
    layer: "Data & Storage Layer",
    description: "Multi-database architecture with caching and protocol API integrations",
    icon: Database,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    components: [
      "Drizzle ORM",
      "PostgreSQL/SQLite",
      "Redis Caching",
      "Vercel Blob Storage",
      "Protocol API Gateway"
    ]
  }
];

const toolCategories = [
  {
    category: "ALEX Protocol",
    count: 25,
    description: "AMM, Orderbook, and Launchpad operations",
    tools: ["Token Swaps", "Liquidity Pools", "Order Management", "Yield Farming"]
  },
  {
    category: "Velar DEX",
    count: 20,
    description: "Multi-chain DEX and liquidity management",
    tools: ["Cross-chain Swaps", "LP Positions", "Fee Analysis", "Volume Tracking"]
  },
  {
    category: "BitFlow",
    count: 18,
    description: "Stable-focused DEX operations",
    tools: ["Stablecoin Swaps", "Pool Analytics", "Yield Optimization", "Stability Metrics"]
  },
  {
    category: "Charisma",
    count: 22,
    description: "Composable vaults and Blaze protocol",
    tools: ["Vault Management", "Blaze Intents", "Yield Strategies", "Composability"]
  },
  {
    category: "Arkadiko",
    count: 20,
    description: "Lending and USDA stablecoin protocol",
    tools: ["Collateral Management", "Loan Operations", "USDA Minting", "Liquidations"]
  },
  {
    category: "Granite",
    count: 15,
    description: "Multi-collateral lending markets",
    tools: ["Supply Assets", "Borrow Operations", "Interest Rates", "Health Factor"]
  },
  {
    category: "BNS",
    count: 18,
    description: "Bitcoin Name Service for .btc domains",
    tools: ["Domain Registration", "Name Resolution", "Transfers", "Renewals"]
  },
  {
    category: "Clarinet",
    count: 10,
    description: "Smart contract development and testing",
    tools: ["Contract Deploy", "Testing Framework", "Console Access", "Debugging"]
  }
];

const techStack = [
  {
    category: "Frontend Framework",
    technologies: [
      { name: "Next.js", version: "15.3.0", description: "React framework with App Router" },
      { name: "React", version: "19.0.0", description: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.6.3", description: "Type-safe development" }
    ]
  },
  {
    category: "AI & MCP",
    technologies: [
      { name: "MCP SDK", version: "1.0.0", description: "Model Context Protocol integration" },
      { name: "Claude", version: "Latest", description: "AI models for DeFi context" },
      { name: "Tool Registry", version: "Custom", description: "148+ Bitcoin DeFi tools" }
    ]
  },
  {
    category: "Blockchain",
    technologies: [
      { name: "Stacks.js", version: "Latest", description: "Official Stacks SDK" },
      { name: "Leather Wallet", version: "Latest", description: "Primary wallet integration" },
      { name: "Clarity", version: "2.0", description: "Smart contract language" }
    ]
  },
  {
    category: "Database & Storage",
    technologies: [
      { name: "Drizzle ORM", version: "0.34.0", description: "Type-safe database operations" },
      { name: "PostgreSQL", version: "Latest", description: "Production database" },
      { name: "Redis", version: "5.0.0", description: "Caching and sessions" }
    ]
  }
];

export default function ArchitecturePage() {
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
          <Code className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">System Architecture</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Bitcoin DeFi Architecture
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
          Stacks AI employs a sophisticated multi-layer architecture designed for the Bitcoin DeFi era.
          Our system combines modern web technologies, AI processing via MCP, and Stacks blockchain integration
          to deliver conversational Bitcoin DeFi operations at scale.
        </p>
      </motion.div>

      {/* System Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Workflow className="h-8 w-8 text-cyan-500" />
          System Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Conversational Interface</h3>
                <p className="text-muted-foreground">
                  Natural language processing transforms user intent into Bitcoin DeFi operations through
                  our MCP-powered tool registry with 148+ specialized functions across 8 protocols.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
                <p className="text-muted-foreground">
                  Streaming AI responses with progressive data loading ensure immediate feedback
                  while complex blockchain operations execute with Bitcoin finality guarantees.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Client-side wallet integration, secure transaction signing with Clarity, and comprehensive
                  input validation protect user assets and data integrity.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-2xl blur-3xl"></div>
            <Card className="relative p-8 bg-card/80 backdrop-blur border-cyan-500/20">
              <div className="text-center space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-cyan-500/10 rounded-xl">
                    <Globe className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">Web Frontend</div>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-xl">
                    <Brain className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">MCP Server</div>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-xl">
                    <Shield className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">Stacks SDK</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 rounded-xl">
                  <Zap className="h-10 w-10 text-cyan-500 mx-auto mb-2" />
                  <div className="font-semibold">Conversational Bitcoin DeFi</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Architecture Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Layers className="h-8 w-8 text-cyan-500" />
          Architecture Layers
        </h2>

        <div className="space-y-6">
          {architecturePhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.layer}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 border rounded-xl ${phase.color} bg-card/50 backdrop-blur`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{phase.layer}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Layer {index + 1}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {phase.components.map((component, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tool Registry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-cyan-500" />
          MCP Tool Registry
        </h2>

        <div className="mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our MCP server leverages 148+ specialized tools organized across 8 Bitcoin DeFi protocols.
            Each tool is designed for specific protocol operations with intelligent error handling and validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{category.category}</h3>
                <Badge variant="outline" className="text-xs">
                  {category.count} tools
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              <div className="space-y-2">
                {category.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                    <span className="text-muted-foreground">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Server className="h-8 w-8 text-cyan-500" />
          Technology Stack
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">{stack.category}</h3>

              <div className="space-y-3">
                {stack.technologies.map((tech, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tech.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        v{tech.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security & Performance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="h-8 w-8 text-cyan-500" />
          Security & Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Measures
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Client-Side Wallet Integration</div>
                  <div className="text-sm text-muted-foreground">Private keys never leave Leather/Xverse</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Bitcoin Settlement Security</div>
                  <div className="text-sm text-muted-foreground">All transactions settle on Bitcoin</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Clarity Smart Contract Safety</div>
                  <div className="text-sm text-muted-foreground">Decidable language prevents vulnerabilities</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Input Validation & Sanitization</div>
                  <div className="text-sm text-muted-foreground">Comprehensive validation pipeline</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Performance Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Edge Runtime Support</div>
                  <div className="text-sm text-muted-foreground">Global distribution and low latency</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Streaming MCP Responses</div>
                  <div className="text-sm text-muted-foreground">Real-time data processing and display</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Redis Caching Layer</div>
                  <div className="text-sm text-muted-foreground">Optimized protocol data retrieval</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Progressive Enhancement</div>
                  <div className="text-sm text-muted-foreground">Graceful degradation and error handling</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Data Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Network className="h-8 w-8 text-cyan-500" />
          Data Flow Architecture
        </h2>

        <Card className="p-8 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">User Input</h3>
              <p className="text-sm text-muted-foreground">
                Natural language commands for Bitcoin DeFi operations
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">MCP Processing</h3>
              <p className="text-sm text-muted-foreground">
                Claude AI analyzes intent and selects appropriate protocol tools
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-orange-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Execution</h3>
              <p className="text-sm text-muted-foreground">
                Stacks SDK executes with Bitcoin security guarantees
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Cloud className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Response</h3>
              <p className="text-sm text-muted-foreground">
                Streaming results with progressive data loading
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {step}
                  </div>
                  {index < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
