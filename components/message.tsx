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

// Stacks DEX Components (Generic - being phased out)
import SwapInfo from "@/components/stacks-dex/SwapInfo";
import PoolList from "@/components/stacks-dex/PoolList";
import TokenPrices from "@/components/stacks-dex/TokenPrices";

// ALEX Protocol Components
import AlexPoolList from "@/components/stacks-dex/alex/AlexPoolList";
import AlexTokenPrices from "@/components/stacks-dex/alex/AlexTokenPrices";
import AlexTradingPairs from "@/components/stacks-dex/alex/AlexTradingPairs";
import AlexTokenMappings from "@/components/stacks-dex/alex/AlexTokenMappings";
import AlexSwapHistory from "@/components/stacks-dex/alex/AlexSwapHistory";
import AlexPoolStats from "@/components/stacks-dex/alex/AlexPoolStats";
import AlexTotalTVL from "@/components/stacks-dex/alex/AlexTotalTVL";

// Velar Protocol Components
import VelarPoolList from "@/components/stacks-dex/velar/VelarPoolList";
import VelarTickers from "@/components/stacks-dex/velar/VelarTickers";
import VelarTokenPrices from "@/components/stacks-dex/velar/VelarTokenPrices";
import VelarTokenDetails from "@/components/stacks-dex/velar/VelarTokenDetails";
import VelarPriceByContract from "@/components/stacks-dex/velar/VelarPriceByContract";
import VelarHistoricalPrices from "@/components/stacks-dex/velar/VelarHistoricalPrices";
import VelarCirculatingSupply from "@/components/stacks-dex/velar/VelarCirculatingSupply";
import VelarSwapTransaction from "@/components/stacks-dex/velar/VelarSwapTransaction";

// Arkadiko Protocol Components
import ArkadikoSwapPairs from "@/components/stacks-dex/arkadiko/ArkadikoSwapPairs";
import ArkadikoSwapPairDetails from "@/components/stacks-dex/arkadiko/ArkadikoSwapPairDetails";
import ArkadikoVaultInfo from "@/components/stacks-dex/arkadiko/ArkadikoVaultInfo";
import ArkadikoStakeInfo from "@/components/stacks-dex/arkadiko/ArkadikoStakeInfo";
import ArkadikoProposal from "@/components/stacks-dex/arkadiko/ArkadikoProposal";
import ArkadikoTokenPrice from "@/components/stacks-dex/arkadiko/ArkadikoTokenPrice";
import ArkadikoSwapTransaction from "@/components/stacks-dex/arkadiko/ArkadikoSwapTransaction";
import ArkadikoCreateVault from "@/components/stacks-dex/arkadiko/ArkadikoCreateVault";

// BitFlow Protocol Components
import BitflowTokenList from "@/components/stacks-dex/bitflow/BitflowTokenList";
import BitflowKeeperTokens from "@/components/stacks-dex/bitflow/BitflowKeeperTokens";
import BitflowPossibleSwaps from "@/components/stacks-dex/bitflow/BitflowPossibleSwaps";
import BitflowQuote from "@/components/stacks-dex/bitflow/BitflowQuote";
import BitflowSwapTransaction from "@/components/stacks-dex/bitflow/BitflowSwapTransaction";

// Charisma Protocol Components
import CharismaQuote from "@/components/stacks-dex/charisma/CharismaQuote";
import CharismaSwapTransaction from "@/components/stacks-dex/charisma/CharismaSwapTransaction";
import CharismaOrders from "@/components/stacks-dex/charisma/CharismaOrders";
import CharismaOrderDetails from "@/components/stacks-dex/charisma/CharismaOrderDetails";
import CharismaApiKeys from "@/components/stacks-dex/charisma/CharismaApiKeys";

// Granite Lending Components
import GraniteBorrow from "@/components/stacks-dex/granite/GraniteBorrow";
import GraniteRepay from "@/components/stacks-dex/granite/GraniteRepay";
import GraniteAddCollateral from "@/components/stacks-dex/granite/GraniteAddCollateral";
import GraniteDeposit from "@/components/stacks-dex/granite/GraniteDeposit";
import GraniteWithdraw from "@/components/stacks-dex/granite/GraniteWithdraw";
import GraniteStake from "@/components/stacks-dex/granite/GraniteStake";

// Stacks Lending Components
import LendingInfo from "@/components/stacks-lending/LendingInfo";

// Stacks Stacking Components
import StackingInfo from "@/components/stacks-stacking/StackingInfo";
import StackingStatus from "@/components/stacks-stacking/StackingStatus";

// Stacks Token Components
import TokenBalances from "@/components/stacks-tokens/TokenBalances";
import TokenInfo from "@/components/stacks-tokens/TokenInfo";
import TokenTransfer from "@/components/stacks-tokens/TokenTransfer";

// Stacks Core Components
import BlockchainInfo from "@/components/stacks-core/BlockchainInfo";

// Stacks Account Components
import AccountInfo from "@/components/stacks-account/AccountInfo";
import TransactionHistory from "@/components/stacks-account/TransactionHistory";
import AccountNonces from "@/components/stacks-account/AccountNonces";
import SearchResults from "@/components/stacks-account/SearchResults";

// Stacks Transaction Components
import SendSTXTransaction from "@/components/stacks-transaction/SendSTXTransaction";
import TransactionDetails from "@/components/stacks-transaction/TransactionDetails";

// Stacks Block Components
import CurrentBlockHeight from "@/components/stacks-block/CurrentBlockHeight";
import BlockDetails from "@/components/stacks-block/BlockDetails";

// Stacks NFT Components
import NFTGallery from "@/components/stacks-nfts/NFTGallery";
import NFTHistory from "@/components/stacks-nfts/NFTHistory";
import NFTTransfer from "@/components/stacks-nfts/NFTTransfer";

// TradePort NFT Marketplace Components
import CollectionSearch from "@/components/stacks-tradeport/CollectionSearch";
import CollectionInfo from "@/components/stacks-tradeport/CollectionInfo";
import TrendingCollections from "@/components/stacks-tradeport/TrendingCollections";
import WalletNFTs from "@/components/stacks-tradeport/WalletNFTs";

// Stacks Contract Components
import ContractInfo from "@/components/stacks-contracts/ContractInfo";
import ContractInterface from "@/components/stacks-contracts/ContractInterface";
import ContractCall from "@/components/stacks-contracts/ContractCall";
import ContractDeployment from "@/components/stacks-contracts/ContractDeployment";
import MessageSignature from "@/components/stacks-contracts/MessageSignature";
import StructuredMessageSignature from "@/components/stacks-contracts/StructuredMessageSignature";

// Clarinet Development Components
import ClarinetsGuide from "@/components/stacks-contracts/ClarinetsGuide";
import ClarityContract from "@/components/stacks-contracts/ClarityContract";
import ContractTests from "@/components/stacks-contracts/ContractTests";
import ProjectConfig from "@/components/stacks-contracts/ProjectConfig";

// Stacks Event Components
import EventList from "@/components/stacks-events/EventList";

// Stacks Mempool Components
import FeeEstimate from "@/components/stacks-mempool/FeeEstimate";

// Stacks PoX Components
import CycleInfo from "@/components/stacks-pox/CycleInfo";

// Stacks Stackpool Components
import PoolDelegations from "@/components/stacks-stackpool/PoolDelegations";
import BurnchainRewardSlots from "@/components/stacks-stackpool/BurnchainRewardSlots";
import BurnchainRewards from "@/components/stacks-stackpool/BurnchainRewards";

// Import PoolStats for detailed pool statistics
import PoolStats from "@/components/stacks-dex/PoolStats";

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

              // ========================= CHARISMA DEX DETAILED TOOLS =========================

              if (type === "tool-charismaGetQuote") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma quote..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CharismaQuote
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-charismaExecuteSwap") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Charisma swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CharismaSwapTransaction
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-charismaListOrders") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma orders..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CharismaOrders
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-charismaGetOrder") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma order details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CharismaOrderDetails
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-charismaListApiKeys") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma API keys..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CharismaApiKeys
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= GRANITE LENDING DETAILED TOOLS =========================

              if (type === "tool-granitePrepareBorrow") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Granite borrow..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteBorrow
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-granitePrepareRepay") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Granite repay..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteRepay
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-granitePrepareAddCollateral") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing collateral deposit..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteAddCollateral
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-granitePrepareDeposit") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Granite deposit..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteDeposit
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-granitePrepareWithdraw") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Granite withdraw..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteWithdraw
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-granitePrepareStake") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing LP token stake..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <GraniteStake
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS LENDING TOOLS =========================

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

              // ========================= STACKS ACCOUNT TOOLS =========================

              if (type === "tool-getAccountInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting account information..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AccountInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getTransactionHistory") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting transaction history..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    // Extract address from output if available
                    const address = (output as any)?.data?.address;
                    return (
                      <TransactionHistory
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                        address={address}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getAccountNonces") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting account nonces..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AccountNonces
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-searchById") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Searching blockchain..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SearchResults
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS TRANSACTION TOOLS =========================

              if (type === "tool-makeSendSTX") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Building STX transfer..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <SendSTXTransaction
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getTransactionInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting transaction details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TransactionDetails
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS NFT TOOLS =========================

              if (type === "tool-getNFTHoldings") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting NFT holdings..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <NFTGallery
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getNFTHistory") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting NFT transfer history..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <NFTHistory
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-transferNFT") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing NFT transfer..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <NFTTransfer
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= TRADEPORT NFT MARKETPLACE TOOLS =========================

              if (type === "tool-tradeportSearchCollections") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Searching NFT collections..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CollectionSearch
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-tradeportGetCollectionInfo" || type === "tool-tradeportGetCollectionStats") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting collection details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CollectionInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-tradeportGetTrendingCollections") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting trending collections..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TrendingCollections
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-tradeportGetWalletNFTs") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting wallet NFTs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <WalletNFTs
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS TOKEN INFO TOOLS =========================

              if (type === "tool-getTokenInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting token information..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TokenInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-transferFungibleToken") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token transfer..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <TokenTransfer
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKS BLOCK TOOLS =========================

              if (type === "tool-getCurrentBlockHeight") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting current block height..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CurrentBlockHeight
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getBlockByHeight" || type === "tool-getBlockByHash") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting block details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BlockDetails
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= ALEX DEX POOL/PRICE TOOLS =========================

              if (type === "tool-alexGetAllPools") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX pools..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexPoolList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetTradingPairs") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX trading pairs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexTradingPairs
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetAllTokenPrices" || type === "tool-alexGetTokenPrice" ||
                  type === "tool-alexGetAllTickers") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX token prices..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexTokenPrices
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetPoolStats" || type === "tool-alexGetAmmPoolStats") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX pool statistics..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexPoolStats
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetTokenMappings") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX token mappings..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexTokenMappings
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetTotalTVL") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX total TVL..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexTotalTVL
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexGetAllSwaps") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting ALEX swap pairs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <AlexSwapHistory
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-alexSwapTokens") {
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

              // ========================= VELAR DEX DETAILED TOOLS =========================

              if (type === "tool-velarGetAllPools" || type === "tool-velarGetPoolByTokenPair") {
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
                      <VelarPoolList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetAllTickers") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar tickers..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarTickers
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetCurrentPrices") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar current prices..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarTokenPrices
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetTokenDetails") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar token details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarTokenDetails
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetPriceByContract") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar token price..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarPriceByContract
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetHistoricalPrices") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar historical prices..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarHistoricalPrices
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarGetCirculatingSupply") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Velar circulating supply..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarCirculatingSupply
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-velarSwapTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Velar swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <VelarSwapTransaction
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= BITFLOW DEX DETAILED TOOLS =========================

              if (type === "tool-bitflowGetAvailableTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting BitFlow available tokens..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BitflowTokenList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-bitflowGetKeeperTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting BitFlow Keeper tokens..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BitflowKeeperTokens
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-bitflowGetPossibleSwaps") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting BitFlow possible swaps..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BitflowPossibleSwaps
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-bitflowGetQuoteForRoute") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting BitFlow quote..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BitflowQuote
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-bitflowSwapTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing BitFlow swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BitflowSwapTransaction
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= ARKADIKO DEFI TOOLS =========================

              if (type === "tool-arkadikoGetAllSwapPairs") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko swap pairs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoSwapPairs
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoGetSwapPair") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko swap pair details..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoSwapPairDetails
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoGetVaultInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko vault info..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoVaultInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoGetStakeInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko stake info..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoStakeInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoGetProposal") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko proposal..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoProposal
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoGetTokenPrice") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Arkadiko token price..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoTokenPrice
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoSwapTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Arkadiko swap..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoSwapTransaction
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-arkadikoCreateVault") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Arkadiko vault creation..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ArkadikoCreateVault
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= CHARISMA DEX DETAILED TOOLS =========================

              if (type === "tool-charismaGetQuote") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma quote..." />
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

              if (type === "tool-charismaListOrders" || type === "tool-charismaGetOrder" ||
                  type === "tool-charismaListApiKeys") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting Charisma data..." />
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

              // ========================= GRANITE LENDING DETAILED TOOLS =========================

              if (type === "tool-granitePrepareBorrow" || type === "tool-granitePrepareRepay" ||
                  type === "tool-granitePrepareAddCollateral" || type === "tool-granitePrepareDeposit" ||
                  type === "tool-granitePrepareWithdraw" || type === "tool-granitePrepareStake") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing Granite lending operation..." />
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

              // ========================= CONTRACT TOOLS =========================

              if (type === "tool-getContractInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting contract interface..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ContractInterface
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-makeContractCall") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing contract call..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ContractCall
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-deployContract") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing contract deployment..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ContractDeployment
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-signMessage") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing message signature..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <MessageSignature
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-signStructuredMessage") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing structured message signature..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <StructuredMessageSignature
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= CLARINET DEVELOPMENT TOOLS =========================

              if (type === "tool-clarinetsGenerateProject") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Generating Clarinet project guide..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ClarinetsGuide
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-clarinetsGenerateContract") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Generating Clarity contract..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ClarityContract
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-clarinetsGenerateTests") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Generating contract tests..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ContractTests
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-clarinetsConfigureProject") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Generating project configuration..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <ProjectConfig
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= EVENT TOOLS =========================

              if (type === "tool-getTransactionEvents" || type === "tool-getContractLogEvents" ||
                  type === "tool-getStxTransferEvents") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting events..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <EventList
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= MEMPOOL/FEE TOOLS =========================

              if (type === "tool-getFeeEstimates") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting fee estimates..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <FeeEstimate
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= POX/CYCLE TOOLS =========================

              if (type === "tool-getPoxCycles" || type === "tool-getPoxCycle" ||
                  type === "tool-getCycleSigners") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting PoX cycle information..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <CycleInfo
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKPOOL TOOLS =========================

              if (type === "tool-getPoolDelegations") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting pool delegations..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <PoolDelegations
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getBurnchainRewardSlots") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting burnchain reward slots..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BurnchainRewardSlots
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              if (type === "tool-getBurnchainRewards") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting burnchain rewards..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <BurnchainRewards
                        key={toolCallId}
                        data={output as any}
                        isLoading={false}
                      />
                    );
                  }
                }
              }

              // ========================= STACKING INFO TOOL =========================

              if (type === "tool-getStackingInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Getting stacking status..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    return (
                      <StackingStatus
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
