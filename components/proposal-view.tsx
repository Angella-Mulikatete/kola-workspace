"use client";

import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { FileText, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Milestone {
  _id: Id<"milestones">;
  title: string;
  description?: string;
  estimatedHours: number;
  cost: number;
  order: number;
}

interface Proposal {
  _id: Id<"proposals">;
  workspaceId: Id<"workspaces">;
  content: string;
  lastUpdatedAt: number;
}

interface ProposalViewProps {
  workspaceId: Id<"workspaces">;
  proposal: Proposal | null | undefined;
  milestones: Milestone[];
}

export function ProposalView({
  workspaceId,
  proposal,
  milestones,
}: ProposalViewProps) {
  const [generatedProposal, setGeneratedProposal] = useState("");

  useEffect(() => {
    // Auto-generate proposal from milestones if no proposal exists
    if (!proposal && milestones.length > 0) {
      const totalHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
      const totalCost = milestones.reduce((sum, m) => sum + m.cost, 0);

      const content = `# Project Proposal

## Overview
This proposal outlines the project scope, timeline, and cost breakdown for the requested work.

## Project Milestones

${milestones
  .map(
    (m, i) => `### ${i + 1}. ${m.title}
${m.description ? m.description : ""}
- **Estimated Time:** ${m.estimatedHours} hours
- **Cost:** $${m.cost.toLocaleString()}
`
  )
  .join("\n")}

## Summary

- **Total Estimated Time:** ${totalHours} hours
- **Total Project Cost:** $${totalCost.toLocaleString()}

## Next Steps

Upon approval, we can begin work immediately. I'm committed to delivering high-quality results within the estimated timeline.

Thank you for considering this proposal. I look forward to working with you!`;

      setGeneratedProposal(content);
    } else if (proposal) {
      setGeneratedProposal(proposal.content);
    }
  }, [proposal, milestones]);

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export coming soon!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <FileText className="w-4 h-4" />
          <span>
            {proposal
              ? `Last updated ${new Date(proposal.lastUpdatedAt).toLocaleDateString()}`
              : "Auto-generated from milestones"}
          </span>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <div className="p-6 rounded-xl bg-zinc-900 border border-white/10 max-h-[600px] overflow-y-auto prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{generatedProposal}</ReactMarkdown>
      </div>
    </div>
  );
}
