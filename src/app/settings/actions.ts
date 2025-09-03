"use server";

import { personalizeHelmetSettings } from "@/ai/flows/personalized-helmet-settings";
import { z } from "zod";

const PersonalizationInputSchema = z.object({
  usagePatterns: z.string().min(10, { message: "Please describe your usage patterns in more detail." }),
  preferences: z.string().min(10, { message: "Please describe your preferences in more detail." }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: {
    recommendedSettings: string;
    explanation: string;
  };
};

export async function getPersonalizedSettings(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PersonalizationInputSchema.safeParse({
    usagePatterns: formData.get("usagePatterns"),
    preferences: formData.get("preferences"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;

    return {
      message: "Error: Invalid form data.",
      fields: {
        usagePatterns: formData.get("usagePatterns")?.toString() ?? "",
        preferences: formData.get("preferences")?.toString() ?? "",
      },
      issues: errors.map((issue) => issue.message),
    };
  }
  
  try {
    const result = await personalizeHelmetSettings(validatedFields.data);
    return {
      message: "Success! Here are your personalized settings.",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
