
'use server';
/**
 * @fileOverview AI-powered route suggestions for cyclists.
 *
 * - getRouteSuggestions - A function that recommends cycling routes based on user location and preferences.
 * - RouteSuggestionsInput - The input type for the getRouteSuggestions function.
 * - RouteSuggestionsOutput - The return type for the getRouteSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RouteSuggestionsInputSchema = z.object({
  latitude: z.number().describe("The user's current latitude."),
  longitude: z.number().describe("The user's current longitude."),
  terrains: z
    .array(z.string())
    .describe('An array of preferred terrains (e.g., Road, Gravel).'),
  disciplines: z
    .array(z.string())
    .describe(
      'An array of preferred cycling disciplines (e.g., Mountain biking, BMX).'
    ),
});
export type RouteSuggestionsInput = z.infer<typeof RouteSuggestionsInputSchema>;

const RouteSuggestionSchema = z.object({
  name: z.string().describe('A catchy and descriptive name for the route.'),
  description: z
    .string()
    .describe(
      'A detailed description of the route, highlighting its key features and why it matches the user\'s preferences.'
    ),
  latitude: z.number().describe('A representative latitude for the route.'),
  longitude: z.number().describe('A representative longitude for the route.'),
  estimatedTime: z
    .string()
    .describe(
      'An estimated time to complete the route on a bicycle (e.g., "Approx. 2 hours").'
    ),
});

const RouteSuggestionsOutputSchema = z.object({
  routes: z
    .array(RouteSuggestionSchema)
    .describe('An array of 2-3 recommended cycling routes.'),
});
export type RouteSuggestionsOutput = z.infer<
  typeof RouteSuggestionsOutputSchema
>;

export async function getRouteSuggestions(
  input: RouteSuggestionsInput
): Promise<RouteSuggestionsOutput> {
  return getRouteSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeSuggestionsPrompt',
  input: { schema: RouteSuggestionsInputSchema },
  output: { schema: RouteSuggestionsOutputSchema },
  prompt: `You are an expert cycling guide. Your task is to recommend 2-3 cycling routes near the user's location based on their preferences.

User Location:
- Latitude: {{{latitude}}}
- Longitude: {{{longitude}}}

User Preferences:
- Terrains: {{#each terrains}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
- Disciplines: {{#each disciplines}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}

For each route, provide:
1.  A catchy, descriptive name.
2.  A detailed description highlighting why it's a great choice based on the user's preferences (mentioning terrain, difficulty, scenery, etc.).
3.  A representative latitude and longitude for the suggested route area.
4.  An estimated time to complete the route on a bicycle, based on average cycling speed for the described terrain and difficulty.

For example:
- If the user chooses 'Gravel' and 'Bikepacking', suggest scenic dirt paths, mentioning their suitability for multi-day trips and estimate the time per day.
- If the user chooses 'Downhill', focus on steep, technical, trail-heavy areas and provide an estimated time for a single run or a few runs.

Generate a diverse set of recommendations.
`,
});

const getRouteSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRouteSuggestionsFlow',
    inputSchema: RouteSuggestionsInputSchema,
    outputSchema: RouteSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
