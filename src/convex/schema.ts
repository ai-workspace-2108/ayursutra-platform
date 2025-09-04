import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v, Infer } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user", 
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Exercise types
export const EXERCISE_TYPES = {
  STRENGTH: "strength",
  CARDIO: "cardio",
  FLEXIBILITY: "flexibility",
  BALANCE: "balance",
} as const;

export const exerciseTypeValidator = v.union(
  v.literal(EXERCISE_TYPES.STRENGTH),
  v.literal(EXERCISE_TYPES.CARDIO),
  v.literal(EXERCISE_TYPES.FLEXIBILITY),
  v.literal(EXERCISE_TYPES.BALANCE),
);
export type ExerciseType = Infer<typeof exerciseTypeValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Exercises table - predefined exercises that users can add to workouts
    exercises: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      type: exerciseTypeValidator,
      muscleGroups: v.array(v.string()), // e.g., ["chest", "triceps"]
      instructions: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      isCustom: v.boolean(), // true if created by user, false if system default
      userId: v.optional(v.id("users")), // only set if custom exercise
    })
      .index("by_type", ["type"])
      .index("by_user", ["userId"])
      .index("by_custom", ["isCustom"]),

    // Workout templates - reusable workout plans
    workoutTemplates: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      userId: v.id("users"),
      isPublic: v.boolean(),
      estimatedDuration: v.optional(v.number()), // in minutes
      difficulty: v.optional(v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced")
      )),
    })
      .index("by_user", ["userId"])
      .index("by_public", ["isPublic"]),

    // Exercises within a workout template
    workoutTemplateExercises: defineTable({
      workoutTemplateId: v.id("workoutTemplates"),
      exerciseId: v.id("exercises"),
      order: v.number(),
      sets: v.number(),
      reps: v.optional(v.number()),
      duration: v.optional(v.number()), // in seconds for cardio/time-based
      weight: v.optional(v.number()), // in lbs/kg
      restTime: v.optional(v.number()), // in seconds
      notes: v.optional(v.string()),
    })
      .index("by_template", ["workoutTemplateId"])
      .index("by_template_and_order", ["workoutTemplateId", "order"]),

    // Workout sessions - actual completed workouts
    workoutSessions: defineTable({
      userId: v.id("users"),
      workoutTemplateId: v.optional(v.id("workoutTemplates")),
      name: v.string(),
      date: v.string(), // YYYY-MM-DD format
      startTime: v.optional(v.number()), // timestamp
      endTime: v.optional(v.number()), // timestamp
      duration: v.optional(v.number()), // in minutes
      notes: v.optional(v.string()),
      completed: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_date", ["userId", "date"])
      .index("by_date", ["date"]),

    // Individual exercise performances within a workout session
    workoutSessionExercises: defineTable({
      workoutSessionId: v.id("workoutSessions"),
      exerciseId: v.id("exercises"),
      order: v.number(),
      sets: v.array(v.object({
        reps: v.optional(v.number()),
        weight: v.optional(v.number()),
        duration: v.optional(v.number()), // in seconds
        completed: v.boolean(),
        restTime: v.optional(v.number()), // actual rest taken
      })),
      notes: v.optional(v.string()),
    })
      .index("by_session", ["workoutSessionId"])
      .index("by_session_and_order", ["workoutSessionId", "order"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;