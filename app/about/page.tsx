"use client";

import { motion } from "motion/react";
import { Brain, Shield, Zap, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              <span className="text-muted-foreground">About StacksAI</span>
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              The Voice of <br /> Bitcoin DeFi
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Bitcoin DeFi shouldn&apos;t require navigating dozens of interfaces. StacksAI brings natural language to the entire Bitcoin Layer 2 ecosystem - making DeFi operations as simple as sending a text message.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try StacksAI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Problem We&apos;re Solving</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Bitcoin&apos;s Layer 2 ecosystem is exploding with DeFi innovation - but users are drowning in complexity.
              8+ major protocols (ALEX, Velar, BitFlow, Arkadiko, Charisma, Zest, Granite, STX Core).
              Each with their own interface, terminology, and workflows.
              StacksAI solves this by translating natural language into Bitcoin DeFi actions across all protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Brain className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">144+ Live Tools</h3>
              <p className="text-muted-foreground">
                Not promises - working integrations. Swap on ALEX/Velar/BitFlow, lend on Arkadiko/Granite,
                stack STX for BTC yields, bridge sBTC, manage NFTs, check mempool fees. Every major Stacks protocol, one interface.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">MCP-Powered Architecture</h3>
              <p className="text-muted-foreground">
                Built on Model Context Protocol - the emerging standard for AI-tool integration.
                Like ChatGPT plugins for Bitcoin DeFi. Any Stacks protocol can plug in, giving them instant access to conversational users.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Globe className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Bitcoin-Native DeFi</h3>
              <p className="text-muted-foreground">
                Built on Stacks, the Bitcoin Layer 2 with Proof-of-Transfer consensus.
                Every transaction settles with Bitcoin&apos;s security. Access sBTC bridge, stack STX for BTC yields, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-muted-foreground">
              Making Bitcoin DeFi so easy that anyone can become a power user
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Composable Protocol Ecosystem</h3>
                  <p className="text-muted-foreground">
                    Like ChatGPT&apos;s plugin ecosystem for Bitcoin. Every Stacks protocol can integrate their tools through MCP.
                    Users get one unified interface. Protocols get instant distribution to conversational users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Privacy-First Architecture</h3>
                  <p className="text-muted-foreground">
                    Non-custodial by design. We never hold your keys, tokens, or private data.
                    Connect Leather or Xverse wallets, approve transactions yourself, and maintain complete sovereignty over your Bitcoin assets.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Brain className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Intelligent Protocol Selection</h3>
                  <p className="text-muted-foreground">
                    Not just keyword matching - real intelligence. StacksAI compares rates across DEXs,
                    calculates optimal swap routes, analyzes lending APYs, and explains complex DeFi concepts in plain English.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Democratizing Bitcoin DeFi</h3>
                  <p className="text-muted-foreground">
                    Making Bitcoin DeFi accessible to everyone. No need to learn Clarity smart contracts,
                    understand protocol mechanics, or navigate complex UIs. Just describe what you want in plain English.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powered by Innovation</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              StacksAI combines cutting-edge AI models with comprehensive Bitcoin L2 integrations
              to deliver the most advanced conversational DeFi interface on Bitcoin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 md:p-12 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Advanced AI Models</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our AI understands Bitcoin L2 DeFi including Stacks&apos; Proof-of-Transfer consensus,
                  Clarity smart contracts, sBTC bridge mechanics, and stacking rewards.
                  It analyzes transactions across 8+ protocols and provides intelligent routing recommendations.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Natural language to Bitcoin DeFi operations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Multi-protocol rate comparison and routing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time mempool and transaction analysis
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Brain className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Bitcoin DeFi?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Stop navigating complex interfaces. 144+ tools across 8+ protocols through simple conversation.
              The most comprehensive Bitcoin L2 DeFi interface ever built.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}