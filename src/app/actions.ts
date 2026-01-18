'use server';

import { shouldAddNearbyAttractions } from '@/ai/flows/decide-nearby-attractions';

export async function getAttractionDecision(userPreference: string) {
  try {
    const result = await shouldAddNearbyAttractions({ userPreference });
    return result;
  } catch (error) {
    console.error('Error in GenAI flow:', error);
    // Fallback to a default behavior in case of an error
    return { includeAttractions: false };
  }
}
