import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles (Firebase Auth identity + app-specific data)
  users: defineTable({
    firebaseId: v.string(),
    hourlyRate: v.number(),
    primarySkill: v.string(),
    location: v.string(),
    createdAt: v.number(),
  }).index("by_firebase_id", ["firebaseId"]),

  // Cached recommended jobs from external APIs
  recommended_jobs: defineTable({
    userId: v.id("users"),
    source: v.string(), // 'kolaborate' | 'external'
    jobUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    matchScore: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Project workspaces (one per job application)
  workspaces: defineTable({
    userId: v.id("users"),
    jobUrl: v.string(),
    jobTitle: v.string(),
    jobDescription: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("won"),
      v.literal("lost")
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Kanban milestones
  milestones: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
    estimatedHours: v.number(),
    cost: v.number(),
    order: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Live proposals
  proposals: defineTable({
    workspaceId: v.id("workspaces"),
    content: v.string(), // Markdown content
    lastUpdatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),
});
