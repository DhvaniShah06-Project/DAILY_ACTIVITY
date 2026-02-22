/**
 * @fileOverview This file implements a Genkit flow for providing personalized saving suggestions.
 *
 * - providePersonalizedSavingSuggestions - A function that generates personalized saving suggestions based on spending and budget.
 * - ProvidePersonalizedSavingSuggestionsInput - The input type for the providePersonalizedSavingSuggestions function.
 * - ProvidePersonalizedSavingSuggestionsOutput - The return type for the providePersonalizedSavingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvidePersonalizedSavingSuggestionsInputSchema = z.object({
  spendingCategories: z.array(
    z.object({
      category: z.string().describe('The spending category (e.g., Groceries, Entertainment).'),
      amount: z.number().describe('The amount spent in this category.'),
    })
  ).describe('A list of recent spending patterns by category.'),
  budget: z.object({
    totalBudget: z.number().describe('The total monthly budget.'),
    categoryBudgets: z.array(
      z.object({
        category: z.string().describe('The budget category.'),
        amount: z.number().describe('The allocated budget for this category.'),
      })
    ).describe('A list of budget allocations by category.'),
  }).describe('User\'s budget information.'),
  financialGoals: z.string().optional().describe('Optional description of user\'s financial goals.'),
});
export type ProvidePersonalizedSavingSuggestionsInput = z.infer<typeof ProvidePersonalizedSavingSuggestionsInputSchema>;

const ProvidePersonalizedSavingSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Personalized saving suggestions based on spending patterns and budget.'),
});
export type ProvidePersonalizedSavingSuggestionsOutput = z.infer<typeof ProvidePersonalizedSavingSuggestionsOutputSchema>;

export async function providePersonalizedSavingSuggestions(
  input: ProvidePersonalizedSavingSuggestionsInput
): Promise<ProvidePersonalizedSavingSuggestionsOutput> {
  return providePersonalizedSavingSuggestionsFlow(input);
}

const personalizedSavingSuggestionsPrompt = ai.definePrompt({
  name: 'personalizedSavingSuggestionsPrompt',
  input: {schema: ProvidePersonalizedSavingSuggestionsInputSchema},
  output: {schema: ProvidePersonalizedSavingSuggestionsOutputSchema},
  prompt: `You are an AI financial advisor specializing in providing personalized saving suggestions. Your goal is to help users achieve their financial goals by analyzing their spending and budget.

Here is the user's recent spending:
{{#each spendingCategories}}
- Category: {{{category}}}, Amount: $ {{amount}}
{{/each}}

Here is the user's budget:
- Total Budget: $ {{budget.totalBudget}}
{{#each budget.categoryBudgets}}
- Category: {{{category}}}, Budgeted: $ {{amount}}
{{/each}}

{{#if financialGoals}}
The user's financial goals are: {{{financialGoals}}}
{{/if}}

Based on the provided spending patterns and budget, and considering any specified financial goals, provide actionable and personalized saving suggestions. Highlight areas where spending exceeds budget or where small changes can lead to significant savings. Provide your suggestions in a clear, concise, and encouraging manner.`,
});

const providePersonalizedSavingSuggestionsFlow = ai.defineFlow(
  {
    name: 'providePersonalizedSavingSuggestionsFlow',
    inputSchema: ProvidePersonalizedSavingSuggestionsInputSchema,
    outputSchema: ProvidePersonalizedSavingSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await personalizedSavingSuggestionsPrompt(input);
    return output!;
  }
);
