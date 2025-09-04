import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all exercises (system + user's custom ones)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    // Get system exercises and user's custom exercises
    const systemExercises = await ctx.db
      .query("exercises")
      .withIndex("by_custom", (q) => q.eq("isCustom", false))
      .collect();

    const customExercises = await ctx.db
      .query("exercises")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return [...systemExercises, ...customExercises];
  },
});

// Get exercises by type
export const listByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_type", (q) => q.eq("type", args.type as any))
      .collect();

    // Filter to include system exercises and user's custom exercises
    return exercises.filter(ex => !ex.isCustom || ex.userId === user._id);
  },
});

// Create custom exercise
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    muscleGroups: v.array(v.string()),
    instructions: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    return await ctx.db.insert("exercises", {
      ...args,
      type: args.type as any,
      isCustom: true,
      userId: user._id,
    });
  },
});

// Update custom exercise
export const update = mutation({
  args: {
    id: v.id("exercises"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    muscleGroups: v.optional(v.array(v.string())),
    instructions: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const exercise = await ctx.db.get(args.id);
    if (!exercise) throw new Error("Exercise not found");
    if (!exercise.isCustom || exercise.userId !== user._id) {
      throw new Error("Can only update your own custom exercises");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      type: updates.type as any,
    });
  },
});

// Delete custom exercise
export const remove = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const exercise = await ctx.db.get(args.id);
    if (!exercise) throw new Error("Exercise not found");
    if (!exercise.isCustom || exercise.userId !== user._id) {
      throw new Error("Can only delete your own custom exercises");
    }

    await ctx.db.delete(args.id);
  },
});
