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

// Add prakriti validator for Ayurvedic assessments used across patients
export const prakritiValidator = v.union(
  v.object({
    vata: v.number(),
    pitta: v.number(),
    kapha: v.number(),
    dominantDosha: v.string(),
    constitutionType: v.string(),
  }),
  // Allow simple string storage fallback (seed/demo)
  v.string(),
);

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

    // --- Added domain tables used by the app ---

    // Therapists directory
    therapists: defineTable({
      userId: v.id("users"),
      name: v.string(),
      specialization: v.array(v.string()),
      experience: v.number(),
      bio: v.string(),
      contact: v.string(),
      isAvailable: v.boolean(),
      imageUrl: v.optional(v.string()),
      rating: v.optional(v.number()),
      totalSessions: v.number(),
      hourlyRate: v.number(),
    }).index("by_isAvailable", ["isAvailable"]),

    // Dietitians directory
    dietitians: defineTable({
      userId: v.id("users"),
      name: v.string(),
      specialization: v.array(v.string()),
      experience: v.number(),
      bio: v.string(),
      contact: v.string(),
      isAvailable: v.boolean(),
      imageUrl: v.optional(v.string()),
      rating: v.optional(v.number()),
      maxPatientsPerDay: v.number(),
      currentPatientCount: v.number(),
    })
      .index("by_isAvailable", ["isAvailable"])
      .index("by_userId", ["userId"]),

    // Patients with Ayurvedic fields
    patients: defineTable({
      // Personal
      name: v.string(),
      age: v.number(),
      gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
      contact: v.string(),
      email: v.optional(v.string()),
      address: v.string(),
      emergencyContact: v.string(),

      // Medical
      height: v.number(),
      weight: v.number(),
      bmi: v.number(),
      bmiCategory: v.string(),
      bloodPressure: v.optional(v.string()),
      medicalHistory: v.array(v.string()),
      currentMedications: v.array(v.string()),
      allergies: v.array(v.string()),

      // Ayurvedic
      prakriti: prakritiValidator,
      vikriti: v.optional(prakritiValidator),
      dominantDosha: v.string(),
      constitutionType: v.string(),

      // Schedule & preferences
      healthGoals: v.array(v.string()),
      workSchedule: v.string(),
      preferredSessionTime: v.string(),

      // Assignments
      assignedTherapistId: v.optional(v.id("therapists")),
      assignedDietitianId: v.optional(v.id("dietitians")),

      // Owner doctor
      doctorId: v.id("users"),

      // Status
      isActive: v.boolean(),
    }).index("by_doctorId", ["doctorId"]),

    // Therapy sessions (with therapists)
    therapy_sessions: defineTable({
      patientId: v.id("patients"),
      therapistId: v.id("therapists"),
      doctorId: v.id("users"),
      sessionDate: v.string(), // "YYYY-MM-DD"
      timeSlot: v.string(), // "HH:MM-HH:MM"
      status: v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show"),
      ),
      sessionType: v.string(),
      notes: v.optional(v.string()),
      rating: v.optional(v.number()),
    })
      .index("by_therapistId", ["therapistId"])
      .index("by_sessionDate", ["sessionDate"])
      .index("by_therapistId_and_sessionDate", ["therapistId", "sessionDate"]),

    // Dietitian assignments
    dietitian_assignments: defineTable({
      patientId: v.id("patients"),
      dietitianId: v.id("dietitians"),
      doctorId: v.id("users"),
      assignedDate: v.string(), // "YYYY-MM-DD"
      status: v.union(
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
      notes: v.optional(v.string()),
      dietPlan: v.optional(v.string()),
    }).index("by_dietitianId", ["dietitianId"]),

    // Lightweight sessions list keyed by therapist auth user id
    sessions: defineTable({
      therapistUserId: v.string(),
      patientName: v.string(),
      scheduledAt: v.number(), // ms timestamp
      status: v.union(
        v.literal("assigned"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
      notes: v.string(),
      createdByUserId: v.string(),
    }).index("by_therapistUserId", ["therapistUserId"]),

    // OTP sessions for practitioner onboarding
    otp_sessions: defineTable({
      email: v.string(),
      otpCode: v.string(),
      expiresAt: v.number(),
      isVerified: v.boolean(),
      attemptsCount: v.number(),
      role: v.string(),
    }).index("by_email", ["email"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;