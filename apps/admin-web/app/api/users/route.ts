import { NextResponse } from 'next/server';
import { botPrisma } from '@/lib/botPrisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await botPrisma.user.findMany({
      include: { warnings: true, guild: { select: { id: true, name: true } } },
      orderBy: { level: 'desc' },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
