import { gateway } from "ai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { jobUrl, jobDescription, userProfile } = await req.json();

    if (!jobUrl) {
      return new Response("Job URL is required", { status: 400 });
    }

    const systemPrompt = `You are an expert freelance project manager and proposal writer. Your task is to analyze a job posting and generate a comprehensive project workspace.

User Profile:
- Primary Skill: ${userProfile.primarySkill}
- Hourly Rate: $${userProfile.hourlyRate}/hr
- Location: ${userProfile.location}

Break down the project into clear milestones with time estimates and create a professional proposal that highlights the user's expertise in ${userProfile.primarySkill}.`;

    const userPrompt = `Job URL: ${jobUrl}

${jobDescription ? `Job Description:\n${jobDescription}` : "Please analyze this job posting and create a complete project workspace with milestones and a proposal."}`;

    const result = streamText({
      model: gateway("openai/gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      tools: {
        createWorkspace: tool({
          description: "Create a workspace with project details, milestones, and proposal",
          inputSchema: z.object({
            projectTitle: z.string().describe("The title of the project"),
            projectSummary: z.string().describe("A brief summary of the project"),
            milestones: z.array(
              z.object({
                title: z.string().describe("Milestone title"),
                description: z.string().describe("Milestone description"),
                estimatedHours: z.number().describe("Estimated hours for this milestone"),
                order: z.number().describe("Order of the milestone (starting from 0)"),
              })
            ).describe("Array of project milestones"),
            proposalContent: z.string().describe("Professional proposal in markdown format"),
          }),
          execute: async (workspace) => {
            // This will be executed on the server
            // For now, just return the workspace data
            // In Day 4, we'll save this to Convex
            return {
              success: true,
              workspace,
            };
          },
        }),
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating workspace:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
