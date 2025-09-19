'use server';
/**
 * @fileOverview AI-powered route suggestions for cyclists.
 *
 * - getRouteSuggestions - A function that recommends cycling routes based on user location and preferences.
 * - RouteSuggestionsInput - The input type for the getRouteSuggestions function.
 * - RouteSuggestionsOutput - The return type for the getRouteSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RouteSuggestionsInputSchema = z.object({
  latitude: z.number().describe('The user\'s current latitude.'),
  longitude: z.number().describe('The user\'s current longitude.'),
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
  imagePrompt: z
    .string()
    .describe(
      'A DALL-E prompt to generate a visually appealing and representative image of the route.'
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
3.  A concise, powerful prompt for an image generation model (like DALL-E) to create a stunning, realistic photo of the route. The prompt should be in the format: "A cinematic shot of [description]".

For example:
- If the user chooses 'Gravel' and 'Bikepacking', suggest scenic dirt paths, mentioning their suitability for multi-day trips.
- If the user chooses 'Downhill', focus on steep, technical, trail-heavy areas.

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
