import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { plannerId, name } = await req.json();
    if (!plannerId) return NextResponse.json({ error: 'plannerId requis' }, { status: 400 });
    if (!name || !name.trim()) return NextResponse.json({ error: 'nom requis' }, { status: 400 });
    const count = await adminPrisma.boardColumn.count({ where: { plannerId } });
    const column = await adminPrisma.boardColumn.create({
      data: { plannerId, name: name.trim(), position: count },
    });
    return NextResponse.json(column, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
