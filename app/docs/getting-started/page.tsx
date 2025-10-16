"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Wallet,
  MessageSquare,
  Search,
  Code,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Connect your Stacks wallet to access all Bitcoin DeFi features",
    icon: Wallet,
    details: [
      "Leather Wallet (Recommended)",
      "Xverse Wallet",
      "Hardware wallets support",
      "Multiple account management"
    ]
  },
  {
    number: "02",
    title: "Explore the Interface",
    description: "Familiarize yourself with the AI-powered chat interface for Bitcoin DeFi",
    icon: MessageSquare,
    details: [
      "Natural language queries",
      "Real-time blockchain data",
      "Smart contract interactions",
      "Multi-protocol support"
    ]
  },
  {
    number: "03",
    title: "Start Querying",
    description: "Begin exploring Bitcoin DeFi with simple questions",
    icon: Search,
    details: [
      "Ask about token balances",
      "Swap tokens on DEXes",
      "Manage lending positions",
      "Register .btc domains"
    ]
  }
];

const features = [
  {
    title: "Bitcoin DeFi Analytics",
    description: "Get real-time insights into Stacks transactions, blocks, and Bitcoin settlement"
  },
  {
    title: "Multi-Protocol Tools",
    description: "Access 148+ tools across 8 protocols: ALEX, Velar, BitFlow, Charisma, Arkadiko, Granite, BNS, Clarinet"
  },
  {
    title: "AI-Powered Queries",
    description: "Ask questions in natural language and get intelligent Bitcoin DeFi insights"
  },
  {
    title: "Cross-Protocol DeFi",
    description: "Trade on DEXes, manage loans, stake assets, and register domains all in one interface"
  }
];

export default function GettingStartedPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Getting Started</span>
        </Badge>

        <h1 className="text-4xl font-bold mb-4">Welcome to Stacks AI</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Stacks AI is your AI-powered co-pilot for Bitcoin DeFi on Stacks.
          This guide will help you get started in just a few minutes.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 text-cyan-500" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-cyan-500" />
            Ready to start?
          </h4>
          <p className="text-muted-foreground mb-4">
            Launch Stacks AI and connect your wallet to begin exploring Bitcoin DeFi.
          </p>
          <Button asChild>
            <Link href="/chat">
              Launch Stacks AI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Example Queries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Example Queries</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Here are some example questions you can ask Stacks AI:
        </p>

        <div className="space-y-4">
          {[
            "What's my STX balance?",
            "Swap 100 STX for ALEX on ALEX DEX",
            "Show me the best lending rates on Arkadiko",
            "Register the domain bitcoin.btc for me",
            "What are my open positions on Velar?"
          ].map((query, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 border rounded-lg bg-card/30 backdrop-blur-sm font-mono text-sm"
            >
              <Code className="h-4 w-4 text-cyan-500 inline mr-2" />
              {query}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Now that you know the basics, explore these advanced topics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/docs/protocols" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Code className="h-5 w-5 text-cyan-500" />
            <div>
              <div className="font-medium">Protocol Guides</div>
              <div className="text-sm text-muted-foreground">Learn about all 8 DeFi protocols</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>

          <Link href="/docs/mcp-server" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <ExternalLink className="h-5 w-5 text-cyan-500" />
            <div>
              <div className="font-medium">MCP Server</div>
              <div className="text-sm text-muted-foreground">Advanced protocol integrations</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
