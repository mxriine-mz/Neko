import { NextRequest, NextResponse } from 'next/server';
import { botPrisma } from '@/lib/botPrisma';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const guild = await botPrisma.guild.findUnique({
      where: { id },
      include: {
        users: {
          include: { warnings: true },
          orderBy: { level: 'desc' },
        },
      },
    });
    if (!guild) return NextResponse.json({ error: 'introuvable' }, { status: 404 });
    return NextResponse.json(guild);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const data = await req.json();
    const guild = await botPrisma.guild.update({ where: { id }, data });
    return NextResponse.json(guild);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await botPrisma.guild.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
