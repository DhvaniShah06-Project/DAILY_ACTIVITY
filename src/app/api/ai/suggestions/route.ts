import {
  providePersonalizedSavingSuggestions,
  type ProvidePersonalizedSavingSuggestionsInput,
} from '@/ai/flows/provide-personalized-saving-suggestions';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body =
      (await req.json()) as ProvidePersonalizedSavingSuggestionsInput;
    const result = await providePersonalizedSavingSuggestions(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI SUGGESTIONS API ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
