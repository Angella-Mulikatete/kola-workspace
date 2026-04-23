import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create user by Firebase ID
export const getOrCreateUser = mutation({
  args: {
    firebaseId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseId", args.firebaseId))
      .first();

    if (existingUser) {
      return existingUser;
    }

    // Create new user with default values
    const userId = await ctx.db.insert("users", {
      firebaseId: args.firebaseId,
      hourlyRate: 0, // Will be set during onboarding
      primarySkill: "", // Will be set during onboarding
      location: "", // Will be set during onboarding
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Update user profile (for onboarding)
export const updateUserProfile = mutation({
  args: {
    firebaseId: v.string(),
    hourlyRate: v.number(),
    primarySkill: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseId", args.firebaseId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      hourlyRate: args.hourlyRate,
      primarySkill: args.primarySkill,
      location: args.location,
    });

    return await ctx.db.get(user._id);
  },
});

// Get current user profile
export const getCurrentUser = query({
  args: {
    firebaseId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseId", args.firebaseId))
      .first();
  },
});

// Check if user needs onboarding
export const needsOnboarding = query({
  args: {
    firebaseId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseId", args.firebaseId))
      .first();

    if (!user) return true;

    // User needs onboarding if any required field is empty/zero
    return !user.hourlyRate || !user.primarySkill || !user.location;
  },
});
