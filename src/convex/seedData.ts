import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create test therapists
    const therapist1 = await ctx.db.insert("therapists", {
      userId: "test_user_1" as any, // This would be a real user ID in production
      name: "Dr. Priya Sharma",
      specialization: ["Panchakarma", "Abhyanga", "Shirodhara"],
      experience: 8,
      bio: "Experienced Ayurvedic therapist specializing in traditional Panchakarma treatments.",
      contact: "+91-9876543210",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      rating: 4.8,
      totalSessions: 245,
      hourlyRate: 1500,
    });

    const therapist2 = await ctx.db.insert("therapists", {
      userId: "test_user_2" as any,
      name: "Dr. Rajesh Kumar",
      specialization: ["Yoga Therapy", "Marma Therapy", "Meditation"],
      experience: 12,
      bio: "Senior yoga therapist with expertise in therapeutic yoga and marma point therapy.",
      contact: "+91-9876543211",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      rating: 4.9,
      totalSessions: 380,
      hourlyRate: 2000,
    });

    const therapist3 = await ctx.db.insert("therapists", {
      userId: "test_user_3" as any,
      name: "Dr. Meera Nair",
      specialization: ["Ayurvedic Massage", "Herbal Therapy"],
      experience: 6,
      bio: "Skilled in traditional Ayurvedic massage techniques and herbal treatments.",
      contact: "+91-9876543212",
      isAvailable: false,
      imageUrl: "https://images.unsplash.com/photo-1594824804732-ca8db7ca6fcd?w=400",
      rating: 4.7,
      totalSessions: 156,
      hourlyRate: 1200,
    });

    // Create test dietitians
    const dietitian1 = await ctx.db.insert("dietitians", {
      userId: "test_user_4" as any,
      name: "Dr. Anita Gupta",
      specialization: ["Ayurvedic Nutrition", "Weight Management", "Digestive Health"],
      experience: 10,
      bio: "Certified Ayurvedic nutritionist specializing in personalized diet plans based on body constitution.",
      contact: "+91-9876543213",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
      rating: 4.9,
      maxPatientsPerDay: 8,
      currentPatientCount: 3,
    });

    const dietitian2 = await ctx.db.insert("dietitians", {
      userId: "test_user_5" as any,
      name: "Dr. Suresh Reddy",
      specialization: ["Therapeutic Diets", "Diabetes Management", "Heart Health"],
      experience: 15,
      bio: "Senior dietitian with expertise in managing chronic conditions through Ayurvedic dietary principles.",
      contact: "+91-9876543214",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
      rating: 4.8,
      maxPatientsPerDay: 10,
      currentPatientCount: 7,
    });

    // Create test patients (these would be created by a doctor in real usage)
    const patient1 = await ctx.db.insert("patients", {
      name: "Rahul Verma",
      age: 35,
      gender: "male",
      contact: "+91-9876543215",
      email: "rahul.verma@email.com",
      address: "123 MG Road, Bangalore, Karnataka",
      emergencyContact: "+91-9876543216",
      height: 175,
      weight: 78,
      bmi: 25.5,
      bmiCategory: "Overweight",
      bloodPressure: "130/85",
      medicalHistory: ["Hypertension", "Stress"],
      currentMedications: ["Amlodipine"],
      allergies: ["Peanuts"],
      prakriti: "vata_pitta",
      dominantDosha: "Vata",
      constitutionType: "Vata-Pitta",
      healthGoals: ["Weight management", "Stress reduction", "Better sleep"],
      workSchedule: "9 AM - 6 PM (Mon-Fri)",
      preferredSessionTime: "Evening",
      doctorId: "test_doctor_1" as any,
      isActive: true,
    });

    const patient2 = await ctx.db.insert("patients", {
      name: "Priya Patel",
      age: 28,
      gender: "female",
      contact: "+91-9876543217",
      email: "priya.patel@email.com",
      address: "456 Park Street, Mumbai, Maharashtra",
      emergencyContact: "+91-9876543218",
      height: 160,
      weight: 55,
      bmi: 21.5,
      bmiCategory: "Normal",
      medicalHistory: ["Anxiety", "Digestive issues"],
      currentMedications: [],
      allergies: ["Dairy"],
      prakriti: "pitta",
      dominantDosha: "Pitta",
      constitutionType: "Pitta",
      healthGoals: ["Digestive health", "Mental wellness", "Energy boost"],
      workSchedule: "10 AM - 7 PM (Mon-Sat)",
      preferredSessionTime: "Morning",
      assignedTherapistId: therapist1,
      assignedDietitianId: dietitian1,
      doctorId: "test_doctor_1" as any,
      isActive: true,
    });

    // Create some therapy sessions
    await ctx.db.insert("therapy_sessions", {
      patientId: patient1,
      therapistId: therapist1,
      doctorId: "test_doctor_1" as any,
      sessionDate: "2024-01-15",
      timeSlot: "10:00-11:00",
      status: "completed",
      sessionType: "Abhyanga",
      notes: "Patient responded well to treatment. Recommended weekly sessions.",
      rating: 5,
    });

    await ctx.db.insert("therapy_sessions", {
      patientId: patient2,
      therapistId: therapist2,
      doctorId: "test_doctor_1" as any,
      sessionDate: "2024-01-16",
      timeSlot: "09:00-10:00",
      status: "scheduled",
      sessionType: "Yoga Therapy",
      notes: "Initial assessment session for anxiety management.",
    });

    // Create dietitian assignments
    await ctx.db.insert("dietitian_assignments", {
      patientId: patient2,
      dietitianId: dietitian1,
      doctorId: "test_doctor_1" as any,
      assignedDate: "2024-01-10",
      status: "active",
      notes: "Focus on digestive health and Pitta balancing diet.",
    });

    return {
      message: "Test data seeded successfully!",
      created: {
        therapists: 3,
        dietitians: 2,
        patients: 2,
        sessions: 2,
        assignments: 1,
      }
    };
  },
});
