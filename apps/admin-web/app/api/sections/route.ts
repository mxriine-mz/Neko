import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sections = await adminPrisma.section.findMany({
      orderBy: { position: 'asc' },
      include: { notes: { orderBy: { updatedAt: 'desc' } } },
    });
    return NextResponse.json(sections);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const count = await adminPrisma.section.count();
    const section = await adminPrisma.section.create({
      data: { name: (name || 'Nouvelle section').trim() || 'Sans titre', position: count },
      include: { notes: true },
    });
    return NextResponse.json(section, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
