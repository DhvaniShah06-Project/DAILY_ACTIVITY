'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest cooking task dish names.
 *
 * - suggestCookingTaskDish - A function that suggests dish names based on ingredients and time of day.
 * - SuggestCookingTaskDishInput - The input type for the suggestCookingTaskDish function.
 * - SuggestCookingTaskDishOutput - The return type for the suggestCookingTaskDish function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestCookingTaskDishInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients available to cook with.'),
  timeOfDay: z.string().describe('The current time of day (e.g., "Breakfast", "Lunch", "Dinner").'),
});
export type SuggestCookingTaskDishInput = z.infer<typeof SuggestCookingTaskDishInputSchema>;

const SuggestCookingTaskDishOutputSchema = z.object({
  dishNames: z.array(z.string()).describe('An array of suggested dish names.'),
});
export type SuggestCookingTaskDishOutput = z.infer<typeof SuggestCookingTaskDishOutputSchema>;

export async function suggestCookingTaskDish(
  input: SuggestCookingTaskDishInput
): Promise<SuggestCookingTaskDishOutput> {
  return suggestCookingTaskDishFlow(input);
}

const suggestCookingTaskDishPrompt = ai.definePrompt({
  name: 'suggestCookingTaskDishPrompt',
  input: { schema: SuggestCookingTaskDishInputSchema },
  output: { schema: SuggestCookingTaskDishOutputSchema },
  prompt: `You are a helpful culinary assistant. Given a list of available ingredients and the current time of day,
suggest relevant dish names that can be made. Only suggest dishes that can reasonably be made with the provided ingredients.

Ingredients: {{#each ingredients}}- {{{this}}}{{/each}}
Time of Day: {{{timeOfDay}}}

Please provide your suggestions as a JSON object with a single key 'dishNames' which is an array of strings.`,
});

const suggestCookingTaskDishFlow = ai.defineFlow(
  {
    name: 'suggestCookingTaskDishFlow',
    inputSchema: SuggestCookingTaskDishInputSchema,
    outputSchema: SuggestCookingTaskDishOutputSchema,
  },
  async (input) => {
    const { output } = await suggestCookingTaskDishPrompt(input);
    return output!;
  }
);
