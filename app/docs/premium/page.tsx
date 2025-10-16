"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Crown,
  Zap,
  Shield,
  TrendingUp,
  Brain,
  Sparkles,
  Check,
  ArrowRight,
  Clock,
  Star,
  Rocket,
  Lock,
  BarChart,
  Bot,
  Code,
  Database,
  FileText
} from "lucide-react";

const premiumFeatures = [
  {
    category: "Advanced AI Capabilities",
    icon: Brain,
    color: "text-cyan-500",
    features: [
      "Priority AI response processing",
      "Advanced natural language understanding",
      "Multi-step transaction planning",
      "Predictive DeFi analytics",
      "Custom AI model fine-tuning"
    ]
  },
  {
    category: "Professional Trading Tools",
    icon: TrendingUp,
    color: "text-blue-500",
    features: [
      "Advanced charting and technical analysis",
      "Real-time price alerts across protocols",
      "Portfolio optimization suggestions",
      "Risk management automation",
      "Historical data and backtesting"
    ]
  },
  {
    category: "Enhanced Security",
    icon: Shield,
    color: "text-green-500",
    features: [
      "Transaction simulation before execution",
      "Smart contract audit summaries",
      "Slippage protection advanced controls",
      "MEV protection strategies",
      "Multi-signature wallet support"
    ]
  },
  {
    category: "Protocol Insights",
    icon: BarChart,
    color: "text-purple-500",
    features: [
      "Deep protocol analytics dashboard",
      "Liquidity pool health monitoring",
      "Lending rate predictions",
      "Yield optimization strategies",
      "Protocol comparison tools"
    ]
  },
  {
    category: "Automation & Bots",
    icon: Bot,
    color: "text-orange-500",
    features: [
      "Custom DeFi automation strategies",
      "Yield farming auto-compound",
      "Rebalancing bots",
      "Stop-loss and take-profit orders",
      "Webhook integrations"
    ]
  },
  {
    category: "Developer Access",
    icon: Code,
    color: "text-pink-500",
    features: [
      "API access with higher rate limits",
      "Custom MCP tool development",
      "Advanced debugging tools",
      "Testnet priority support",
      "SDK and documentation access"
    ]
  }
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with Bitcoin DeFi",
    features: [
      "148+ DeFi tools across 8 protocols",
      "Natural language interface",
      "Basic wallet operations",
      "Standard transaction speeds",
      "Community support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "$29",
    period: "/month",
    description: "For serious DeFi users and traders",
    features: [
      "All Free features",
      "Priority AI processing",
      "Advanced analytics",
      "Custom automation",
      "API access",
      "Priority support",
      "No rate limits"
    ],
    buttonText: "Coming Soon",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and institutions",
    features: [
      "All Premium features",
      "Dedicated infrastructure",
      "Custom integrations",
      "White-label options",
      "SLA guarantees",
      "Dedicated account manager",
      "Custom training"
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    popular: false
  }
];

export default function PremiumPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Badge variant="outline">
            <Crown className="mr-2 h-3 w-3" />
            <span className="text-muted-foreground">Premium Features</span>
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30">
            <Clock className="mr-1 h-3 w-3" />
            Coming Soon
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Unlock Advanced Bitcoin DeFi
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
          Take your Bitcoin DeFi experience to the next level with Stacks AI Premium.
          Advanced features, automation, and insights for serious users and professionals.
        </p>
      </motion.div>

      {/* Why Premium */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Premium?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">10x Faster</h3>
            <p className="text-muted-foreground">
              Priority processing for AI requests and blockchain operations. Your transactions
              get handled first with optimized routing.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smarter AI</h3>
            <p className="text-muted-foreground">
              Advanced AI models with deeper understanding of complex DeFi strategies
              and multi-protocol compositions.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">More Power</h3>
            <p className="text-muted-foreground">
              Automation, custom strategies, API access, and developer tools to build
              your own Bitcoin DeFi applications.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Feature Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Premium Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <h3 className="font-semibold">{category.category}</h3>
                  </div>

                  <ul className="space-y-3">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Pricing Tiers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-cyan-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`p-8 h-full flex flex-col ${tier.popular ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.buttonVariant}
                  className={`w-full ${tier.popular ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : ''}`}
                  disabled={tier.name !== "Free"}
                >
                  {tier.buttonText}
                  {tier.name === "Free" && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Who Benefits from Premium?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Professional Traders</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Execute complex trading strategies across multiple protocols with advanced analytics,
              automation, and priority execution. Perfect for those managing significant portfolios.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Multi-protocol arbitrage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Automated risk management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Advanced order types</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Code className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold">Developers & Builders</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Build custom DeFi applications, integrate with Stacks AI via API, and develop
              custom MCP tools. Full access to our infrastructure and documentation.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">API access with high limits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Custom MCP tool creation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Developer documentation</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Database className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Yield Farmers</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Maximize returns with automated yield optimization, auto-compounding, and
              real-time opportunity detection across all 8 integrated protocols.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Auto-compound strategies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Yield opportunity alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Portfolio rebalancing</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold">Institutions & DAOs</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Enterprise-grade features for managing treasury operations, compliance reporting,
              and multi-signature workflows across Bitcoin DeFi protocols.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Multi-sig support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Compliance tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Dedicated support</span>
              </li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-cyan-500" />
            <h2 className="text-3xl font-bold">Be Among the First</h2>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium features are coming soon. Start using Stacks AI today and be notified
            when Premium launches with exclusive early access benefits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/chat">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Now
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Lock className="w-5 h-5 mr-2" />
              Join Waitlist
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Premium subscribers will get lifetime discounts and exclusive features
          </p>
        </Card>
      </motion.section>
    </div>
  );
}
