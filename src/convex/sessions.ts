import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all sessions assigned to the currently authenticated therapist (by therapistUserId)
export const listForTherapistSelf = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const therapistUserId = identity.subject;
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_therapistUserId", (q) => q.eq("therapistUserId", therapistUserId))
      .order("asc")
      .collect();
    return sessions;
  },
});

// Simple assign mutation to create a session for a therapist by their auth user id
export const assignToTherapist = mutation({
  args: {
    therapistUserId: v.string(),
    patientName: v.string(),
    scheduledAt: v.number(), // ms timestamp
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    await ctx.db.insert("sessions", {
      therapistUserId: args.therapistUserId,
      patientName: args.patientName,
      scheduledAt: args.scheduledAt,
      status: "assigned",
      notes: args.notes ?? "",
      createdByUserId: identity.subject,
    });
  },
});

// Mark session status (assigned -> completed/cancelled)
export const updateStatus = mutation({
  args: {
    sessionId: v.id("sessions"),
    status: v.union(v.literal("assigned"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, { sessionId, status }) => {
    const sess = await ctx.db.get(sessionId);
    if (!sess) throw new Error("Session not found");
    await ctx.db.patch(sessionId, { status });
  },
});
