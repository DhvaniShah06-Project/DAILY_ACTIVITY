'use server';

import {
  suggestCookingTaskDish,
  type SuggestCookingTaskDishInput,
} from '@/ai/flows/suggest-cooking-task-dish';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SuggestCookingTaskDishInput;
    const result = await suggestCookingTaskDish(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI DISH SUGGESTION API ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
