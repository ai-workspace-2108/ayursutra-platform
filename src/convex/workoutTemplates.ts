import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// List templates created by the current user
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("workoutTemplates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// List all public templates
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("workoutTemplates")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();
  },
});

// Create a new workout template
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    estimatedDuration: v.optional(v.number()),
    difficulty: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const id = await ctx.db.insert("workoutTemplates", {
      name: args.name,
      description: args.description,
      userId: user._id,
      isPublic: args.isPublic,
      estimatedDuration: args.estimatedDuration,
      difficulty: args.difficulty,
    });

    return id;
  },
});

// Delete a template (only by its owner)
export const remove = mutation({
  args: { id: v.id("workoutTemplates") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const tpl = await ctx.db.get(args.id);
    if (!tpl) throw new Error("Template not found");
    if (tpl.userId !== user._id) throw new Error("Not allowed");

    await ctx.db.delete(args.id);
  },
});
