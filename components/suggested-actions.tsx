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
          title: "Token balances",
          label: "fungible token holdings",
          action: "Show all my token balances across different protocols",
        },
        {
          title: "STX transfer events",
          label: "sent and received STX",
          action: "Show me my recent STX transfer history",
        },
        {
          title: "Search by address",
          label: "look up blockchain address",
          action: "Search blockchain data for my address",
        },
      ],
    },
    {
      name: "ALEX DEX",
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
          title: "Get swap route",
          label: "optimal swap path",
          action: "What's the best route to swap STX for USDA on ALEX?",
        },
        {
          title: "Swap tokens",
          label: "execute token swap",
          action: "I want to swap 100 STX for ALEX tokens",
        },
        {
          title: "Pool statistics",
          label: "detailed pool metrics",
          action: "Show me detailed statistics for a specific ALEX pool",
        },
        {
          title: "Total value locked",
          label: "protocol TVL stats",
          action: "What is the total value locked in ALEX protocol?",
        },
        {
          title: "All swap history",
          label: "recent swap transactions",
          action: "Show me recent swaps on ALEX DEX",
        },
        {
          title: "Token mappings",
          label: "supported tokens list",
          action: "What tokens are available on ALEX?",
        },
      ],
    },
    {
      name: "Velar DEX",
      icon: <TrendingUp className="w-4 h-4" />,
      accent: "#9945FF", // Purple
      actions: [
        {
          title: "Velar token prices",
          label: "current token tickers",
          action: "What are the current token prices on Velar?",
        },
        {
          title: "Velar pools",
          label: "liquidity pool stats",
          action: "Show me all liquidity pools on Velar DEX",
        },
        {
          title: "Compare DEX prices",
          label: "Velar vs ALEX pricing",
          action: "Compare STX/USDA prices across Velar and ALEX",
        },
        {
          title: "Velar swap quote",
          label: "get swap pricing",
          action: "Get a swap quote for STX to USDA on Velar",
        },
        {
          title: "Execute Velar swap",
          label: "perform token swap",
          action: "I want to swap tokens on Velar DEX",
        },
        {
          title: "Supported tokens",
          label: "available token list",
          action: "What tokens does Velar support?",
        },
        {
          title: "Pool details",
          label: "specific pool info",
          action: "Show me details for a Velar liquidity pool",
        },
        {
          title: "Add liquidity",
          label: "provide pool liquidity",
          action: "I want to add liquidity to a Velar pool",
        },
      ],
    },
    {
      name: "Charisma DEX",
      icon: <Zap className="w-4 h-4" />,
      accent: "#FF6B9D", // Pink
      actions: [
        {
          title: "Charisma pools",
          label: "composable vault pools",
          action: "Show me liquidity pools on Charisma DEX",
        },
        {
          title: "Charisma swap quote",
          label: "get swap pricing",
          action: "Get a swap quote on Charisma for STX to token",
        },
        {
          title: "Execute swap",
          label: "perform token swap",
          action: "I want to swap tokens on Charisma DEX",
        },
        {
          title: "Add liquidity",
          label: "provide pool liquidity",
          action: "Add liquidity to a Charisma pool",
        },
        {
          title: "Remove liquidity",
          label: "withdraw from pool",
          action: "I want to remove liquidity from Charisma",
        },
      ],
    },
    {
      name: "Arkadiko DeFi",
      icon: <Coins className="w-4 h-4" />,
      accent: "#14F195", // Green
      actions: [
        {
          title: "Arkadiko token prices",
          label: "current token prices",
          action: "What are the current token prices on Arkadiko?",
        },
        {
          title: "View swap pairs",
          label: "available trading pairs",
          action: "Show me all swap pairs on Arkadiko",
        },
        {
          title: "Swap on Arkadiko",
          label: "execute token swap",
          action: "I want to swap tokens on Arkadiko DEX",
        },
        {
          title: "View vault info",
          label: "collateral debt positions",
          action: "Show me my Arkadiko vault information",
        },
        {
          title: "Create vault",
          label: "open CDP for USDA",
          action: "I want to create a new Arkadiko vault",
        },
        {
          title: "Stake info",
          label: "staking positions and rewards",
          action: "Show me my Arkadiko staking information",
        },
        {
          title: "Governance proposals",
          label: "view protocol proposals",
          action: "Show me current Arkadiko governance proposals",
        },
      ],
    },
    {
      name: "Granite Lending",
      icon: <Coins className="w-4 h-4" />,
      accent: "#8B5CF6", // Purple
      actions: [
        {
          title: "Borrow against sBTC",
          label: "get stablecoin loan",
          action: "I want to borrow stablecoins using sBTC as collateral on Granite",
        },
        {
          title: "Repay loan",
          label: "repay borrowed stablecoins",
          action: "I want to repay my Granite loan",
        },
        {
          title: "Add collateral",
          label: "deposit sBTC collateral",
          action: "I want to add sBTC collateral to Granite",
        },
        {
          title: "Supply stablecoins",
          label: "earn lending yield",
          action: "I want to supply stablecoins to Granite to earn yield",
        },
        {
          title: "Withdraw supplied assets",
          label: "withdraw with interest",
          action: "I want to withdraw my supplied assets from Granite",
        },
        {
          title: "Stake LP tokens",
          label: "earn additional rewards",
          action: "I want to stake my Granite LP tokens for extra rewards",
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
          label: "check on-chain NFT collections",
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
          title: "Search NFT collections",
          label: "find collections on TradePort",
          action: "Search for Bitcoin Monkeys NFT collection",
        },
        {
          title: "Collection details & stats",
          label: "floor price, volume, supply",
          action: "Show me detailed stats for a collection on TradePort",
        },
        {
          title: "My wallet NFTs on TradePort",
          label: "marketplace holdings & listings",
          action: "Show my NFT holdings from TradePort marketplace",
        },
        {
          title: "NFT collection floor history",
          label: "historical price data",
          action: "Show me the floor price history for a collection",
        },
        {
          title: "NFT collection offers",
          label: "active bids and offers",
          action: "Show me all offers for a NFT collection",
        },
        {
          title: "Collection holder distribution",
          label: "ownership analytics",
          action: "Show me holder distribution for a collection",
        },
        {
          title: "Make collection offer",
          label: "bid on collection floor",
          action: "I want to make a collection offer on TradePort",
        },
        {
          title: "List NFT for sale",
          label: "create marketplace listing",
          action: "I want to list my NFT for sale on TradePort",
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
          title: "My stacking status",
          label: "check if address is stacking",
          action: "Am I currently stacking my STX?",
        },
        {
          title: "Pool delegations",
          label: "stacking pool data",
          action: "Show me stacking pool delegations",
        },
        {
          title: "Delegate to pool",
          label: "join stacking pool",
          action: "I want to delegate my STX to a stacking pool",
        },
        {
          title: "Revoke delegation",
          label: "stop pool stacking",
          action: "I want to revoke my stacking delegation",
        },
        {
          title: "Burnchain rewards",
          label: "mining rewards history",
          action: "Show me recent burnchain rewards",
        },
        {
          title: "PoX cycle info",
          label: "current cycle details",
          action: "What is the current PoX cycle information?",
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
          title: "Read contract function",
          label: "read-only contract call",
          action: "I want to read data from a smart contract function",
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
        {
          title: "Contract source code",
          label: "view Clarity code",
          action: "Show me the source code for a smart contract",
        },
        {
          title: "Contract interface",
          label: "available functions",
          action: "What functions are available in a contract?",
        },
        {
          title: "Contract data map",
          label: "read contract storage",
          action: "Read a data map entry from a contract",
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
          title: "Block transactions",
          label: "all txs in a block",
          action: "Show me all transactions in a specific block",
        },
        {
          title: "Transaction details",
          label: "lookup transaction by ID",
          action: "Show me details for a specific transaction",
        },
        {
          title: "Transaction events",
          label: "events from a tx",
          action: "Show me all events from a specific transaction",
        },
        {
          title: "Address transaction events",
          label: "events for address and tx",
          action: "Show me transaction events for my address",
        },
        {
          title: "Fee estimates",
          label: "current network fees",
          action: "What are the current transaction fee estimates?",
        },
        {
          title: "Mempool stats",
          label: "pending transactions",
          action: "Show me current mempool statistics",
        },
        {
          title: "Network status",
          label: "blockchain health",
          action: "What is the current network status?",
        },
        {
          title: "Raw transaction data",
          label: "hex-encoded tx",
          action: "Get raw transaction data for a tx ID",
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
