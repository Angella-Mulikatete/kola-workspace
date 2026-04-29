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
  userProfile?: {
    displayName?: string;
    primarySkill?: string;
    location?: string;
    hourlyRate?: number;
  };
}

export function ProposalView({
  workspaceId,
  proposal,
  milestones,
  userProfile,
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

  // Format currency in UGX
  const formatUGX = (amount: number) => {
    return `UGX ${amount.toLocaleString('en-UG')}`;
  };

  // Auto-generate proposal content from milestones
  const generateProposalContent = () => {
    const totalHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
    const totalCost = milestones.reduce((sum, m) => sum + m.cost, 0);

    // Generate personalized introduction
    const introduction = userProfile ? `## About Me

Hi! I'm ${userProfile.displayName || 'a professional freelancer'}, a ${userProfile.primarySkill || 'skilled professional'} based in ${userProfile.location || 'Uganda'}. I specialize in delivering high-quality work that exceeds client expectations.

### Why I'm the Best Fit for This Project

- **Expertise**: With my background in ${userProfile.primarySkill || 'this field'}, I have the technical skills and experience needed to execute this project successfully.
- **Quality Focus**: I'm committed to delivering work that not only meets but exceeds your requirements.
- **Clear Communication**: I believe in transparent, regular updates throughout the project lifecycle.
- **Timely Delivery**: I respect deadlines and ensure projects are completed on schedule.
- **Value for Money**: My rate of ${formatUGX(userProfile.hourlyRate || 0)}/hour reflects the quality and expertise I bring to your project.

### What I Can Do for You

I will take full ownership of this project from start to finish, ensuring:
- Clean, professional deliverables
- Regular progress updates
- Responsive communication
- Attention to detail
- Post-delivery support

` : '';

    return `# Project Proposal

## Overview
This proposal outlines the project scope, timeline, and cost breakdown for the requested work.

${introduction}

## Project Milestones

${milestones
  .sort((a, b) => a.order - b.order)
  .map(
    (m, i) => `### ${i + 1}. ${m.title}
${m.description ? m.description + '\n' : ""}
- **Estimated Time:** ${m.estimatedHours} hours
- **Cost:** ${formatUGX(m.cost)}
`
  )
  .join("\n")}

## Summary

- **Total Estimated Time:** ${totalHours} hours
- **Total Project Cost:** ${formatUGX(totalCost)}
${userProfile ? `- **Hourly Rate:** ${formatUGX(userProfile.hourlyRate || 0)}/hour` : ''}

## Payment Terms

- 50% upfront payment to begin work
- 50% upon project completion and approval
- Payment via [Your preferred method]

## Timeline

Work will commence immediately upon approval and payment. Each milestone will be delivered according to the estimated timeline, with regular updates throughout the process.

## Next Steps

1. Review this proposal and milestones
2. Discuss any questions or modifications
3. Approve and make initial payment
4. Begin work immediately

I'm excited about the opportunity to work on this project and confident I can deliver exceptional results. Thank you for considering my proposal!

---

**${userProfile?.displayName || 'Your Name'}**  
${userProfile?.primarySkill || 'Professional Freelancer'}  
${userProfile?.location || 'Location'}`;
  };

  useEffect(() => {
    // Live update: regenerate proposal whenever milestones change
    const content = generateProposalContent();
    setGeneratedProposal(content);
    
    // If not editing, update the edited content too
    if (!isEditing) {
      setEditedContent(content);
    }
  }, [milestones, isEditing, userProfile]);

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
    
    const htmlContent = `
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
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
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
          className="w-full h-[600px] p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edit your proposal..."
        />
      ) : (
        <div
          ref={contentRef}
          className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 max-h-[600px] overflow-y-auto prose prose-zinc dark:prose-invert prose-sm max-w-none"
        >
          <ReactMarkdown>{generatedProposal}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
