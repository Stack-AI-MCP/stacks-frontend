"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code,
  Server,
  HelpCircle,
  Building2,
  Trophy,
  Sparkles,
  Rocket,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const docsNavigation = [
  {
    name: "Getting Started",
    href: "/docs/getting-started",
    icon: Rocket,
    description: "Quick start guide and wallet setup"
  },
  {
    name: "Architecture",
    href: "/docs/architecture",
    icon: Building2,
    description: "System design and MCP overview"
  },
  {
    name: "Protocols",
    href: "/docs/protocols",
    icon: Code,
    description: "8 integrated Stacks DeFi protocols"
  },
  {
    name: "Examples",
    href: "/docs/examples",
    icon: Terminal,
    description: "All 148+ tools and example queries"
  },
  {
    name: "MCP Server",
    href: "/docs/mcp-server",
    icon: Server,
    description: "Model Context Protocol integration"
  },
  {
    name: "FAQ",
    href: "/docs/faq",
    icon: HelpCircle,
    description: "Frequently asked questions"
  },
  {
    name: "Rewards",
    href: "/docs/rewards",
    icon: Trophy,
    description: "Reputation system (Q1 2026)",
    badge: "Coming Soon"
  },
  {
    name: "Premium Tiers",
    href: "/docs/premium",
    icon: Sparkles,
    description: "Pricing and premium features",
    badge: "Coming Soon"
  }
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-card/30 backdrop-blur-sm fixed h-screen overflow-y-auto">
          <div className="h-full p-6 space-y-6">
            <div>
              <Link href="/docs" className="flex items-center gap-2 text-xl font-bold mb-2">
                <BookOpen className="h-6 w-6 text-cyan-400" />
                Documentation
              </Link>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about Stacks AI
              </p>
            </div>

            <nav className="space-y-2">
              {docsNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link href="/chat">
                  Try Stacks AI
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <aside className="w-64 h-full bg-card border-r p-6 space-y-6">
              <div>
                <Link href="/docs" className="flex items-center gap-2 text-xl font-bold mb-2">
                  <BookOpen className="h-6 w-6 text-cyan-400" />
                  Documentation
                </Link>
                <p className="text-sm text-muted-foreground">
                  Everything you need to know about Stacks AI
                </p>
              </div>

              <nav className="space-y-2">
                {docsNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64 ml-0">
          <div className="max-w-4xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
