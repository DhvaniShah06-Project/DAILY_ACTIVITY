import {
  provideBillPaymentTips,
  type ProvideBillPaymentTipsInput,
} from '@/ai/flows/provide-bill-payment-tips';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProvideBillPaymentTipsInput;
    const result = await provideBillPaymentTips(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI BILL TIPS API ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
