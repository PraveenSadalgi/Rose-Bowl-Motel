'use server';

/**
 * @fileOverview Determines whether to enhance the map with a list of nearby attractions based on user preference.
 *
 * This file exports:
 * - `shouldAddNearbyAttractions`: A function that decides whether to include nearby attractions.
 * - `ShouldAddNearbyAttractionsInput`: The input type for the `shouldAddNearbyAttractions` function.
 * - `ShouldAddNearbyAttractionsOutput`: The output type for the `shouldAddNearbyAttractions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShouldAddNearbyAttractionsInputSchema = z.object({
  userPreference: z
    .string()
    .describe(
      'The user preference on whether they want to see nearby attractions on the map.'
    ),
});
export type ShouldAddNearbyAttractionsInput = z.infer<typeof ShouldAddNearbyAttractionsInputSchema>;

const ShouldAddNearbyAttractionsOutputSchema = z.object({
  includeAttractions: z
    .boolean()
    .describe(
      'Whether or not to include nearby attractions on the map based on user preference.'
    ),
});
export type ShouldAddNearbyAttractionsOutput = z.infer<typeof ShouldAddNearbyAttractionsOutputSchema>;

export async function shouldAddNearbyAttractions(
  input: ShouldAddNearbyAttractionsInput
): Promise<ShouldAddNearbyAttractionsOutput> {
  return decideNearbyAttractionsFlow(input);
}

const decideNearbyAttractionsPrompt = ai.definePrompt({
  name: 'decideNearbyAttractionsPrompt',
  input: {schema: ShouldAddNearbyAttractionsInputSchema},
  output: {schema: ShouldAddNearbyAttractionsOutputSchema},
  prompt: `Based on the user's preference: "{{userPreference}}", decide whether or not to include nearby attractions on the map. Return a boolean value in the "includeAttractions" field indicating your decision.`,
});

const decideNearbyAttractionsFlow = ai.defineFlow(
  {
    name: 'decideNearbyAttractionsFlow',
    inputSchema: ShouldAddNearbyAttractionsInputSchema,
    outputSchema: ShouldAddNearbyAttractionsOutputSchema,
  },
  async input => {
    const {output} = await decideNearbyAttractionsPrompt(input);
    return output!;
  }
);
