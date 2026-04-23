import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { gateway } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: gateway("openai/gpt-4o"),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        analyzeJob: tool({
          description: "Analyze a job posting URL and extract key details",
          inputSchema: z.object({
            jobUrl: z.string().describe("The URL of the job posting"),
          }),
          execute: async ({ jobUrl }) => {
            // In Day 3, we'll implement actual job scraping
            // For now, return mock data
            return {
              title: "Sample Project",
              description: "This is a sample job description",
              budget: "$1000-$5000",
              skills: ["React", "Node.js", "TypeScript"],
            };
          },
        }),
        createWorkspace: tool({
          description:
            "Create a complete workspace with milestones and proposal for a job",
          inputSchema: z.object({
            projectTitle: z.string().describe("The title of the project"),
            projectSummary: z.string().describe("A brief summary of the project"),
            milestones: z
              .array(
                z.object({
                  title: z.string().describe("Milestone title"),
                  description: z.string().describe("Milestone description"),
                  estimatedHours: z
                    .number()
                    .describe("Estimated hours for this milestone"),
                  order: z
                    .number()
                    .describe("Order of the milestone (starting from 0)"),
                })
              )
              .describe("Array of project milestones"),
            proposalContent: z
              .string()
              .describe("Professional proposal in markdown format"),
          }),
          execute: async (workspace) => {
            // This will be saved to Convex in Day 4
            return {
              success: true,
              workspaceId: "temp-" + Date.now(),
              workspace,
            };
          },
        }),
      },
      onStepFinish: ({ toolResults }) => {
        console.log("Tool results:", toolResults);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
