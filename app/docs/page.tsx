"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Server,
  FileText,
  Puzzle,
  HelpCircle,
  ArrowRight,
  Building2,
  Zap,
  Shield,
  Gift,
  Crown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickStart = [
  {
    step: "1",
    title: "Connect Your Wallet",
    description: "Connect your Leather or Xverse wallet to start using Stacks AI",
    href: "/docs/getting-started"
  },
  {
    step: "2",
    title: "Explore the Interface",
    description: "Learn about the AI chat interface and 148+ available tools",
    href: "/docs/getting-started"
  },
  {
    step: "3",
    title: "Start Querying",
    description: "Begin interacting with Bitcoin DeFi using natural language",
    href: "/chat"
  }
];

const featuredSections = [
  {
    name: "Getting Started",
    href: "/docs/getting-started",
    icon: BookOpen,
    description: "New to Stacks AI? Start here for a quick introduction to Bitcoin DeFi with natural language.",
    badge: "Popular"
  },
  {
    name: "Protocols",
    href: "/docs/protocols",
    icon: FileText,
    description: "Complete documentation for all 8 integrated Stacks DeFi protocols and their capabilities.",
    badge: "Essential"
  },
  {
    name: "Architecture",
    href: "/docs/architecture",
    icon: Building2,
    description: "Deep dive into the MCP-powered system design and technical architecture.",
    badge: "Technical"
  },
  {
    name: "MCP Server",
    href: "/docs/mcp-server",
    icon: Server,
    description: "Set up and configure the Model Context Protocol server for Bitcoin DeFi operations.",
    badge: "Advanced"
  }
];

const allSections = [
  {
    name: "Rewards",
    href: "/docs/rewards",
    icon: Gift,
    description: "Learn about earning rewards through the Stacks ecosystem"
  },
  {
    name: "Premium",
    href: "/docs/premium",
    icon: Crown,
    description: "Unlock advanced features with Stacks AI Premium"
  },
  {
    name: "FAQ",
    href: "/docs/faq",
    icon: HelpCircle,
    description: "Common questions and troubleshooting tips"
  }
];

export default function DocsPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Documentation</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Stacks AI Documentation
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Everything you need to build powerful Bitcoin DeFi applications with Stacks AI.
          From quick start guides to advanced protocol integrations across 8 DeFi protocols.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/docs/getting-started">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/chat">
              Try Live Demo
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStart.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Link href={item.href} className="block p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </Link>
              {index < quickStart.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Sections */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={section.href} className="block p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-cyan-500" />
                      <h3 className="font-semibold text-lg">{section.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {section.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-cyan-500 text-sm font-medium">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* All Sections */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Browse All Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={section.href} className="block p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 h-full text-center">
                  <Icon className="h-8 w-8 text-cyan-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-3">{section.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Help Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-card/30 backdrop-blur-sm border rounded-2xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Can't find what you're looking for? Our AI assistant is here to help you succeed
          with Bitcoin DeFi on Stacks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/docs/faq">
              <HelpCircle className="mr-2 h-4 w-4" />
              View FAQ
            </Link>
          </Button>
          <Button asChild>
            <Link href="/chat">
              <Zap className="mr-2 h-4 w-4" />
              Ask AI Assistant
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
