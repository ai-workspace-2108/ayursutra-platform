import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// List all workout sessions for the current user (newest first)
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Basic stats for the current user's sessions
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { total: 0, completed: 0 };
    }

    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const total = sessions.length;
    const completed = sessions.filter((s) => s.completed).length;

    return { total, completed };
  },
});

// Create a new workout session (defaults to not completed)
export const create = mutation({
  args: {
    name: v.string(),
    date: v.string(), // YYYY-MM-DD
    workoutTemplateId: v.optional(v.id("workoutTemplates")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const id = await ctx.db.insert("workoutSessions", {
      userId: user._id,
      workoutTemplateId: args.workoutTemplateId,
      name: args.name,
      date: args.date,
      startTime: Date.now(),
      endTime: undefined,
      duration: undefined,
      notes: args.notes,
      completed: false,
    });

    return id;
  },
});

// Mark a session as completed and set timing info
export const complete = mutation({
  args: {
    id: v.id("workoutSessions"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    const session = await ctx.db.get(args.id);
    if (!session) throw new Error("Session not found");
    if (session.userId !== user._id) throw new Error("Not allowed");

    const end = Date.now();
    let duration: number | undefined = undefined;

    if (session.startTime) {
      duration = Math.max(0, Math.round((end - session.startTime) / 1000 / 60)); // minutes
    }

    await ctx.db.patch(args.id, {
      completed: true,
      endTime: end,
      duration,
      notes: args.notes ?? session.notes,
    });
  },
});
