'use server';
/**
 * @fileOverview An AI flow to retrieve a list of suburbs for a given city.
 *
 * - getSuburbsForCity - A function that fetches suburbs for a city.
 * - SuburbInputSchema - The input type for the getSuburbsForCity function.
 * - SuburbOutputSchema - The return type for the getSuburbsForCity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const SuburbInputSchema = z.object({
  city: z.string().describe('The name of the city in South Africa.'),
});
export type SuburbInput = z.infer<typeof SuburbInputSchema>;

export const SuburbOutputSchema = z.object({
  suburbs: z.array(z.string()).describe('A list of suburbs for the given city.'),
});
export type SuburbOutput = z.infer<typeof SuburbOutputSchema>;

export async function getSuburbsForCity(input: SuburbInput): Promise<SuburbOutput> {
  return suburbFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSuburbsPrompt',
  input: {schema: SuburbInputSchema},
  output: {schema: SuburbOutputSchema},
  prompt: `You are a geographical data expert for South Africa.
    Given the city name '{{{city}}}', provide a comprehensive list of all its suburbs.
    Return the list as a JSON object with a single key "suburbs" containing an array of strings.
    Ensure the list is alphabetically sorted.`,
});

const suburbFlow = ai.defineFlow(
  {
    name: 'suburbFlow',
    inputSchema: SuburbInputSchema,
    outputSchema: SuburbOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return { suburbs: [] };
    }
    return output;
  }
);
