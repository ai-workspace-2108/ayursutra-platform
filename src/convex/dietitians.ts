import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all dietitians
export const getAllDietitians = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dietitians").collect();
  },
});

// Get available dietitians
export const getAvailableDietitians = query({
  args: {},
  handler: async (ctx) => {
    const dietitians = await ctx.db
      .query("dietitians")
      .withIndex("by_isAvailable", (q) => q.eq("isAvailable", true))
      .collect();

    // Filter by capacity
    return dietitians.filter(d => d.currentPatientCount < d.maxPatientsPerDay);
  },
});

// Get dietitian by ID
export const getDietitianById = query({
  args: { dietitianId: v.id("dietitians") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.dietitianId);
  },
});

// Create dietitian assignment
export const createDietitianAssignment = mutation({
  args: {
    patientId: v.id("patients"),
    dietitianId: v.id("dietitians"),
    doctorId: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check dietitian capacity
    const dietitian = await ctx.db.get(args.dietitianId);
    if (!dietitian) throw new Error("Dietitian not found");
    
    if (dietitian.currentPatientCount >= dietitian.maxPatientsPerDay) {
      throw new Error("Dietitian has reached maximum patient capacity");
    }

    const assignmentId = await ctx.db.insert("dietitian_assignments", {
      ...args,
      assignedDate: new Date().toISOString().split('T')[0],
      status: "active",
    });

    // Update dietitian's current patient count
    await ctx.db.patch(args.dietitianId, {
      currentPatientCount: dietitian.currentPatientCount + 1,
    });

    // Update patient's assigned dietitian
    await ctx.db.patch(args.patientId, {
      assignedDietitianId: args.dietitianId,
    });

    return assignmentId;
  },
});

// Get dietitian assignments
export const getDietitianAssignments = query({
  args: {
    dietitianId: v.id("dietitians"),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("dietitian_assignments")
      .withIndex("by_dietitianId", (q) => q.eq("dietitianId", args.dietitianId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const assignments = await query.collect();

    // Get patient details for each assignment
    const assignmentsWithPatients = await Promise.all(
      assignments.map(async (assignment) => {
        const patient = await ctx.db.get(assignment.patientId);
        return {
          ...assignment,
          patient,
        };
      })
    );

    return assignmentsWithPatients;
  },
});

// Update assignment status
export const updateAssignmentStatus = mutation({
  args: {
    assignmentId: v.id("dietitian_assignments"),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    await ctx.db.patch(args.assignmentId, {
      status: args.status,
      notes: args.notes,
    });

    // If assignment is completed or cancelled, decrease dietitian's patient count
    if (args.status === "completed" || args.status === "cancelled") {
      const dietitian = await ctx.db.get(assignment.dietitianId);
      if (dietitian && dietitian.currentPatientCount > 0) {
        await ctx.db.patch(assignment.dietitianId, {
          currentPatientCount: dietitian.currentPatientCount - 1,
        });
      }
    }

    return args.assignmentId;
  },
});

// Add: Register current user as dietitian if missing, mark available
export const registerSelfIfMissing = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("dietitians")
      .withIndex("by_userId", (q) => q.eq("userId", authUserId))
      .unique();

    if (existing) {
      if (!existing.isAvailable) {
        await ctx.db.patch(existing._id, { isAvailable: true });
      }
      return existing._id;
    }

    const user = await ctx.db.get(authUserId);
    const name = user?.name ?? "Dietitian";
    const contact = user?.email ?? "N/A";

    const _id = await ctx.db.insert("dietitians", {
      userId: authUserId,
      name,
      specialization: ["General Nutrition"],
      experience: 0,
      bio: "—",
      contact,
      isAvailable: true,
      imageUrl: undefined,
      rating: undefined,
      maxPatientsPerDay: 10,
      currentPatientCount: 0,
    });

    return _id;
  },
});

export const getMyDietitian = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const me = await ctx.db
      .query("dietitians")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!me) return null;
    return {
      _id: me._id,
      name: me.name,
      currentPatientCount: me.currentPatientCount,
      maxPatientsPerDay: me.maxPatientsPerDay,
    };
  },
});

export const updateDietitianName = mutation({
  args: {
    dietitianId: v.id("dietitians"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.dietitianId);
    if (!doc) throw new Error("Dietitian not found");
    await ctx.db.patch(args.dietitianId, { name: args.name });
    return args.dietitianId;
  },
});

export const setDietPlan = mutation({
  args: {
    assignmentId: v.id("dietitian_assignments"),
    plan: v.string(),
  },
  handler: async (ctx, args) => {
    const a = await ctx.db.get(args.assignmentId);
    if (!a) throw new Error("Assignment not found");
    await ctx.db.patch(args.assignmentId, {
      dietPlan: args.plan,
      notes: a.notes,
      status: "active",
    });
    return args.assignmentId;
  },
});