import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { prakritiValidator } from "./schema";

// Get all patients for a doctor
export const getPatientsByDoctor = query({
  args: { doctorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patients")
      .withIndex("by_doctorId", (q) => q.eq("doctorId", args.doctorId))
      .collect();
  },
});

// Get patient by ID
export const getPatientById = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.patientId);
  },
});

// Register new patient
export const registerPatient = mutation({
  args: {
    // Personal Information
    name: v.string(),
    age: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    contact: v.string(),
    email: v.optional(v.string()),
    address: v.string(),
    emergencyContact: v.string(),
    
    // Medical Information
    height: v.number(),
    weight: v.number(),
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
    
    // Doctor ID
    doctorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Calculate BMI
    const heightInMeters = args.height / 100;
    const bmi = args.weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    const patientId = await ctx.db.insert("patients", {
      ...args,
      bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
      bmiCategory,
      isActive: true,
    });

    return patientId;
  },
});

// Update patient information
export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),
    updates: v.object({
      name: v.optional(v.string()),
      age: v.optional(v.number()),
      contact: v.optional(v.string()),
      email: v.optional(v.string()),
      address: v.optional(v.string()),
      height: v.optional(v.number()),
      weight: v.optional(v.number()),
      healthGoals: v.optional(v.array(v.string())),
      workSchedule: v.optional(v.string()),
      preferredSessionTime: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const patient = await ctx.db.get(args.patientId);
    if (!patient) throw new Error("Patient not found");

    // Recalculate BMI if height or weight changed
    let bmi = patient.bmi;
    let bmiCategory = patient.bmiCategory;
    
    if (args.updates.height || args.updates.weight) {
      const height = args.updates.height || patient.height;
      const weight = args.updates.weight || patient.weight;
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
      
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal";
      else if (bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";
      
      bmi = Math.round(bmi * 10) / 10;
    }

    await ctx.db.patch(args.patientId, {
      ...args.updates,
      bmi,
      bmiCategory,
    });

    return args.patientId;
  },
});

// Assign therapist to patient
export const assignTherapistToPatient = mutation({
  args: {
    patientId: v.id("patients"),
    therapistId: v.id("therapists"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.patientId, {
      assignedTherapistId: args.therapistId,
    });
    return args.patientId;
  },
});

// Assign dietitian to patient
export const assignDietitianToPatient = mutation({
  args: {
    patientId: v.id("patients"),
    dietitianId: v.id("dietitians"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.patientId, {
      assignedDietitianId: args.dietitianId,
    });
    return args.patientId;
  },
});
