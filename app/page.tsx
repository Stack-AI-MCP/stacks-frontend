"use client";

import { ArrowRight, Brain, Shield, Zap, Github, ExternalLink, Terminal, MessageSquare, Sparkles, Lock, TrendingUp, Layers, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import BeamsBackground from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Protocol data
const protocols = [
  { name: "ALEX", description: "AMM & Orderbook DEX", color: "from-blue-500 to-cyan-500" },
  { name: "Velar", description: "Multi-chain DEX", color: "from-purple-500 to-pink-500" },
  { name: "BitFlow", description: "Stable-focused DEX", color: "from-orange-500 to-yellow-500" },
  { name: "Charisma", description: "Composable Vaults", color: "from-green-500 to-emerald-500" },
  { name: "Arkadiko", description: "Lending & USDA", color: "from-red-500 to-orange-500" },
  { name: "Zest", description: "Bitcoin Capital Markets", color: "from-indigo-500 to-purple-500" },
  { name: "Granite", description: "Multi-collateral Lending", color: "from-gray-500 to-slate-500" },
  { name: "STX Core", description: "Stacking & sBTC", color: "from-orange-400 to-bitcoin" },
];

// Conversation examples
const conversations = [
  { user: "Swap 100 STX for sBTC", ai: "Found best rate on ALEX: 0.0042 sBTC. Execute?" },
  { user: "What's the APY for stacking?", ai: "Current PoX cycle offers 8.2% APY in BTC rewards" },
  { user: "Lend 5000 USDA on Arkadiko", ai: "Current rate: 12.5% APY. Collateral needed: 150%" },
];

// Stats data
const stats = [
  { value: "144+", label: "Live Tools", icon: Zap },
  { value: "8+", label: "DeFi Protocols", icon: Layers },
  { value: "100%", label: "Bitcoin Secured", icon: Shield },
  { value: "0", label: "Private Keys Stored", icon: Lock },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
        <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
        <div className="max-w-7xl relative mx-auto">
          <Navbar>
            <NavbarLeft>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Image
                  src="/images/stacks.png"
                  alt="Stacks"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                Stacks<span className="text-primary">AI</span>
              </Link>
              <Navigation />
            </NavbarLeft>
            <NavbarRight>
              <Link
                href="/docs"
                className="hidden text-sm md:block hover:text-primary transition-colors"
              >
                Documentation
              </Link>
              <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                      <span>StacksAI</span>
                    </Link>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                    <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                      Documentation
                    </Link>
                    <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                      Roadmap
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </NavbarRight>
          </Navbar>
        </div>
      </header>

      {/* Hero Section - Split Screen Terminal Style */}
      <BeamsBackground intensity="medium">
        <section className="container mx-auto px-4 py-20 md:py-32 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Badge variant="outline" className="border-primary/40 bg-primary/5 animate-pulse-slow">
                <Sparkles className="mr-2 h-3 w-3 text-primary" />
                <span className="text-primary font-medium">
                  First Comprehensive MCP for Bitcoin DeFi
                </span>
              </Badge>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Talk to
                  <br />
                  <span className="bg-gradient-accent bg-clip-text text-transparent">
                    Bitcoin.
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Trade, lend, stack - through conversation.
                </p>
              </div>

              {/* Terminal Example */}
              <div className="bg-surface-elevated border border-primary/20 rounded-lg p-6 space-y-4 shadow-glow-purple">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="font-mono">stacks-ai-terminal</span>
                </div>

                <div className="space-y-3">
                  {conversations.map((conv, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.3 + 0.5 }}
                      className="space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-mono text-sm">$</span>
                        <span className="text-foreground font-mono text-sm">{conv.user}</span>
                      </div>
                      <div className="flex items-start gap-2 ml-4">
                        <MessageSquare className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span className="text-cyan-400/80 text-sm">{conv.ai}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 py-6 bg-gradient-purple hover:shadow-glow-purple transition-all transform hover:scale-105 text-white font-bold"
                >
                  <Link href="/chat">
                    Launch Terminal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-6 border-primary/40 hover:bg-primary/10"
                >
                  <Link href="/docs">
                    <Github className="mr-2 h-5 w-5" />
                    View Docs
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>144+ tools live</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>8+ protocols</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Protocol Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative h-[600px]"
            >
              {/* Protocol Cards - Floating Animation */}
              {protocols.map((protocol, idx) => (
                <motion.div
                  key={protocol.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: idx * 0.1 + 0.3 },
                    y: { duration: 3, delay: idx * 0.2, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 4, delay: idx * 0.3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute"
                  style={{
                    left: `${(idx % 3) * 35}%`,
                    top: `${Math.floor(idx / 3) * 25}%`,
                  }}
                >
                  <div className={`bg-gradient-to-br ${protocol.color} p-0.5 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group`}>
                    <div className="bg-surface-elevated/90 backdrop-blur-sm rounded-xl p-6 w-48 h-32 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-foreground">{protocol.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {protocol.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.line
                  x1="20%" y1="15%" x2="55%" y2="40%"
                  stroke="url(#gradient1)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                <motion.line
                  x1="55%" y1="15%" x2="20%" y2="40%"
                  stroke="url(#gradient2)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.2 }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5546FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F7931A" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        </section>
      </BeamsBackground>

      {/* Stats Section */}
      <section className="py-20 bg-surface border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Voice of <span className="bg-gradient-accent bg-clip-text text-transparent">Bitcoin DeFi</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Stop navigating complex DeFi interfaces. Just talk. StacksAI translates your words into blockchain actions across the entire Bitcoin L2 ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-white font-bold text-xl shadow-glow-purple">
                1
              </div>
              <div className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-300 h-full">
                <Terminal className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Speak Naturally</h3>
                <p className="text-muted-foreground">
                  &quot;Swap 100 STX for sBTC&quot; or &quot;What&apos;s the best yield for my tokens?&quot; - just type what you want in plain English.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-glow-cyan">
                2
              </div>
              <div className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-300 h-full">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI Understands</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your request, finds the best protocol (ALEX, Velar, Arkadiko, etc.), and prepares the optimal transaction.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-bitcoin rounded-full flex items-center justify-center text-white font-bold text-xl shadow-glow-bitcoin">
                3
              </div>
              <div className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-300 h-full">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">You Approve</h3>
                <p className="text-muted-foreground">
                  Review the transaction, sign with your wallet (Leather/Xverse), and it settles on Bitcoin. Your keys, your control.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Protocol Showcase */}
      <section className="py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Every Protocol. One Interface.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From swaps to loans, stacking to NFTs - access the complete Bitcoin DeFi ecosystem through a single conversation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {protocols.map((protocol, idx) => (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${protocol.color} p-0.5 rounded-xl transition-all duration-300 hover:scale-105`}>
                  <div className="bg-surface-elevated rounded-xl p-6 h-32 flex flex-col justify-between">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {protocol.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {protocol.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add more protocols CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              MCP-powered architecture. More protocols integrating every week.
            </p>
            <Button variant="outline" asChild className="border-primary/40 hover:bg-primary/10">
              <Link href="/docs">
                Integrate Your Protocol
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Real Use Cases */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Operations. Zero Complexity.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "DEX Aggregation",
                desc: "Automatically finds best swap rates across ALEX, Velar, BitFlow, and Charisma. One command, optimal execution.",
                icon: TrendingUp
              },
              {
                title: "Stacking for BTC Yields",
                desc: "Lock STX, earn Bitcoin. Simple query shows current APY, cycle info, and handles delegation or solo stacking.",
                icon: Shield
              },
              {
                title: "Lending & Borrowing",
                desc: "Check rates on Arkadiko and Granite, supply collateral, borrow USDA or other assets - all through conversation.",
                icon: Layers
              },
              {
                title: "NFT Management",
                desc: "Browse your Bitcoin NFTs, check floor prices, list for sale, or transfer - without leaving the terminal.",
                icon: Box
              },
              {
                title: "sBTC Bridge",
                desc: "Deposit BTC to Stacks or withdraw to Bitcoin mainnet. Get status updates and confirmations in real-time.",
                icon: Zap
              },
              {
                title: "Portfolio Analytics",
                desc: "Ask &apos;What&apos;s my portfolio worth?&apos; or &apos;Show my yield positions&apos; and get instant, comprehensive answers.",
                icon: Brain
              },
            ].map((useCase, idx) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-300 group"
              >
                <useCase.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why StacksAI */}
      <section className="py-32 bg-gradient-to-b from-primary/5 via-cyan-500/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Stacks<span className="text-primary">AI</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <Shield className="h-12 w-12 text-bitcoin mb-4" />
              <h3 className="text-2xl font-bold mb-4">Bitcoin Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every transaction settles on Bitcoin. Not a sidechain, not an optimistic rollup - real Bitcoin finality through Stacks&apos; Proof-of-Transfer consensus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Non-Custodial</h3>
              <p className="text-muted-foreground leading-relaxed">
                We never hold your keys or tokens. Connect your Leather or Xverse wallet, approve transactions, and maintain complete control of your assets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <Brain className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Actually Intelligent</h3>
              <p className="text-muted-foreground leading-relaxed">
                Not just keyword matching. Our AI understands context, compares protocols, calculates optimal routes, and explains complex DeFi operations in plain English.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <Zap className="h-12 w-12 text-bitcoin mb-4" />
              <h3 className="text-2xl font-bold mb-4">Open Protocol</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on Model Context Protocol (MCP). Any Stacks protocol can integrate their tools. Like ChatGPT plugins, but for Bitcoin DeFi - composable and permissionless.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-bitcoin/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Stop clicking.
              <br />
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Start talking.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              The entire Bitcoin DeFi ecosystem is waiting. Just ask.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="text-xl px-12 py-8 bg-gradient-purple hover:shadow-glow-purple transition-all transform hover:scale-105 text-white font-bold"
              >
                <Link href="/chat">
                  Launch Terminal Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-xl px-10 py-8 border-primary/40 hover:bg-primary/10"
              >
                <Link href="/docs">
                  Read the Docs
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Bitcoin secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Open source</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/stacks.png"
                  alt="Stacks"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">Stacks<span className="text-primary">AI</span></span>
              </div>
              <p className="text-muted-foreground max-w-md mb-6">
                Talk to Bitcoin. Access the entire Bitcoin DeFi ecosystem through conversation.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-primary/40 bg-primary/5">
                  <span className="text-primary">Built for Stacks Vibe Hackathon</span>
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Terminal</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/BlockchainOracle" className="hover:text-foreground transition-colors flex items-center">
                    GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Discord</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StacksAI. All rights reserved. Built with Bitcoin security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
