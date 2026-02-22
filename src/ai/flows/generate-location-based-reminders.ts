/**
 * @fileOverview This file implements a Genkit flow for generating location-based reminders.
 *
 * - generateLocationBasedReminders - A function that generates context-aware reminders based on user location and needs.
 * - GenerateLocationBasedRemindersInput - The input type for the generateLocationBasedReminders function.
 * - GenerateLocationBasedRemindersOutput - The return type for the generateLocationBasedReminders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the location-based reminders.
const GenerateLocationBasedRemindersInputSchema = z.object({
  userLocation: z
    .object({
      latitude: z.number().describe('The current latitude of the user.'),
      longitude: z.number().describe('The current longitude of the user.'),
    })
    .describe("The user's current geographical location."),
  userNeeds: z
    .string()
    .describe('A description of what the user needs or wants to do (e.g., "buy vegetables", "pick up dry cleaning").'),
  userRemindersHistory: z
    .array(z.string())
    .optional()
    .describe('An optional history of past reminders or frequently forgotten items.'),
});

export type GenerateLocationBasedRemindersInput = z.infer<
  typeof GenerateLocationBasedRemindersInputSchema
>;

// Define the output schema for the location-based reminders.
const GenerateLocationBasedRemindersOutputSchema = z.object({
  reminder: z.string().describe('The generated location-based reminder.'),
  storeType: z
    .string()
    .describe('The type of store relevant to the reminder (e.g., "grocery store", "pharmacy").'),
  isRelevant: z
    .boolean()
    .describe('True if a relevant reminder was generated based on the inferred store type and proximity check.'),
});

export type GenerateLocationBasedRemindersOutput = z.infer<
  typeof GenerateLocationBasedRemindersOutputSchema
>;

// Define a tool to simulate checking if the user is near a relevant store.
const isNearRelevantStore = ai.defineTool(
  {
    name: 'isNearRelevantStore',
    description: 'Checks if the user is currently near a store of the specified type.',
    inputSchema: z.object({
      storeType: z.string().describe('The type of store to check proximity for (e.g., "grocery store", "pharmacy", "hardware store").'),
      userLocation: z.object({
        latitude: z.number().describe('The current latitude of the user.'),
        longitude: z.number().describe('The current longitude of the user.'),
      }).describe('The user\'s current geographical location.'),
    }),
    outputSchema: z.boolean().describe('True if the user is near a store of the specified type, false otherwise.'),
  },
  async ({ storeType, userLocation }) => {
    // This is a mock implementation. In a real application, this would call an external API
    // (e.g., Google Places API) to check actual proximity based on userLocation.
    console.log(
      `Mock check: Is user near a '${storeType}' at lat: ${userLocation.latitude}, lon: ${userLocation.longitude}?`
    );
    // For demonstration, let's assume proximity for common needs.
    if (storeType.toLowerCase().includes('grocery') || storeType.toLowerCase().includes('vegetable')) {
      return true;
    }
    if (storeType.toLowerCase().includes('pharmacy') || storeType.toLowerCase().includes('medicine')) {
      return true;
    }
    if (storeType.toLowerCase().includes('dry cleaning')) {
      return true;
    }
    // Assume not near for other types by default
    return false;
  }
);

// Define the prompt for generating location-based reminders.
const locationReminderPrompt = ai.definePrompt({
  name: 'locationReminderPrompt',
  input: { schema: GenerateLocationBasedRemindersInputSchema },
  output: { schema: GenerateLocationBasedRemindersOutputSchema },
  tools: [isNearRelevantStore],
  prompt: `You are a helpful household assistant specialized in providing context-aware reminders.

Based on the user's current location and stated needs, generate a concise, actionable reminder.

First, infer the most relevant 'storeType' based on the 'userNeeds'. Then, use the 'isNearRelevantStore' tool with the 'storeType' and 'userLocation' to determine if the user is near such a store.

If the 'isNearRelevantStore' tool returns true, generate a reminder focused on the 'userNeeds'. Set 'isRelevant' to true.
If the 'isNearRelevantStore' tool returns false, or if no specific store type can be inferred, provide a general reminder about the need but indicate that no relevant store is nearby. Set 'isRelevant' to false.

Consider the 'userRemindersHistory' for additional context, but primarily focus on the current need and location.

Output format MUST strictly adhere to the provided JSON schema, including 'reminder', 'storeType', and 'isRelevant'.

User's current location:
  Latitude: {{{userLocation.latitude}}}
  Longitude: {{{userLocation.longitude}}}
User's needs: {{{userNeeds}}}
{{#if userRemindersHistory}}User's reminder history: {{#each userRemindersHistory}}- {{{this}}}{{/each}}{{/if}}
`,
});

// Define the Genkit flow for generating location-based reminders.
const generateLocationBasedRemindersFlow = ai.defineFlow(
  {
    name: 'generateLocationBasedRemindersFlow',
    inputSchema: GenerateLocationBasedRemindersInputSchema,
    outputSchema: GenerateLocationBasedRemindersOutputSchema,
  },
  async (input) => {
    // The prompt will internally handle the tool call based on its definition.
    const { output } = await locationReminderPrompt(input);
    if (!output) {
      throw new Error('Failed to generate reminder output.');
    }
    return output;
  }
);

/**
 * Generates a context-aware reminder based on the user's location and needs.
 * It utilizes an AI model and a tool to check for proximity to relevant stores.
 *
 * @param input - An object containing the user's location, needs, and optional reminder history.
 * @returns A promise that resolves to an object containing the reminder, store type, and relevance status.
 */
export async function generateLocationBasedReminders(
  input: GenerateLocationBasedRemindersInput
): Promise<GenerateLocationBasedRemindersOutput> {
  return generateLocationBasedRemindersFlow(input);
}
