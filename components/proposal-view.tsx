"use client";

import { useState, useEffect, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { FileText, Download, Edit2, Save, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const updateProposal = useMutation(api.workspaces.updateProposal);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-generate proposal content from milestones
  const generateProposalContent = () => {
    const totalHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
    const totalCost = milestones.reduce((sum, m) => sum + m.cost, 0);

    return `# Project Proposal

## Overview
This proposal outlines the project scope, timeline, and cost breakdown for the requested work.

## Project Milestones

${milestones
  .sort((a, b) => a.order - b.order)
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
  };

  useEffect(() => {
    // Live update: regenerate proposal whenever milestones change
    const content = generateProposalContent();
    setGeneratedProposal(content);
    
    // If not editing, update the edited content too
    if (!isEditing) {
      setEditedContent(content);
    }
  }, [milestones, isEditing]);

  const handleEdit = () => {
    setEditedContent(generatedProposal);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProposal({
        workspaceId,
        content: editedContent,
      });
      setGeneratedProposal(editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save proposal:", error);
      alert("Failed to save proposal. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedContent(generatedProposal);
    setIsEditing(false);
  };

  const handleExportPDF = () => {
    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export PDF");
      return;
    }

    const content = contentRef.current?.innerHTML || "";
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Project Proposal</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            h1 { color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; }
            h3 { color: #555; margin-top: 20px; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <FileText className="w-4 h-4" />
          <span>
            {mounted && proposal
              ? `Last updated ${new Date(proposal.lastUpdatedAt).toLocaleDateString()}`
              : "Auto-generated from milestones"}
          </span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} size="sm" variant="outline" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button onClick={handleExportPDF} size="sm" variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-[600px] p-6 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edit your proposal..."
        />
      ) : (
        <div
          ref={contentRef}
          className="p-6 rounded-xl bg-zinc-900 border border-white/10 max-h-[600px] overflow-y-auto prose prose-invert prose-sm max-w-none"
        >
          <ReactMarkdown>{generatedProposal}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
