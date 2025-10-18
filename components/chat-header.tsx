"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon, VercelIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { StacksConnectButton } from "@/components/StacksConnectButton";

function PureChatHeader() {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center justify-between px-2 sm:px-4 md:px-2 gap-2 z-10 w-full max-w-full min-w-0">
      <div className="flex items-center gap-2 min-w-0 flex-shrink">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0 flex-shrink-0"
                onClick={() => {
                  router.push("/");
                  router.refresh();
                }}
              >
                <PlusIcon />
                <span className="hidden md:block">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center flex-shrink-0">
        <StacksConnectButton />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
