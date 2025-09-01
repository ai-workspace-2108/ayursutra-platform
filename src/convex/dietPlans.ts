"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// IMPORTANT: Using the provided API key directly for functionality.
// For production, move to process.env.GEMINI_API_KEY via integration UI.
const GEMINI_API_KEY = "AIzaSyCx39aQZquhFvUHttb6p-ijnPL2kReBQxY";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export const generateDietPlan = action({
  args: {
    patientSummary: v.string(),
    constitution: v.optional(v.string()),
    medicalConditions: v.optional(v.string()),
    restrictions: v.optional(v.string()),
    preferredMealTimes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `
You are a registered clinical dietitian generating a safe, evidence-based, ayurvedically-aligned diet plan.
Follow strictly:
- Ensure medical safety, check for drug-nutrient interactions, allergies, and contraindications.
- No extreme caloric restriction. Balanced, sustainable approach.
- Reflect patient work schedule and preferred meal timing.
- Include sample day schedule, weekly rotation ideas, and concise shopping list.
- Provide a short "Clinical Assessment" summary with checks and cautions.

Patient OPD Summary:
${args.patientSummary}

Additional Parameters:
Constitution: ${args.constitution || "—"}
Medical Conditions: ${args.medicalConditions || "—"}
Allergies/Restrictions: ${args.restrictions || "—"}
Preferred Meal Times: ${args.preferredMealTimes || "—"}

Output Format:
- Plan Summary (duration, daily calories, meals)
- Sample Day Schedule (times and items)
- Weekly Rotation (bullet list)
- Shopping List (bullet list)
- Preparation Guide (bullet list)
- Clinical Assessment (checks + cautions)
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Gemini error: ${res.status} ${t}`);
    }
    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ||
      "";
    return text;
  },
});
