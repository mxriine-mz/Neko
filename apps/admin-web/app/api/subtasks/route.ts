import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { taskId, text } = await req.json();
    if (!taskId) return NextResponse.json({ error: 'taskId requis' }, { status: 400 });
    if (!text || !text.trim()) return NextResponse.json({ error: 'texte requis' }, { status: 400 });
    const count = await adminPrisma.subtask.count({ where: { taskId } });
    const subtask = await adminPrisma.subtask.create({
      data: { taskId, text: text.trim(), position: count },
    });
    return NextResponse.json(subtask, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
