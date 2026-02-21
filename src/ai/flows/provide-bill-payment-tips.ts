'use server';
/**
 * @fileOverview A Genkit flow for providing personalized bill payment tips based on payment history.
 *
 * - provideBillPaymentTips - A function that handles the bill payment tips generation process.
 * - ProvideBillPaymentTipsInput - The input type for the provideBillPaymentTips function.
 * - ProvideBillPaymentTipsOutput - The return type for the provideBillPaymentTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BillPaymentSchema = z.object({
  name: z.string().describe('Name of the bill (e.g., Electricity, Water, Rent).'),
  amount: z.number().describe('Amount of the bill.'),
  dueDate: z.string().describe('Due date of the bill in YYYY-MM-DD format.'),
  paymentDate: z.string().optional().describe('Date the bill was paid in YYYY-MM-DD format. Null if not paid.'),
  status: z.enum(['paid', 'unpaid', 'overdue']).describe('Current status of the bill.'),
  category: z.string().describe('Category of the bill (e.g., Utilities, Housing, Subscription).'),
});

const ProvideBillPaymentTipsInputSchema = z.object({
  billHistory: z.array(BillPaymentSchema).describe('A list of past and current bill payment records.'),
  userName: z.string().optional().describe('The name of the user, for personalization.'),
});
export type ProvideBillPaymentTipsInput = z.infer<typeof ProvideBillPaymentTipsInputSchema>;

const ProvideBillPaymentTipsOutputSchema = z.object({
  tips: z.string().describe('Personalized tips and suggestions for managing bill payments.'),
});
export type ProvideBillPaymentTipsOutput = z.infer<typeof ProvideBillPaymentTipsOutputSchema>;

export async function provideBillPaymentTips(
  input: ProvideBillPaymentTipsInput
): Promise<ProvideBillPaymentTipsOutput> {
  return provideBillPaymentTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideBillPaymentTipsPrompt',
  input: {schema: ProvideBillPaymentTipsInputSchema},
  output: {schema: ProvideBillPaymentTipsOutputSchema},
  prompt: `You are an AI assistant specialized in household financial management.

Your task is to analyze the provided bill payment history and offer personalized tips and suggestions to help the user manage their expenses better and optimize their spending.

Consider the following aspects when generating tips:
- Identify bills that are frequently overdue.
- Suggest ways to reduce recurring expenses (e.g., subscription review).
- Highlight patterns in spending by category.
- Provide general financial management advice related to bill payments.
- Ensure the tips are actionable and easy to understand.
- Use a friendly and helpful tone.

User Name: {{{userName}}}

Bill Payment History:
{{#each billHistory}}
  - Name: {{{name}}}, Amount: {{{amount}}}, Due Date: {{{dueDate}}}, Payment Date: {{{paymentDate}}}, Status: {{{status}}}, Category: {{{category}}}
{{/each}}

Based on this history, please provide personalized tips and suggestions to improve bill management and spending:`,
});

const provideBillPaymentTipsFlow = ai.defineFlow(
  {
    name: 'provideBillPaymentTipsFlow',
    inputSchema: ProvideBillPaymentTipsInputSchema,
    outputSchema: ProvideBillPaymentTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate bill payment tips.');
    }
    return output;
  }
);
