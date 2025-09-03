'use server';

/**
 * @fileOverview AI-powered recommendations for helmet settings based on user usage patterns and preferences.
 *
 * - personalizeHelmetSettings - A function that handles the personalization process.
 * - PersonalizedHelmetSettingsInput - The input type for the personalizeHelmetSettings function.
 * - PersonalizedHelmetSettingsOutput - The return type for the personalizeHelmetSettings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHelmetSettingsInputSchema = z.object({
  usagePatterns: z
    .string()
    .describe(
      'Description of the user helmet usage patterns, such as commuting, sport, etc.'
    ),
  preferences: z
    .string()
    .describe('User preferences regarding helmet settings like comfort, safety, etc.'),
});
export type PersonalizedHelmetSettingsInput =
  z.infer<typeof PersonalizedHelmetSettingsInputSchema>;

const PersonalizedHelmetSettingsOutputSchema = z.object({
  recommendedSettings: z
    .string()
    .describe(
      'AI-powered recommended helmet settings based on usage patterns and preferences.'
    ),
  explanation: z
    .string()
    .describe(
      'Explanation of why these settings are recommended for the user.'
    ),
});
export type PersonalizedHelmetSettingsOutput =
  z.infer<typeof PersonalizedHelmetSettingsOutputSchema>;

export async function personalizeHelmetSettings(
  input: PersonalizedHelmetSettingsInput
): Promise<PersonalizedHelmetSettingsOutput> {
  return personalizeHelmetSettingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHelmetSettingsPrompt',
  input: {schema: PersonalizedHelmetSettingsInputSchema},
  output: {schema: PersonalizedHelmetSettingsOutputSchema},
  prompt: `You are an AI assistant specializing in providing personalized helmet settings recommendations.

  Based on the user's usage patterns and preferences, suggest optimal helmet settings and explain why they are recommended.

  Usage Patterns: {{{usagePatterns}}}
  Preferences: {{{preferences}}}

  Provide the recommended settings and a detailed explanation.
  `,
});

const personalizeHelmetSettingsFlow = ai.defineFlow(
  {
    name: 'personalizeHelmetSettingsFlow',
    inputSchema: PersonalizedHelmetSettingsInputSchema,
    outputSchema: PersonalizedHelmetSettingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
