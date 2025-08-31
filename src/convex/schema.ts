import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  DOCTOR: "doctor",
  THERAPIST: "therapist",
  DIETITIAN: "dietitian",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.DOCTOR),
  v.literal(ROLES.THERAPIST),
  v.literal(ROLES.DIETITIAN),
);
export type Role = Infer<typeof roleValidator>;

// Ayurvedic body types (Prakriti)
export const PRAKRITI_TYPES = {
  VATA: "vata",
  PITTA: "pitta",
  KAPHA: "kapha",
  VATA_PITTA: "vata_pitta",
  PITTA_KAPHA: "pitta_kapha",
  VATA_KAPHA: "vata_kapha",
  TRIDOSHA: "tridosha",
} as const;

export const prakritiValidator = v.union(
  v.literal(PRAKRITI_TYPES.VATA),
  v.literal(PRAKRITI_TYPES.PITTA),
  v.literal(PRAKRITI_TYPES.KAPHA),
  v.literal(PRAKRITI_TYPES.VATA_PITTA),
  v.literal(PRAKRITI_TYPES.PITTA_KAPHA),
  v.literal(PRAKRITI_TYPES.VATA_KAPHA),
  v.literal(PRAKRITI_TYPES.TRIDOSHA),
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
    })
      .index("email", ["email"]), // index for the email. do not remove or modify

    // OTP sessions table for email verification
    otp_sessions: defineTable({
      email: v.string(),
      otpCode: v.string(),
      expiresAt: v.number(),
      isVerified: v.boolean(),
      attemptsCount: v.number(),
      role: v.string(),
    }).index("by_email", ["email"]),

    // AyurSutra specific tables
    practitioners: defineTable({
      userId: v.id("users"),
      specialization: v.array(v.string()),
      experience: v.number(),
      bio: v.string(),
      contact: v.string(),
      isVerified: v.boolean(),
      clinicAddress: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
    })
      .index("by_userId", ["userId"])
      .index("by_isVerified", ["isVerified"]),

    // Therapists table
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
      hourlyRate: v.optional(v.number()),
    })
      .index("by_userId", ["userId"])
      .index("by_isAvailable", ["isAvailable"])
      .index("by_specialization", ["specialization"]),

    // Dietitians table
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
      .index("by_userId", ["userId"])
      .index("by_isAvailable", ["isAvailable"])
      .index("by_specialization", ["specialization"]),

    // Patients table
    patients: defineTable({
      // Personal Information
      name: v.string(),
      age: v.number(),
      gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
      contact: v.string(),
      email: v.optional(v.string()),
      address: v.string(),
      emergencyContact: v.string(),
      
      // Medical Information
      height: v.number(), // in cm
      weight: v.number(), // in kg
      bmi: v.number(),
      bmiCategory: v.string(),
      bloodPressure: v.optional(v.string()),
      medicalHistory: v.array(v.string()),
      currentMedications: v.array(v.string()),
      allergies: v.array(v.string()),
      
      // Ayurvedic Assessment
      prakriti: prakritiValidator,
      vikriti: v.optional(prakritiValidator),
      dominantDosha: v.string(),
      constitutionType: v.string(),
      
      // Health Goals & Work Schedule
      healthGoals: v.array(v.string()),
      workSchedule: v.string(),
      preferredSessionTime: v.string(),
      
      // Assignment tracking
      assignedTherapistId: v.optional(v.id("therapists")),
      assignedDietitianId: v.optional(v.id("dietitians")),
      doctorId: v.id("users"), // The doctor who registered this patient
      
      // Status
      isActive: v.boolean(),
    })
      .index("by_doctorId", ["doctorId"])
      .index("by_assignedTherapistId", ["assignedTherapistId"])
      .index("by_assignedDietitianId", ["assignedDietitianId"])
      .index("by_prakriti", ["prakriti"])
      .index("by_isActive", ["isActive"]),

    // Therapy Sessions table
    therapy_sessions: defineTable({
      patientId: v.id("patients"),
      therapistId: v.id("therapists"),
      doctorId: v.id("users"),
      sessionDate: v.string(), // YYYY-MM-DD format
      timeSlot: v.string(), // e.g., "09:00-10:00"
      status: v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
      ),
      sessionType: v.string(), // e.g., "Panchakarma", "Massage", "Yoga"
      notes: v.optional(v.string()),
      feedback: v.optional(v.string()),
      rating: v.optional(v.number()),
    })
      .index("by_patientId", ["patientId"])
      .index("by_therapistId", ["therapistId"])
      .index("by_doctorId", ["doctorId"])
      .index("by_sessionDate", ["sessionDate"])
      .index("by_status", ["status"])
      .index("by_therapistId_and_sessionDate", ["therapistId", "sessionDate"]),

    // Dietitian Assignments table
    dietitian_assignments: defineTable({
      patientId: v.id("patients"),
      dietitianId: v.id("dietitians"),
      doctorId: v.id("users"),
      assignedDate: v.string(),
      status: v.union(
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      dietPlan: v.optional(v.string()),
      notes: v.optional(v.string()),
      followUpDate: v.optional(v.string()),
    })
      .index("by_patientId", ["patientId"])
      .index("by_dietitianId", ["dietitianId"])
      .index("by_doctorId", ["doctorId"])
      .index("by_status", ["status"])
      .index("by_assignedDate", ["assignedDate"]),

    appointments: defineTable({
      practitionerId: v.id("practitioners"),
      patientId: v.id("users"),
      timeSlot: v.number(),
      date: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("cancelled"),
        v.literal("completed")
      ),
      notes: v.optional(v.string()),
    })
      .index("by_practitionerId_and_timeSlot", ["practitionerId", "timeSlot"])
      .index("by_patientId_and_timeSlot", ["patientId", "timeSlot"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;