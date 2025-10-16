"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Wallet,
  Coins,
  Shield,
  Code,
  ArrowRightLeft,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is Stacks AI?",
    answer: "Stacks AI is an AI-powered Bitcoin DeFi interface that allows you to interact with 8 major Stacks protocols using natural language. Instead of navigating complex DeFi interfaces, you simply tell the AI what you want to accomplish - like 'swap 100 STX for ALEX' or 'check my lending position on Arkadiko' - and it handles the technical complexity for you."
  },
  {
    category: "getting-started",
    question: "How do I get started with Stacks AI?",
    answer: "Getting started is simple: 1) Connect your Leather or Xverse wallet, 2) Start typing what you want to do in natural language, 3) The AI will guide you through each step and handle the blockchain interactions. No technical knowledge of Clarity smart contracts required!"
  },
  {
    category: "getting-started",
    question: "What wallets are supported?",
    answer: "Stacks AI supports Leather (recommended) and Xverse wallets. Both are excellent Stacks-native wallets with full support for Bitcoin settlement and Clarity smart contracts. Make sure your wallet is connected to the correct network (mainnet or testnet)."
  },
  {
    category: "getting-started",
    question: "Is Stacks AI free to use?",
    answer: "Yes, Stacks AI is free to use. You only pay standard Stacks network fees (in STX) for transactions you choose to execute. The AI interface and all 148+ tools are provided at no additional cost. Built for the Stacks Vibe Coding Hackathon 2025."
  },

  // Wallet & Transactions
  {
    category: "wallet",
    question: "How do I check my STX balance?",
    answer: "Simply ask: 'What's my STX balance?' or 'Show my wallet balance'. The AI will instantly fetch and display your current STX balance, including any stacked or locked STX."
  },
  {
    category: "wallet",
    question: "Can I send STX to other addresses?",
    answer: "Yes! Just say something like 'Send 100 STX to [address]' or 'Transfer 50 STX to my friend'. The AI will check your balance, calculate fees, and create the transaction for you to approve in your wallet."
  },
  {
    category: "wallet",
    question: "What about SIP-010 tokens like ALEX or USDA?",
    answer: "Stacks AI supports all SIP-010 tokens across the ecosystem. Try: 'Send 50 ALEX to [address]' or 'What's my USDA balance?'. The AI automatically handles token contracts and decimals."
  },
  {
    category: "wallet",
    question: "How do transaction fees work on Stacks?",
    answer: "Stacks transactions use STX for gas fees. The AI automatically estimates and includes appropriate fees for your transactions. All transactions ultimately settle on Bitcoin, providing unmatched security."
  },

  // DeFi Operations
  {
    category: "defi",
    question: "How do I swap tokens on ALEX?",
    answer: "Just say 'Swap 100 STX for ALEX' or 'Trade STX to USDA on ALEX'. The AI will check the current rate, calculate slippage, and create the swap transaction. You can also ask 'What's the best rate for swapping STX?' to compare across DEXes."
  },
  {
    category: "defi",
    question: "Can I compare rates across multiple DEXes?",
    answer: "Absolutely! Ask 'Compare STX/USDA rates on ALEX, Velar, and BitFlow' and the AI will fetch real-time rates from all three DEXes, helping you find the best execution price."
  },
  {
    category: "defi",
    question: "How do I provide liquidity on Velar?",
    answer: "Say 'Add liquidity to STX/ALEX pool on Velar' and specify amounts. The AI will calculate the optimal ratio, show you estimated LP tokens and fees, then create the transaction."
  },
  {
    category: "defi",
    question: "What's the difference between ALEX, Velar, and BitFlow?",
    answer: "ALEX offers AMM + orderbook + launchpad features. Velar is a multi-chain DEX with comprehensive liquidity tools. BitFlow focuses on stablecoin swaps with low slippage. The AI can help you choose the best protocol for your specific trade."
  },

  // Lending
  {
    category: "lending",
    question: "How do I borrow USDA on Arkadiko?",
    answer: "Say 'Borrow 1000 USDA on Arkadiko using STX collateral'. The AI will show you collateral requirements, liquidation thresholds, and interest rates before creating the loan."
  },
  {
    category: "lending",
    question: "Can I compare lending rates across protocols?",
    answer: "Yes! Ask 'Compare STX lending rates on Arkadiko and Granite'. The AI will fetch current APYs for both supply and borrow rates across protocols."
  },
  {
    category: "lending",
    question: "How do I monitor my loan health?",
    answer: "Ask 'Show my Arkadiko position' or 'What's my loan health on Granite?' The AI displays your collateral ratio, liquidation price, and debt status in real-time."
  },
  {
    category: "lending",
    question: "What happens if I get liquidated?",
    answer: "If your collateral value drops below the liquidation threshold, your position can be liquidated to repay the debt. The AI monitors your health factor and warns you when you're approaching liquidation."
  },

  // BNS & Domains
  {
    category: "bns",
    question: "How do I register a .btc domain?",
    answer: "Say 'Register bitcoin.btc' or 'Check if myname.btc is available'. The AI will check availability, show registration costs, and guide you through the registration process using the BNS protocol."
  },
  {
    category: "bns",
    question: "Can I transfer my .btc domain?",
    answer: "Yes! Say 'Transfer myname.btc to [address]'. The AI will create the transfer transaction. Remember, .btc domains are NFTs on Stacks with full ownership rights."
  },
  {
    category: "bns",
    question: "How do domain renewals work?",
    answer: "BNS domains have expiration dates. Ask 'When does my domain expire?' or 'Renew bitcoin.btc' to extend ownership. The AI will show renewal costs and handle the transaction."
  },

  // Charisma & Advanced
  {
    category: "advanced",
    question: "What are Charisma vaults?",
    answer: "Charisma vaults are composable DeFi strategies that automate yield farming across multiple protocols. You can create custom strategies or use existing vaults. Ask 'Show me Charisma vault options' to explore."
  },
  {
    category: "advanced",
    question: "How does the Blaze protocol work?",
    answer: "Blaze is Charisma's intent-based protocol that lets you describe complex DeFi operations in simple terms. The protocol figures out the optimal execution path across multiple protocols automatically."
  },
  {
    category: "advanced",
    question: "Can I batch multiple DeFi operations?",
    answer: "Yes! Try 'Swap STX for ALEX, then add liquidity to ALEX/USDA pool, then stake in Charisma vault'. The AI will execute operations sequentially, optimizing gas and execution."
  },

  // Troubleshooting
  {
    category: "troubleshooting",
    question: "Why isn't my wallet connecting?",
    answer: "Common solutions: 1) Ensure Leather or Xverse is installed and unlocked, 2) Check you're on the correct network (mainnet/testnet), 3) Refresh the page and try reconnecting, 4) Clear browser cache if issues persist."
  },
  {
    category: "troubleshooting",
    question: "Transaction failed - what went wrong?",
    answer: "Provide the transaction hash and ask 'Why did my transaction fail?'. The AI will analyze the Clarity contract call, check for revert reasons, insufficient balance, or slippage issues and explain what happened."
  },
  {
    category: "troubleshooting",
    question: "I don't have enough STX for fees",
    answer: "You need STX for transaction fees on Stacks. You can: 1) Purchase STX on an exchange, 2) Bridge from another chain, 3) Ask 'Where can I get STX?' for current options."
  },
  {
    category: "troubleshooting",
    question: "My swap has high slippage",
    answer: "High slippage indicates low liquidity. Try: 1) Reducing swap amount, 2) Using a different DEX (ask 'Compare rates'), 3) Splitting into multiple smaller swaps, or 4) Using limit orders on ALEX."
  },
  {
    category: "troubleshooting",
    question: "AI doesn't understand my request",
    answer: "Try rephrasing more simply: instead of technical jargon, use plain language like 'swap tokens', 'check balance', or 'borrow USDA'. The AI is trained on natural language patterns and Bitcoin DeFi terminology."
  },

  // MCP & Technical
  {
    category: "technical",
    question: "What is the Model Context Protocol?",
    answer: "MCP is a standard protocol that allows AI assistants like Claude to interact with external tools and services. Stacks MCP Server implements 148+ tools for Bitcoin DeFi operations that Claude can use to help you."
  },
  {
    category: "technical",
    question: "How do I use Stacks AI in Claude Desktop?",
    answer: "Install the Stacks MCP Server following the docs, configure your Claude Desktop with the MCP config file, and restart Claude. Then you can chat with Claude about Bitcoin DeFi directly in the app."
  },
  {
    category: "technical",
    question: "Are my private keys secure?",
    answer: "Yes! Your private keys never leave your Leather or Xverse wallet. Stacks AI only requests transaction signatures from your wallet - it cannot access your keys or execute transactions without your explicit approval."
  },
  {
    category: "technical",
    question: "How does Bitcoin settlement work?",
    answer: "Stacks is a Bitcoin Layer 2. All Stacks blocks and transactions are anchored to Bitcoin blocks, inheriting Bitcoin's security. Every Stacks transaction gets Bitcoin finality, making it as secure as Bitcoin itself."
  },
  {
    category: "technical",
    question: "What's the difference between mainnet and testnet?",
    answer: "Mainnet uses real STX and tokens with value. Testnet uses test STX for development without risk. Stacks AI works on both - it automatically detects your network from your wallet."
  }
];

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: HelpCircle,
    description: "Basic questions about Stacks AI"
  },
  {
    id: "wallet",
    name: "Wallet & Transactions",
    icon: Wallet,
    description: "Managing STX and token balances"
  },
  {
    id: "defi",
    name: "DeFi Trading",
    icon: ArrowRightLeft,
    description: "Swapping and providing liquidity"
  },
  {
    id: "lending",
    name: "Lending & Borrowing",
    icon: Coins,
    description: "Arkadiko and Granite protocols"
  },
  {
    id: "bns",
    name: "BNS Domains",
    icon: Shield,
    description: ".btc domain registration"
  },
  {
    id: "advanced",
    name: "Advanced Features",
    icon: Zap,
    description: "Charisma vaults and Blaze"
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    icon: AlertCircle,
    description: "Common issues and solutions"
  },
  {
    id: "technical",
    name: "MCP & Technical",
    icon: Code,
    description: "MCP server and Bitcoin security"
  }
];

function FAQCategory({ category, items }: { category: typeof categories[0], items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <category.icon className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-left bg-muted/50 hover:bg-muted/70 rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </Button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 bg-background"
                  >
                    <div className="pt-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <HelpCircle className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">FAQ</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          Find answers to common questions about Stacks AI. From basic wallet operations to advanced
          cross-protocol DeFi strategies on Bitcoin Layer 2.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-cyan-500">{faqData.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">148+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-500">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <div className="bg-muted/50 rounded-lg p-2 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-md h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FAQCategory
            category={categories.find(cat => cat.id === selectedCategory)!}
            items={faqData.filter(faq => faq.category === selectedCategory)}
          />
        </motion.div>
      </div>

      {/* Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <CheckCircle className="w-8 h-8 text-cyan-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Try asking Stacks AI directly -
            it's designed to understand and answer questions about Bitcoin DeFi in natural language.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <HelpCircle className="w-4 h-4 mr-2" />
              Try Stacks AI
            </Button>
            <Button variant="outline">
              <Info className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
