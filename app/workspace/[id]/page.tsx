"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban-board";
import { ProposalView } from "@/components/proposal-view";
import { EarningsChart } from "@/components/earnings-chart";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const workspaceId = params.id as Id<"workspaces">;

  const workspace = useQuery(api.workspaces.getWorkspace, { workspaceId });
  const milestones = useQuery(api.workspaces.getWorkspaceMilestones, { workspaceId });
  const proposal = useQuery(api.workspaces.getWorkspaceProposal, { workspaceId });
  const currentUser = useQuery(
    api.users.getCurrentUser,
    user ? { firebaseId: user.uid } : "skip"
  );

  if (workspace === undefined || milestones === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (workspace === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const totalHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
  const totalCost = milestones.reduce((sum, m) => sum + m.cost, 0);

  // Format currency in UGX
  const formatUGX = (amount: number) => {
    return `UGX ${amount.toLocaleString('en-UG')}`;
  };

  // Prepare user profile for proposal
  const userProfile = currentUser && user ? {
    displayName: user.displayName || "Professional Freelancer",
    primarySkill: currentUser.primarySkill,
    location: currentUser.location,
    hourlyRate: currentUser.hourlyRate,
  } : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-white/10 backdrop-blur-sm bg-white/50 dark:bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{workspace.jobTitle}</h1>
                <p className="text-sm text-zinc-400">
                  {totalHours}h • {formatUGX(totalCost)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workspace.status === "draft"
                    ? "bg-zinc-800 text-zinc-300"
                    : workspace.status === "sent"
                    ? "bg-blue-500/20 text-blue-400"
                    : workspace.status === "won"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {workspace.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Kanban Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Milestones</h2>
              <p className="text-zinc-400">
                Drag and drop to reorder, click to edit
              </p>
            </div>
            <KanbanBoard workspaceId={workspaceId} milestones={milestones} />
          </motion.div>

          {/* Right Column: Proposal & Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Earnings Chart */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Earnings Forecast</h2>
              <p className="text-zinc-400 mb-4">
                Projected revenue over time
              </p>
              <EarningsChart milestones={milestones} />
            </div>

            {/* Proposal */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Proposal</h2>
              <p className="text-zinc-400 mb-4">
                Live-updating project proposal
              </p>
              <ProposalView
                workspaceId={workspaceId}
                proposal={proposal}
                milestones={milestones}
                userProfile={userProfile}
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
