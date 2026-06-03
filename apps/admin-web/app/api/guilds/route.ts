import { NextResponse } from 'next/server';
import { botPrisma } from '@/lib/botPrisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const guilds = await botPrisma.guild.findMany({
      include: {
        users: { take: 5, orderBy: { level: 'desc' } },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(guilds);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
