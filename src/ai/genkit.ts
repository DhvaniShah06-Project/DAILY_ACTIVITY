import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { getFirebaseConfig } from '@/firebase/config';

const firebaseConfig = getFirebaseConfig();

export const ai = genkit({
  plugins: [googleAI({apiKey: firebaseConfig.apiKey})],
  model: 'googleai/gemini-2.5-flash',
});
