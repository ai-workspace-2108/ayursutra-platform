import { internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Internal mutation to create test users
export const createTestUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create test practitioner user
    const practitionerUserId = await ctx.db.insert("users", {
      name: "Dr. Priya Sharma",
      email: "priya.sharma@ayursutra.com",
      role: "member",
      emailVerificationTime: Date.now(),
    });

    // Create test patient user
    const patientUserId = await ctx.db.insert("users", {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      role: "user",
      emailVerificationTime: Date.now(),
    });

    return { practitionerUserId, patientUserId };
  },
});

// Internal mutation to create test practitioners
export const createTestPractitioners = internalMutation({
  args: {
    practitionerUserId: v.id("users"),
  },
  handler: async (ctx, { practitionerUserId }) => {
    const practitioner1 = await ctx.db.insert("practitioners", {
      userId: practitionerUserId,
      specialization: ["Panchakarma", "General Ayurveda"],
      experience: 15,
      bio: "Dr. Priya Sharma is a renowned Ayurvedic practitioner with over 15 years of experience in Panchakarma treatments. She specializes in detoxification therapies and holistic wellness approaches.",
      contact: "+91-9876543210",
      isVerified: true,
      clinicAddress: "123 Wellness Street, Mumbai, Maharashtra 400001",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    });

    // Create another practitioner
    const anotherUserId = await ctx.db.insert("users", {
      name: "Dr. Arjun Patel",
      email: "arjun.patel@ayursutra.com",
      role: "member",
      emailVerificationTime: Date.now(),
    });

    const practitioner2 = await ctx.db.insert("practitioners", {
      userId: anotherUserId,
      specialization: ["Herbal Medicine", "Pulse Diagnosis"],
      experience: 12,
      bio: "Dr. Arjun Patel is an expert in traditional Ayurvedic diagnosis and herbal medicine formulations. He has helped thousands of patients achieve optimal health through personalized treatment plans.",
      contact: "+91-9876543211",
      isVerified: true,
      clinicAddress: "456 Herbal Lane, Pune, Maharashtra 411001",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    });

    return { practitioner1, practitioner2 };
  },
});

// Internal mutation to create test appointments
export const createTestAppointments = internalMutation({
  args: {
    practitionerId: v.id("practitioners"),
    patientId: v.id("users"),
  },
  handler: async (ctx, { practitionerId, patientId }) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Create upcoming appointment
    const appointment1 = await ctx.db.insert("appointments", {
      practitionerId,
      patientId,
      timeSlot: now + oneDay * 2, // 2 days from now
      date: new Date(now + oneDay * 2).toISOString().split('T')[0],
      status: "confirmed",
      notes: "Initial consultation for digestive issues",
    });

    // Create past appointment
    const appointment2 = await ctx.db.insert("appointments", {
      practitionerId,
      patientId,
      timeSlot: now - oneDay * 7, // 7 days ago
      date: new Date(now - oneDay * 7).toISOString().split('T')[0],
      status: "completed",
      notes: "Follow-up consultation - patient showing improvement",
    });

    // Create pending appointment
    const appointment3 = await ctx.db.insert("appointments", {
      practitionerId,
      patientId,
      timeSlot: now + oneDay * 5, // 5 days from now
      date: new Date(now + oneDay * 5).toISOString().split('T')[0],
      status: "pending",
      notes: "Panchakarma treatment consultation",
    });

    return { appointment1, appointment2, appointment3 };
  },
});

// Main action to seed all test data
export const seedTestData = internalAction({
  args: {},
  handler: async (ctx): Promise<{
    message: string;
    data: {
      users: { practitionerUserId: Id<"users">; patientUserId: Id<"users"> };
      practitioners: { practitioner1: Id<"practitioners">; practitioner2: Id<"practitioners"> };
      appointments: {
        appointment1: Id<"appointments">;
        appointment2: Id<"appointments">;
        appointment3: Id<"appointments">;
      };
    };
  }> => {
    console.log("Starting to seed test data...");

    // Create test users
    const {
      practitionerUserId,
      patientUserId,
    }: { practitionerUserId: Id<"users">; patientUserId: Id<"users"> } = await ctx.runMutation(
      (internal as any).dev.createTestUsers,
      {}
    );

    console.log("Created test users:", { practitionerUserId, patientUserId });

    // Create test practitioners
    const {
      practitioner1,
      practitioner2,
    }: { practitioner1: Id<"practitioners">; practitioner2: Id<"practitioners"> } = await ctx.runMutation(
      (internal as any).dev.createTestPractitioners,
      { practitionerUserId }
    );

    console.log("Created test practitioners:", { practitioner1, practitioner2 });

    // Create test appointments
    const appointments: {
      appointment1: Id<"appointments">;
      appointment2: Id<"appointments">;
      appointment3: Id<"appointments">;
    } = await ctx.runMutation(
      (internal as any).dev.createTestAppointments,
      { practitionerId: practitioner1, patientId: patientUserId }
    );

    console.log("Created test appointments:", appointments);

    console.log("Test data seeding completed successfully!");

    return {
      message: "Test data seeded successfully",
      data: {
        users: { practitionerUserId, patientUserId },
        practitioners: { practitioner1, practitioner2 },
        appointments,
      },
    };
  },
});