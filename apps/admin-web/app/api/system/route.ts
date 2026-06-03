import { NextResponse } from 'next/server';
import { systemSnapshot } from '@/lib/system';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await systemSnapshot());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
