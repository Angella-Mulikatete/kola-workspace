import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new workspace
export const createWorkspace = mutation({
  args: {
    userId: v.id("users"),
    jobUrl: v.string(),
    jobTitle: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert("workspaces", {
      userId: args.userId,
      jobUrl: args.jobUrl,
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
      status: "draft",
      createdAt: Date.now(),
    });

    return workspaceId;
  },
});

// Get user's workspaces
export const getUserWorkspaces = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get workspace by ID
export const getWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workspaceId);
  },
});

// Update workspace status
export const updateWorkspaceStatus = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("won"),
      v.literal("lost")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, {
      status: args.status,
    });
  },
});

// Create milestones for a workspace
export const createMilestone = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    estimatedHours: v.number(),
    cost: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const milestoneId = await ctx.db.insert("milestones", {
      workspaceId: args.workspaceId,
      title: args.title,
      description: args.description,
      status: "todo",
      estimatedHours: args.estimatedHours,
      cost: args.cost,
      order: args.order,
    });

    return milestoneId;
  },
});

// Get milestones for a workspace
export const getWorkspaceMilestones = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("milestones")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("asc")
      .collect();
  },
});

// Update milestone status
export const updateMilestoneStatus = mutation({
  args: {
    milestoneId: v.id("milestones"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.milestoneId, {
      status: args.status,
    });
  },
});

// Update milestone hours and cost
export const updateMilestone = mutation({
  args: {
    milestoneId: v.id("milestones"),
    estimatedHours: v.optional(v.number()),
    cost: v.optional(v.number()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { milestoneId, ...updates } = args;
    await ctx.db.patch(milestoneId, updates);
  },
});

// Create or update proposal
export const upsertProposal = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existingProposal = await ctx.db
      .query("proposals")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .first();

    if (existingProposal) {
      await ctx.db.patch(existingProposal._id, {
        content: args.content,
        lastUpdatedAt: Date.now(),
      });
      return existingProposal._id;
    } else {
      return await ctx.db.insert("proposals", {
        workspaceId: args.workspaceId,
        content: args.content,
        lastUpdatedAt: Date.now(),
      });
    }
  },
});

// Get proposal for workspace
export const getWorkspaceProposal = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("proposals")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .first();
  },
});
