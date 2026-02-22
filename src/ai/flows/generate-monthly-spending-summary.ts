/**
 * @fileOverview A Genkit flow for generating a monthly spending summary.
 *
 * - generateMonthlySpendingSummary - A function that handles the generation of monthly spending summaries.
 * - GenerateMonthlySpendingSummaryInput - The input type for the generateMonthlySpendingSummary function.
 * - GenerateMonthlySpendingSummaryOutput - The return type for the generateMonthlySpendingSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMonthlySpendingSummaryInputSchema = z.object({
  month: z.string().describe('The month for which the spending summary is requested, e.g., "January 2024".'),
  expenses: z.array(z.object({
    category: z.string().describe('The category of the expense (e.g., "Grocery", "Transport", "Rent").'),
    amount: z.number().describe('The amount spent for this expense.'),
    description: z.string().optional().describe('An optional description for the expense.'),
  })).describe('An array of all expenses recorded for the month.'),
});
export type GenerateMonthlySpendingSummaryInput = z.infer<typeof GenerateMonthlySpendingSummaryInputSchema>;

const GenerateMonthlySpendingSummaryOutputSchema = z.object({
  totalSpending: z.number().describe('The total amount of money spent for the month.'),
  categoryBreakdown: z.array(z.object({
    category: z.string().describe('The category of spending.'),
    amount: z.number().describe('The total amount spent in this category.'),
    percentage: z.number().describe('The percentage of total spending this category represents (0.0 to 1.0).'),
  })).describe('A breakdown of spending by category, including amounts and percentages.'),
  summaryText: z.string().describe('A textual summary of the user\'s spending habits for the month.'),
  tips: z.array(z.string()).describe('Personalized saving suggestions based on the spending patterns.'),
});
export type GenerateMonthlySpendingSummaryOutput = z.infer<typeof GenerateMonthlySpendingSummaryOutputSchema>;

export async function generateMonthlySpendingSummary(input: GenerateMonthlySpendingSummaryInput): Promise<GenerateMonthlySpendingSummaryOutput> {
  return generateMonthlySpendingSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMonthlySpendingSummaryPrompt',
  input: { schema: GenerateMonthlySpendingSummaryInputSchema },
  output: { schema: GenerateMonthlySpendingSummaryOutputSchema },
  prompt: `You are an AI assistant specialized in personal finance and household management. Your task is to analyze the provided monthly spending data and generate a comprehensive summary.

Here are the expenses for the month of {{{month}}}:
{{#each expenses}}
- Category: {{{category}}}, Amount: {{{amount}}}{{#if description}}, Description: {{{description}}}{{/if}}
{{/each}}

Based on this data, provide the following:
1.  The total amount spent.
2.  A breakdown of spending by category, including the total amount for each category and its percentage of the total spending.
3.  A concise textual summary of the user's spending habits for the month.
4.  At least two personalized saving suggestions based on the spending patterns you observe.

Ensure the output strictly adheres to the JSON schema provided.
`,
});

const generateMonthlySpendingSummaryFlow = ai.defineFlow(
  {
    name: 'generateMonthlySpendingSummaryFlow',
    inputSchema: GenerateMonthlySpendingSummaryInputSchema,
    outputSchema: GenerateMonthlySpendingSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
