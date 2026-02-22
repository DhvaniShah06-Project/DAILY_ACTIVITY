import {
  generateMonthlySpendingSummary,
  type GenerateMonthlySpendingSummaryInput,
} from '@/ai/flows/generate-monthly-spending-summary';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateMonthlySpendingSummaryInput;
    const result = await generateMonthlySpendingSummary(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI SPENDING SUMMARY API ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
