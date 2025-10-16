"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Coins,
  Gift,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Wallet,
  Code,
  CheckCircle,
  PlusCircle,
  DollarSign,
  Puzzle,
  Clock
} from "lucide-react";

export default function RewardsDocsPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline">
            <Coins className="mr-2 h-3 w-3" />
            <span className="text-muted-foreground">Rewards & Incentives</span>
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30">
            <Clock className="mr-1 h-3 w-3" />
            Coming Soon
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Earn While You Build
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          Stacks AI will revolutionize Bitcoin DeFi by rewarding every action you take.
          Earn real value while building, transacting, and contributing to the Bitcoin ecosystem.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-cyan-500">Every</div>
            <div className="text-sm text-muted-foreground">DeFi Operation</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">Multi</div>
            <div className="text-sm text-muted-foreground">Protocol</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">Auto</div>
            <div className="text-sm text-muted-foreground">Rewards</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-500">Real</div>
            <div className="text-sm text-muted-foreground">Value</div>
          </div>
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-500" />
            <h2 className="text-3xl font-bold">Our Vision for Bitcoin DeFi Rewards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-500" />
                Bitcoin-Secured Incentives
              </h3>
              <p className="text-muted-foreground mb-4">
                Leverage Bitcoin's security model to create sustainable reward mechanisms.
                Every DeFi action on Stacks benefits from Bitcoin finality while earning ecosystem rewards.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  Bitcoin-secured transactions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  Protocol-native token rewards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  Stacking yield integration
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-blue-500" />
                Multi-Protocol Rewards
              </h3>
              <p className="text-muted-foreground mb-4">
                Earn rewards from multiple DeFi protocols simultaneously. When you perform actions,
                you automatically qualify for incentives across ALEX, Velar, Arkadiko, and more.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  ALEX trading rewards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Velar liquidity incentives
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Arkadiko stability rewards
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* How It Will Work */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">How Earning Will Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Take Action</h3>
            <p className="text-muted-foreground">
              Perform any DeFi operation through Stacks AI - swap tokens, provide liquidity,
              borrow assets, or register domains.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Auto-Qualification</h3>
            <p className="text-muted-foreground">
              Our system automatically detects qualifying actions and registers them with
              relevant reward programs without any additional effort.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Earn Rewards</h3>
            <p className="text-muted-foreground">
              Receive rewards directly in your wallet. Track your earnings through the dashboard
              and claim when ready.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Potential Qualifying Actions */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Potential Qualifying Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-500" />
              Trading & Liquidity
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Token swaps on ALEX, Velar, BitFlow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Liquidity provision across DEXes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Orderbook trading on ALEX
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Participation in token launches
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Lending & Borrowing
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Supply assets to Arkadiko/Granite
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                USDA stablecoin minting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Collateral management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Maintaining healthy loan positions
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-500" />
              Advanced DeFi
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Charisma vault strategies
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Blaze intent execution
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cross-protocol compositions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Smart contract interactions
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Ecosystem Building
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                .btc domain registrations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Community participation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Developer contributions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Referral activities
              </li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* Future Ecosystem */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Puzzle className="w-8 h-8 text-purple-500" />
              Future Reward Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expand your earning potential by connecting to multiple reward ecosystems simultaneously
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-500" />
                Protocol-Specific Rewards
              </h3>
              <p className="text-muted-foreground mb-4">
                Each DeFi protocol will offer its own reward mechanisms. Earn ALEX tokens from ALEX,
                liquidity mining rewards from Velar, stability incentives from BitFlow, and more.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span>Protocol governance tokens</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span>Trading fee rebates</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span>Liquidity mining rewards</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                Stacks Ecosystem Rewards
              </h3>
              <p className="text-muted-foreground mb-4">
                Participate in the broader Stacks ecosystem rewards. Earn STX through Stacking,
                participate in governance, and benefit from Bitcoin's security guarantees.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>STX Stacking yields</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>Ecosystem growth incentives</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>Bitcoin-backed rewards</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-cyan-500" />
            <h2 className="text-3xl font-bold">Coming Soon</h2>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're building the reward infrastructure for Bitcoin DeFi. Stay tuned for updates
            and be among the first to earn rewards for your DeFi activities on Stacks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-500 font-bold">1</span>
              </div>
              <p className="text-sm text-muted-foreground">Start using Stacks AI</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-500 font-bold">2</span>
              </div>
              <p className="text-sm text-muted-foreground">Perform DeFi operations</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-500 font-bold">3</span>
              </div>
              <p className="text-sm text-muted-foreground">Earn rewards when launched</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/chat">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Using Stacks AI
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/roadmap">
                <ArrowRight className="w-5 h-5 mr-2" />
                View Roadmap
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
