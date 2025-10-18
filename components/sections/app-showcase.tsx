"use client";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Screenshot from "@/components/ui/screenshot";
import { MessageSquare, TrendingUp, Wallet, Image as ImageIcon, Code, Coins } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const features = [
  {
    Icon: MessageSquare,
    name: "AI-Powered Chat",
    description: "Natural language interactions with Bitcoin DeFi protocols",
    href: "#",
    cta: "Try it now",
    className: "col-span-1 md:col-span-2 lg:col-span-1",
    gradient: "from-stacks-purple/20 to-stacks-purple/5",
    iconColor: "text-stacks-purple",
    glowColor: "group-hover:shadow-glow-purple",
  },
  {
    Icon: TrendingUp,
    name: "DEX Trading",
    description: "Swap tokens across ALEX, Velar, and Charisma with optimal routing",
    href: "#",
    cta: "Start trading",
    className: "col-span-1",
    gradient: "from-stacks-cyan/20 to-stacks-cyan/5",
    iconColor: "text-stacks-cyan",
    glowColor: "group-hover:shadow-glow-cyan",
  },
  {
    Icon: Wallet,
    name: "Transaction Receipts",
    description: "Clear, detailed transaction confirmations with real-time status",
    href: "#",
    cta: "View example",
    className: "col-span-1",
    gradient: "from-success/20 to-success/5",
    iconColor: "text-success",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(76,175,80,0.3)]",
  },
  {
    Icon: ImageIcon,
    name: "NFT Marketplace",
    description: "Discover, trade, and manage NFTs on TradePort marketplace",
    href: "#",
    cta: "Explore NFTs",
    className: "col-span-1 md:col-span-2",
    gradient: "from-stacks-coral/20 to-stacks-coral/5",
    iconColor: "text-stacks-coral",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,107,107,0.3)]",
  },
  {
    Icon: Code,
    name: "Smart Contracts",
    description: "Interact with Clarity smart contracts seamlessly",
    href: "#",
    cta: "Learn more",
    className: "col-span-1",
    gradient: "from-info/20 to-info/5",
    iconColor: "text-info",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(33,150,243,0.3)]",
  },
  {
    Icon: Coins,
    name: "Stacking Rewards",
    description: "Earn Bitcoin yield by stacking STX tokens",
    href: "#",
    cta: "Start stacking",
    className: "col-span-1",
    gradient: "from-bitcoin/20 to-bitcoin/5",
    iconColor: "text-bitcoin",
    glowColor: "group-hover:shadow-glow-bitcoin",
  },
];

const carouselScreenshots = [
  {
    title: "AI Chat Interface",
    src: "/screenshots/chat-full.png",
    description: "Chat naturally with your Bitcoin DeFi assistant",
  },
  {
    title: "Complete Transaction Flow",
    src: "/screenshots/transaction-flow.png",
    description: "From swap quote to confirmation in seconds",
  },
  {
    title: "NFT Collection Discovery",
    src: "/screenshots/nft-collection.png",
    description: "Explore trending collections and floor prices",
  },
  {
    title: "DEX Pool Analytics",
    src: "/screenshots/pool-stats.png",
    description: "Real-time liquidity pool data and APR",
  },
];

export function AppShowcase() {
  return (
    <section className="container mx-auto px-4 py-24">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Bitcoin DeFi Made{" "}
          <span className="bg-gradient-to-r from-[#5546FF] to-[#00D4FF] bg-clip-text text-transparent">
            Simple
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">
          Experience the power of AI-driven interactions with Stacks blockchain
        </p>
      </div>

      {/* Main Carousel */}
      <div className="mb-16">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {carouselScreenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                    <div className="aspect-[16/10] relative">
                      <Screenshot
                        src={screenshot.src}
                        alt={screenshot.title}
                        width={1200}
                        height={750}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {screenshot.title}
                      </h3>
                      <p className="text-gray-200">{screenshot.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Bento Grid Features */}
      <div className="mx-auto max-w-7xl">
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <button className="inline-flex items-center justify-center rounded-md bg-[#5546FF] px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-[#5546FF]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Get Started with Stacks Terminal
        </button>
      </div>
    </section>
  );
}
