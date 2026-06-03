import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.plannerId || !b.columnId)
      return NextResponse.json({ error: 'plannerId et columnId requis' }, { status: 400 });
    const count = await adminPrisma.task.count({ where: { columnId: b.columnId } });
    const task = await adminPrisma.task.create({
      data: {
        plannerId: b.plannerId,
        columnId: b.columnId,
        title: (b.title || 'Sans titre').trim() || 'Sans titre',
        description: b.description || '',
        assignee: b.assignee || null,
        tags: Array.isArray(b.tags) ? b.tags : [],
        start: b.start || null,
        end: b.end || null,
        position: count,
      },
      include: { subtasks: true },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
