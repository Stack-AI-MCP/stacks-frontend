"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo, useState } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { toast } from "sonner";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import {
  Wallet,
  Coins,
  TrendingUp,
  Blocks,
  FileCode,
  Image,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
}

interface ToolCategory {
  name: string;
  icon: React.ReactNode;
  accent: string; // For subtle accents only
  actions: {
    title: string;
    label: string;
    action: string;
  }[];
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const { isConnected } = useWalletAuth();
  const [activeCategory, setActiveCategory] = useState(0);

  const categories: ToolCategory[] = [
    {
      name: "Account & Wallet",
      icon: <Wallet className="w-4 h-4" />,
      accent: "#5546FF", // Stacks Purple
      actions: [
        {
          title: "Check my STX balance",
          label: "view wallet STX balance",
          action: "Show me my STX balance and account information",
        },
        {
          title: "View transaction history",
          label: "recent account transactions",
          action: "Show my recent transaction history",
        },
        {
          title: "Check account nonces",
          label: "view account nonce info",
          action: "What are my current account nonces?",
        },
        {
          title: "Search by address",
          label: "look up blockchain address",
          action: "Search blockchain data for my address",
        },
      ],
    },
    {
      name: "DeFi & Trading",
      icon: <TrendingUp className="w-4 h-4" />,
      accent: "#00D4FF", // Cyan
      actions: [
        {
          title: "ALEX token prices",
          label: "current DEX token prices",
          action: "What are the current token prices on ALEX DEX?",
        },
        {
          title: "View liquidity pools",
          label: "top pools with TVL and APR",
          action: "Show me the top liquidity pools on ALEX",
        },
        {
          title: "Compare DEX prices",
          label: "Velar vs ALEX pricing",
          action: "Compare STX/USDA prices across Velar and ALEX",
        },
        {
          title: "Swap tokens on ALEX",
          label: "execute token swap",
          action: "I want to swap 100 STX for ALEX tokens",
        },
        {
          title: "Check Arkadiko vaults",
          label: "lending protocol vaults",
          action: "Show me my Arkadiko vault information",
        },
        {
          title: "Granite lending rates",
          label: "borrow and supply APR",
          action: "What are the current lending rates on Granite?",
        },
      ],
    },
    {
      name: "NFTs & Collections",
      icon: <Image className="w-4 h-4" />,
      accent: "#F7931A", // Bitcoin Orange
      actions: [
        {
          title: "View my NFT holdings",
          label: "check NFT collections",
          action: "Show me my NFT collections and holdings",
        },
        {
          title: "NFT transaction history",
          label: "recent NFT transfers",
          action: "Show my recent NFT transaction history",
        },
        {
          title: "Transfer an NFT",
          label: "send NFT to address",
          action: "I want to transfer an NFT to another address",
        },
        {
          title: "Trending NFT collections",
          label: "hot collections on TradePort",
          action: "What are the trending NFT collections this week?",
        },
        {
          title: "Collection floor prices",
          label: "search NFT collections",
          action: "Show me floor prices for Bitcoin Monkeys collection",
        },
      ],
    },
    {
      name: "Stacking & Rewards",
      icon: <Coins className="w-4 h-4" />,
      accent: "#5546FF", // Stacks Purple
      actions: [
        {
          title: "What is Bitcoin stacking?",
          label: "learn about earning BTC rewards",
          action: "Explain how stacking works and how to earn Bitcoin rewards",
        },
        {
          title: "Current stacking info",
          label: "PoX cycle and rewards",
          action: "Show me current stacking information and PoX cycles",
        },
        {
          title: "Pool delegations",
          label: "stacking pool data",
          action: "Show me stacking pool delegations",
        },
        {
          title: "Burnchain rewards",
          label: "mining rewards history",
          action: "Show me recent burnchain rewards",
        },
      ],
    },
    {
      name: "Smart Contracts",
      icon: <FileCode className="w-4 h-4" />,
      accent: "#00D4FF", // Cyan
      actions: [
        {
          title: "View contract info",
          label: "deployed contract details",
          action: "Show me information about a smart contract",
        },
        {
          title: "Call contract function",
          label: "execute contract call",
          action: "I want to call a function on a smart contract",
        },
        {
          title: "Deploy new contract",
          label: "publish Clarity contract",
          action: "Help me deploy a new Clarity smart contract",
        },
        {
          title: "Contract events",
          label: "view contract logs",
          action: "Show me recent events from a contract",
        },
      ],
    },
    {
      name: "Blockchain Data",
      icon: <Blocks className="w-4 h-4" />,
      accent: "#F7931A", // Bitcoin Orange
      actions: [
        {
          title: "Current block height",
          label: "latest blockchain height",
          action: "What is the current Stacks block height?",
        },
        {
          title: "Get block by height",
          label: "fetch specific block data",
          action: "Show me block information for height 150000",
        },
        {
          title: "Transaction details",
          label: "lookup transaction by ID",
          action: "Show me details for a specific transaction",
        },
        {
          title: "Fee estimates",
          label: "current network fees",
          action: "What are the current transaction fee estimates?",
        },
      ],
    },
  ];

  const handleActionClick = async (action: string) => {
    if (!isConnected) {
      toast.error("Please connect your Stacks wallet to send a message");
      return;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: action }],
    });
  };

  return (
    <div data-testid="suggested-actions" className="w-full space-y-4">
      {/* Category Pills - Terminal Style */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(index);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium whitespace-nowrap transition-all snap-start ${
                activeCategory === index
                  ? "bg-[#1A1A1A] border-[#5546FF] shadow-[0_0_15px_rgba(85,70,255,0.2)]"
                  : "bg-[#0A0A0A] border-[#2E2E2E] hover:border-[#5546FF]/50 hover:bg-[#1A1A1A]/50"
              }`}
              style={
                activeCategory === index
                  ? {
                      boxShadow: `0 0 15px ${category.accent}40`,
                      borderColor: category.accent,
                    }
                  : undefined
              }
            >
              <span style={activeCategory === index ? { color: category.accent } : undefined}>
                {category.icon}
              </span>
              <span className={activeCategory === index ? "text-[#E0E0E0]" : "text-[#A0A0A0]"}>
                {category.name}
              </span>
              <span className="text-xs opacity-50">({category.actions.length})</span>
            </motion.button>
          ))}
        </div>
        {/* Fade edge indicator */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
      </div>

      {/* Action Cards - Terminal Card Style */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3 pr-4">
            {categories[activeCategory].actions.map((suggestedAction, index) => (
              <motion.div
                key={`${suggestedAction.title}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex-shrink-0 w-[280px] sm:w-[320px]"
              >
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleActionClick(suggestedAction.action);
                  }}
                  className="relative text-left border border-[#2E2E2E] rounded-lg px-4 py-4 w-full h-full bg-[#1A1A1A] hover:bg-[#242424] hover:border-[#5546FF]/50 transition-all group"
                  style={{
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {/* Accent bar on left */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: categories[activeCategory].accent }}
                  />

                  {/* Content */}
                  <div className="pl-0 group-hover:pl-2 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#E0E0E0] text-base leading-tight">
                        {suggestedAction.title}
                      </span>
                      <ChevronRight
                        className="w-5 h-5 text-[#5546FF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                      />
                    </div>
                    <span className="text-[#A0A0A0] text-xs block">
                      {suggestedAction.label}
                    </span>
                  </div>

                  {/* Subtle glow on hover */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${categories[activeCategory].accent}15`,
                    }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Peek indicator */}
        {categories[activeCategory].actions.length > 2 && (
          <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
            <ChevronRight className="w-5 h-5 text-[#5546FF] animate-pulse" />
          </div>
        )}
      </div>

      {/* Stats Footer - Terminal Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 text-xs text-[#A0A0A0] pt-2 border-t border-[#2E2E2E]/50"
      >
        <Zap className="w-3 h-3 text-[#5546FF]" />
        <span>
          {categories.reduce((sum, cat) => sum + cat.actions.length, 0)}+ AI-powered tools
          across {categories.length} categories
        </span>
      </motion.div>
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    return true;
  }
);
