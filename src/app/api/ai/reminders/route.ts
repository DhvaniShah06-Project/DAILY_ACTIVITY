import {
  generateLocationBasedReminders,
  type GenerateLocationBasedRemindersInput,
} from '@/ai/flows/generate-location-based-reminders';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateLocationBasedRemindersInput;
    const result = await generateLocationBasedReminders(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI REMINDERS API ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
