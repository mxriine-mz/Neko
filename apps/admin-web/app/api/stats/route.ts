import { NextResponse } from 'next/server';
import { botPrisma } from '@/lib/botPrisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalGuilds, totalUsers, totalWarnings] = await Promise.all([
      botPrisma.guild.count(),
      botPrisma.user.count(),
      botPrisma.warning.count(),
    ]);
    return NextResponse.json({ totalGuilds, totalUsers, totalWarnings });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
