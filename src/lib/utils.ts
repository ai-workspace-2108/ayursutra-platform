import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// BMI Calculation utilities
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Prakriti Assessment utilities
export interface PrakritiAnswers {
  [key: string]: number; // Question ID to answer value (1-3)
}

export function calculatePrakriti(answers: PrakritiAnswers): {
  vata: number;
  pitta: number;
  kapha: number;
  dominantDosha: string;
  constitutionType: string;
} {
  // Question weights for each dosha
  const questionWeights = getQuestionWeights();
  
  let vataScore = 0;
  let pittaScore = 0;
  let kaphaScore = 0;
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const weights = questionWeights[questionId];
    if (weights) {
      vataScore += weights.vata * answer;
      pittaScore += weights.pitta * answer;
      kaphaScore += weights.kapha * answer;
    }
  });
  
  const total = vataScore + pittaScore + kaphaScore;
  const vataPercentage = (vataScore / total) * 100;
  const pittaPercentage = (pittaScore / total) * 100;
  const kaphaPercentage = (kaphaScore / total) * 100;
  
  const dominantDosha = getDominantDosha(vataPercentage, pittaPercentage, kaphaPercentage);
  const constitutionType = getConstitutionType(vataPercentage, pittaPercentage, kaphaPercentage);
  
  return {
    vata: Math.round(vataPercentage),
    pitta: Math.round(pittaPercentage),
    kapha: Math.round(kaphaPercentage),
    dominantDosha,
    constitutionType,
  };
}

export function getDominantDosha(vata: number, pitta: number, kapha: number): string {
  if (vata > pitta && vata > kapha) return "Vata";
  if (pitta > kapha) return "Pitta";
  return "Kapha";
}

export function getConstitutionType(vata: number, pitta: number, kapha: number): string {
  const scores = [
    { name: "Vata", value: vata },
    { name: "Pitta", value: pitta },
    { name: "Kapha", value: kapha },
  ].sort((a, b) => b.value - a.value);
  
  const highest = scores[0];
  const second = scores[1];
  
  // If the difference between highest and second is less than 10%, it's a dual constitution
  if (highest.value - second.value < 10) {
    if (Math.abs(vata - pitta) < 10 && Math.abs(pitta - kapha) < 10) {
      return "Tridosha";
    }
    return `${highest.name}-${second.name}`;
  }
  
  return highest.name;
}

export function getQuestionWeights(): Record<string, { vata: number; pitta: number; kapha: number }> {
  return {
    "body_frame": { vata: 3, pitta: 2, kapha: 1 },
    "body_weight": { vata: 3, pitta: 2, kapha: 1 },
    "skin_type": { vata: 3, pitta: 2, kapha: 1 },
    "hair_type": { vata: 3, pitta: 2, kapha: 1 },
    "eyes": { vata: 2, pitta: 3, kapha: 1 },
    "appetite": { vata: 3, pitta: 2, kapha: 1 },
    "digestion": { vata: 3, pitta: 2, kapha: 1 },
    "thirst": { vata: 2, pitta: 3, kapha: 1 },
    "elimination": { vata: 3, pitta: 2, kapha: 1 },
    "physical_activity": { vata: 3, pitta: 2, kapha: 1 },
    "mental_activity": { vata: 3, pitta: 2, kapha: 1 },
    "emotions": { vata: 3, pitta: 2, kapha: 1 },
    "sleep": { vata: 3, pitta: 2, kapha: 1 },
    "speech": { vata: 3, pitta: 2, kapha: 1 },
    "weather_preference": { vata: 2, pitta: 3, kapha: 1 },
  };
}

// Format date utilities
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [start, end] = time.split('-');
  return `${start} - ${end}`;
}

// Generate time slots
export function generateTimeSlots(): string[] {
  return [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
  ];
}