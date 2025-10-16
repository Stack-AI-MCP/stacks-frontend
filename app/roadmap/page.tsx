"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Rocket,
  Monitor,
  Trophy,
  Mic,
  Smartphone,
  TrendingUp,
  Sparkles,
  Code,
  Wallet,
  Blocks
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "completed",
    timeframe: "COMPLETED",
    description: "148+ AI-powered tools for Bitcoin DeFi on Stacks - production-ready, no mock data",
    milestones: [
      {
        title: "148+ Live Operations",
        description: "Natural language interface for 8 major Stacks protocols",
        status: "completed",
        icon: Rocket
      },
      {
        title: "Full Wallet Integration",
        description: "Leather & Xverse wallet support for seamless transactions",
        status: "completed",
        icon: Wallet
      },
      {
        title: "Clarity Development Tools",
        description: "Smart contract generation, testing, and deployment",
        status: "completed",
        icon: Code
      },
      {
        title: "8 Protocol Integrations",
        description: "ALEX, Velar, BitFlow, Charisma, Arkadiko, Granite, BNS, Clarinet",
        status: "completed",
        icon: Blocks
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Desktop Application",
    status: "planned",
    timeframe: "Q1 2025",
    description: "Give users full control with a local-first desktop experience",
    milestones: [
      {
        title: "Native Desktop Apps",
        description: "Mac, Windows, and Linux applications for enhanced performance",
        status: "planned",
        icon: Monitor
      },
      {
        title: "Local-First Architecture",
        description: "Run everything locally for privacy and security",
        status: "planned",
        icon: CheckCircle
      },
      {
        title: "Clarinet Devnet Integration",
        description: "Connect to local development environment for testing",
        status: "planned",
        icon: Code
      },
      {
        title: "No API Rate Limits",
        description: "Unlimited operations without cloud infrastructure dependencies",
        status: "planned",
        icon: Sparkles
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Reputation & Rewards",
    status: "planned",
    timeframe: "Q1 2026",
    description: "Recognize and reward active community members with on-chain achievements",
    milestones: [
      {
        title: "Achievement System",
        description: "Track your DeFi journey with badges and points",
        status: "planned",
        icon: Trophy
      },
      {
        title: "On-Chain NFT Badges",
        description: "Exclusive NFT achievements on Stacks blockchain",
        status: "planned",
        icon: Sparkles
      },
      {
        title: "Leaderboard & Tiers",
        description: "Climb the ranks with tiered achievements",
        status: "planned",
        icon: TrendingUp
      },
      {
        title: "Early Adopter Perks",
        description: "Special recognition for pioneers and power users",
        status: "planned",
        icon: Rocket
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Voice Interface",
    status: "planned",
    timeframe: "Q2 2026",
    description: "Talk to Bitcoin DeFi - hands-free access for everyone",
    milestones: [
      {
        title: "Voice Commands",
        description: "Check balances, execute swaps, deploy contracts by voice",
        status: "planned",
        icon: Mic
      },
      {
        title: "Multi-Language Support",
        description: "Global accessibility with multiple language support",
        status: "planned",
        icon: Sparkles
      },
      {
        title: "Cross-Platform Voice",
        description: "Works on web and desktop applications",
        status: "planned",
        icon: Monitor
      },
      {
        title: "Accessibility First",
        description: "Hands-free DeFi for improved accessibility",
        status: "planned",
        icon: CheckCircle
      }
    ]
  },
  {
    phase: "Phase 5",
    title: "Mobile Experience",
    status: "planned",
    timeframe: "Q3 2026",
    description: "Bitcoin DeFi in your pocket - anytime, anywhere",
    milestones: [
      {
        title: "Progressive Web App",
        description: "Works on all mobile devices seamlessly",
        status: "planned",
        icon: Smartphone
      },
      {
        title: "Mobile Wallet Integration",
        description: "Native integration with mobile Stacks wallets",
        status: "planned",
        icon: Wallet
      },
      {
        title: "QR Code Support",
        description: "Scan addresses and transaction data easily",
        status: "planned",
        icon: CheckCircle
      },
      {
        title: "Biometric Security",
        description: "Touch ID / Face ID for secure transactions",
        status: "planned",
        icon: Sparkles
      }
    ]
  },
  {
    phase: "Phase 6",
    title: "Premium Tiers",
    status: "planned",
    timeframe: "Coming Soon",
    description: "Sustainable features that reward our most engaged users",
    milestones: [
      {
        title: "Free Tier",
        description: "Always free, always powerful - core DeFi operations",
        status: "planned",
        icon: CheckCircle
      },
      {
        title: "Premium Plans",
        description: "Pricing details coming soon - affordable for everyone",
        status: "planned",
        icon: Sparkles,
        blurred: true
      },
      {
        title: "Desktop App Access",
        description: "Enhanced features for desktop users",
        status: "planned",
        icon: Monitor,
        blurred: true
      },
      {
        title: "API Access",
        description: "Build on top of Stacks AI infrastructure",
        status: "planned",
        icon: Code,
        blurred: true
      }
    ]
  }
];

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-cyan-500",
  planned: "bg-slate-500"
};

const statusIcons = {
  completed: CheckCircle,
  "in-progress": Clock,
  planned: Calendar
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              <span className="text-muted-foreground">Product Roadmap</span>
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Building the Future of Bitcoin DeFi
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Making Bitcoin DeFi accessible through natural language. 148+ tools live.
              Desktop apps, rewards, voice interface, and more coming soon.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try Stacks AI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">From Foundation to Innovation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Phase 1 complete - we've shipped production-ready Bitcoin DeFi tools.
              Now we're building the platform for the future.
            </p>
          </motion.div>

          <div className="space-y-16">
            {roadmapPhases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Phase Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'in-progress' ? 'bg-cyan-500' : 'bg-slate-500'
                  }`}>
                    {phase.phase.split(' ')[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold">{phase.title}</h3>
                      <Badge variant={phase.status === 'completed' ? 'default' : 'secondary'}>
                        {phase.timeframe}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-22">
                  {phase.milestones.map((milestone, milestoneIndex) => {
                    const Icon = milestone.icon;
                    const StatusIcon = statusIcons[milestone.status as keyof typeof statusIcons];

                    return (
                      <motion.div
                        key={milestone.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 + milestoneIndex * 0.1 }}
                        viewport={{ once: true }}
                        className={`p-6 border rounded-xl bg-card/50 backdrop-blur-sm ${
                          milestone.blurred ? 'relative overflow-hidden' : ''
                        }`}
                      >
                        {milestone.blurred && (
                          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 z-10 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground font-semibold">Coming Soon</span>
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Icon className={`h-6 w-6 ${
                              milestone.status === 'completed' ? 'text-green-500' : 'text-cyan-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <StatusIcon className={`h-4 w-4 ${
                                milestone.status === 'completed' ? 'text-green-500' :
                                milestone.status === 'in-progress' ? 'text-cyan-500' : 'text-slate-400'
                              }`} />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Phase Connector */}
                {phaseIndex < roadmapPhases.length - 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="w-1 h-12 bg-gradient-to-b from-cyan-500/50 to-muted"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Bitcoin DeFi Revolution</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              148+ tools live and ready. Desktop apps in Q1 2025. Rewards, voice, mobile, and premium tiers coming.
              Be part of making Bitcoin DeFi accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Try Stacks AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  Contribute on GitHub
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Built during the Stacks Vibe Coding Hackathon 2025
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
