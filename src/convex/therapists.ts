import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all therapists
export const getAllTherapists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("therapists").collect();
  },
});

// Get available therapists
export const getAvailableTherapists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("therapists")
      .withIndex("by_isAvailable", (q) => q.eq("isAvailable", true))
      .collect();
  },
});

// Get therapist by ID
export const getTherapistById = query({
  args: { therapistId: v.id("therapists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.therapistId);
  },
});

// Get therapist count and statistics
export const getTherapistStats = query({
  args: {},
  handler: async (ctx) => {
    const allTherapists = await ctx.db.query("therapists").collect();
    const availableTherapists = allTherapists.filter(t => t.isAvailable);
    
    return {
      total: allTherapists.length,
      available: availableTherapists.length,
      busy: allTherapists.length - availableTherapists.length,
      averageRating: allTherapists.reduce((sum, t) => sum + (t.rating || 0), 0) / allTherapists.length,
      totalSessions: allTherapists.reduce((sum, t) => sum + t.totalSessions, 0),
    };
  },
});

// Get therapist availability for a specific date
export const getTherapistAvailability = query({
  args: {
    therapistId: v.id("therapists"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("therapy_sessions")
      .withIndex("by_therapistId_and_sessionDate", (q) => 
        q.eq("therapistId", args.therapistId).eq("sessionDate", args.date)
      )
      .collect();

    // Define available time slots (9 AM to 6 PM)
    const timeSlots = [
      "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
      "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
    ];

    const bookedSlots = sessions
      .filter(s => s.status === "scheduled")
      .map(s => s.timeSlot);

    return timeSlots.map(slot => ({
      timeSlot: slot,
      isAvailable: !bookedSlots.includes(slot),
    }));
  },
});

// Create therapy session
export const createTherapySession = mutation({
  args: {
    patientId: v.id("patients"),
    therapistId: v.id("therapists"),
    doctorId: v.id("users"),
    sessionDate: v.string(),
    timeSlot: v.string(),
    sessionType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if time slot is available
    const existingSession = await ctx.db
      .query("therapy_sessions")
      .withIndex("by_therapistId_and_sessionDate", (q) => 
        q.eq("therapistId", args.therapistId).eq("sessionDate", args.sessionDate)
      )
      .filter((q) => q.eq(q.field("timeSlot"), args.timeSlot))
      .filter((q) => q.eq(q.field("status"), "scheduled"))
      .first();

    if (existingSession) {
      throw new Error("Time slot is already booked");
    }

    const sessionId = await ctx.db.insert("therapy_sessions", {
      ...args,
      status: "scheduled",
    });

    // Update therapist's total sessions count
    const therapist = await ctx.db.get(args.therapistId);
    if (therapist) {
      await ctx.db.patch(args.therapistId, {
        totalSessions: therapist.totalSessions + 1,
      });
    }

    return sessionId;
  },
});

// Get session history for a therapist
export const getTherapistSessionHistory = query({
  args: {
    therapistId: v.id("therapists"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("therapy_sessions")
      .withIndex("by_therapistId", (q) => q.eq("therapistId", args.therapistId))
      .order("desc")
      .take(args.limit || 50);

    // Get patient details for each session
    const sessionsWithPatients = await Promise.all(
      sessions.map(async (session) => {
        const patient = await ctx.db.get(session.patientId);
        return {
          ...session,
          patient,
        };
      })
    );

    return sessionsWithPatients;
  },
});

// Cancel therapy session
export const cancelTherapySession = mutation({
  args: {
    sessionId: v.id("therapy_sessions"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.patch(args.sessionId, {
      status: "cancelled",
      notes: args.reason ? `Cancelled: ${args.reason}` : "Cancelled",
    });

    return args.sessionId;
  },
});

// Update session status
export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id("therapy_sessions"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      status: args.status,
      notes: args.notes,
      rating: args.rating,
    });

    return args.sessionId;
  },
});

// Register the current authenticated user as a therapist if missing.
// If already exists, ensure they are marked available.
export const registerSelfIfMissing = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Not authenticated");
    }

    // Check if therapist already exists for this user
    const existing = await ctx.db
      .query("therapists")
      .withIndex("by_userId", (q) => q.eq("userId", authUserId))
      .unique();

    if (existing) {
      if (!existing.isAvailable) {
        await ctx.db.patch(existing._id, { isAvailable: true });
      }
      return existing._id;
    }

    // Pull minimal user details for defaults
    const user = await ctx.db.get(authUserId);
    const name = user?.name ?? "Therapist";
    const contact = user?.email ?? "N/A";

    const _id = await ctx.db.insert("therapists", {
      userId: authUserId,
      name,
      specialization: ["General"],
      experience: 0,
      bio: "—",
      contact,
      isAvailable: true,
      imageUrl: undefined,
      rating: undefined,
      totalSessions: 0,
      hourlyRate: undefined,
    });

    return _id;
  },
});

export const getSlotOccupancy = query({
  args: {
    date: v.string(),
    timeSlot: v.string(),
  },
  handler: async (ctx, args) => {
    const sameDaySessions = await ctx.db
      .query("therapy_sessions")
      .withIndex("by_sessionDate", (q) => q.eq("sessionDate", args.date))
      .collect();

    const busy = sameDaySessions.filter(
      (s) => s.status === "scheduled" && s.timeSlot === args.timeSlot
    );

    const busyTherapistIds = busy.map((s) => s.therapistId);
    const busyCount = busyTherapistIds.length;

    // Also return total therapist count for quick free calculation
    const totalTherapists = (await ctx.db.query("therapists").collect()).length;

    return {
      date: args.date,
      timeSlot: args.timeSlot,
      busyCount,
      busyTherapistIds,
      totalTherapists,
      freeCount: Math.max(totalTherapists - busyCount, 0),
    };
  },
});