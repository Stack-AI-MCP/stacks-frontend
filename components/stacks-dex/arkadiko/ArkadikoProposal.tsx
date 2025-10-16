"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vote, CheckCircle, XCircle, Clock } from "lucide-react";

// Arkadiko Proposal type based on Hiro API smart contract response
type ArkadikoProposalData = {
  proposal_id: number;
  proposer?: string;
  title?: string;
  description?: string;
  votes_for: number;
  votes_against: number;
  start_block: number;
  end_block: number;
  status: "pending" | "active" | "passed" | "rejected" | "executed";
  execution_delay?: number;
  is_open: boolean;
};

type ArkadikoProposalResponse = {
  success: boolean;
  data: ArkadikoProposalData;
  error?: string;
  message?: string;
};

export interface ArkadikoProposalProps {
  data: ArkadikoProposalResponse;
  isLoading: boolean;
}

export default function ArkadikoProposal({ data, isLoading }: ArkadikoProposalProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Proposal</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Arkadiko governance proposal"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const proposal = data.data;
  const totalVotes = proposal.votes_for + proposal.votes_against;
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "executed":
        return { color: "text-green-400", bgColor: "bg-green-500/20" };
      case "rejected":
        return { color: "text-red-400", bgColor: "bg-red-500/20" };
      case "active":
        return { color: "text-blue-400", bgColor: "bg-blue-500/20" };
      default:
        return { color: "text-sky-400", bgColor: "bg-sky-500/20" };
    }
  };

  const statusStyle = getStatusColor(proposal.status);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-lg">Arkadiko Proposal #{proposal.proposal_id}</CardTitle>
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              variant="outline"
              className={`${statusStyle.bgColor} ${statusStyle.color}`}
            >
              {proposal.status}
            </Badge>
            {proposal.is_open && (
              <Badge className="bg-green-500/20 text-green-400">
                Open
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          Governance proposal voting and status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title & Description */}
        {proposal.title && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
            {proposal.description && (
              <p className="text-sm text-zinc-400">{proposal.description}</p>
            )}
          </div>
        )}

        {/* Voting Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Voting Results</span>
            <span className="text-white font-semibold">{totalVotes.toLocaleString()} total votes</span>
          </div>

          {/* For Votes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">For</span>
              </div>
              <span className="text-white font-semibold">
                {proposal.votes_for.toLocaleString()} ({forPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${forPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Against Votes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-zinc-400">Against</span>
              </div>
              <span className="text-white font-semibold">
                {proposal.votes_against.toLocaleString()} ({againstPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all"
                style={{ width: `${againstPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t border-zinc-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-zinc-400">Start Block:</span>
            </div>
            <code className="text-xs text-white font-mono">{proposal.start_block.toLocaleString()}</code>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-zinc-400">End Block:</span>
            </div>
            <code className="text-xs text-white font-mono">{proposal.end_block.toLocaleString()}</code>
          </div>
          {proposal.execution_delay !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Execution Delay:</span>
              <span className="text-white">{proposal.execution_delay} blocks</span>
            </div>
          )}
          {proposal.proposer && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Proposer:</span>
              <code className="text-xs text-zinc-300 font-mono">
                {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
              </code>
            </div>
          )}
        </div>

        {/* Success Message */}
        {data.message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
