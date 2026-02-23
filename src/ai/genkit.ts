'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// By leaving the googleAI() plugin configuration empty, Genkit will automatically
// look for the GEMINI_API_KEY in the environment variables. This is the
// robust and recommended way to handle authentication in deployed environments.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
