"use client";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { PencilEditIcon, SparklesIcon } from "./icons";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";

// Stacks Components
import StacksTransactionComponent from "@/components/stacks-transactions/StacksTransactionComponent";
import ToolCallLoader from "@/components/tool-call-loader";
import { SuggestionAwareMarkdown } from "@/components/SuggestionAwareMarkdown";
import { InfoIcon } from "lucide-react";

// Stacks DEX Components
import SwapInfo from "@/components/stacks-dex/SwapInfo";
import PoolList from "@/components/stacks-dex/PoolList";
import TokenPrices from "@/components/stacks-dex/TokenPrices";

// Stacks Lending Components
import LendingInfo from "@/components/stacks-lending/LendingInfo";

// Stacks Stacking Components
import StackingInfo from "@/components/stacks-stacking/StackingInfo";

// Stacks Token Components
import TokenBalances from "@/components/stacks-tokens/TokenBalances";

// Stacks Core Components
import BlockchainInfo from "@/components/stacks-core/BlockchainInfo";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  sendMessage,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];

  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

  useDataStream();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} color="#fc8d36" />
              </div>
            </div>
          )}
          {message.role === "system" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <InfoIcon size={20} color="white" />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-4 w-full  overflow-clip break-words whitespace-normal",
              {
                "min-h-96":
                  message.role === "assistant" && requiresScrollPadding,
              }
            )}
          >
            {attachmentsFromMessage.length > 0 && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {attachmentsFromMessage.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={{
                      name: attachment.filename ?? "file",
                      contentType: attachment.mediaType,
                      url: attachment.url,
                    }}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              // Debug logging for tool calls
              if (type.startsWith("tool-")) {
                console.log("🔧 Tool call detected:", {
                  type,
                  state: "state" in part ? part.state : "unknown",
                  hasOutput: "output" in part,
                  part
                });
              }

              if (type === "reasoning" && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.text}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start ">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <SuggestionAwareMarkdown
                          text={sanitizeText(part.text)}
                          sendMessage={sendMessage}
                        />
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              if (type === "tool-getUserWalletInfo") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting your wallet info..." />
                    </div>
                  );
                }
              }

              // ========================= STACKS DEX TOOLS =========================

              // ALEX Swap Tools
              if (type.startsWith("tool-alex_execute_swap")) {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Executing ALEX swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SwapInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // Velar Swap Tools
              if (type === "tool-velar_execute_swap") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Executing Velar swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SwapInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // Velar Pool/Price Tools
              if (type === "tool-velar_get_all_pools" || type === "tool-velar_get_pairs") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar pools..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <PoolList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velar_get_current_prices") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar prices..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TokenPrices
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // BitFlow Tools
              if (type === "tool-bitflow_execute_swap" || type === "tool-bitflow_prepare_swap_execution") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Executing BitFlow swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SwapInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-bitflow_get_possible_swaps" || type === "tool-bitflow_get_all_possible_token_y") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting BitFlow pools..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <PoolList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // Charisma Tools
              if (type === "tool-charisma_execute_swap") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Executing Charisma swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SwapInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-charisma_get_pools") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma pools..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <PoolList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS LENDING TOOLS =========================

              // Granite Lending Tools
              if (type === "tool-granite_borrow" || type === "tool-granite_repay" ||
                  type === "tool-granite_deposit" || type === "tool-granite_withdraw" ||
                  type === "tool-granite_stake") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Processing Granite operation..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <LendingInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // Arkadiko Lending Tools
              if (type === "tool-arkadiko_open_vault" || type === "tool-arkadiko_deposit" ||
                  type === "tool-arkadiko_mint" || type === "tool-arkadiko_burn" ||
                  type === "tool-arkadiko_withdraw") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Processing Arkadiko operation..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <LendingInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS STACKING (PoX) TOOLS =========================

              if (type.startsWith("tool-stacks_stack") || type === "tool-stacks_delegate_stx" ||
                  type === "tool-stacks_get_pox_info" || type === "tool-stacks_get_stacker_info") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Processing stacking operation..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <StackingInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS TOKEN & BALANCE TOOLS =========================

              if (type === "tool-get_address_ft_balances" || type === "tool-get_ft_balance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting token balances..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TokenBalances
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS BLOCKCHAIN INFO TOOLS =========================

              if (type.startsWith("tool-get_block") || type === "tool-get_transaction" ||
                  type === "tool-get_network_info") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting blockchain information..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BlockchainInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return false;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
