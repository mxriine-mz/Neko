import { NextRequest, NextResponse } from 'next/server';
import { botPrisma } from '@/lib/botPrisma';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ discordId: string; guildId: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { discordId, guildId } = await params;
    const data = await req.json();
    const user = await botPrisma.user.update({
      where: { discordId_guildId: { discordId, guildId } },
      data,
    });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { discordId, guildId } = await params;
    await botPrisma.user.delete({
      where: { discordId_guildId: { discordId, guildId } },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
