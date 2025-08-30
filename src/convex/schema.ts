import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

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