import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (typeof b.title === 'string') data.title = b.title.trim() || 'Sans titre';
    if (typeof b.description === 'string') data.description = b.description;
    if (typeof b.columnId === 'string') data.columnId = b.columnId;
    if ('assignee' in b) data.assignee = b.assignee || null;
    if (Array.isArray(b.tags)) data.tags = b.tags;
    if ('start' in b) data.start = b.start || null;
    if ('end' in b) data.end = b.end || null;
    if (typeof b.position === 'number') data.position = b.position;
    const task = await adminPrisma.task.update({
      where: { id },
      data,
      include: { subtasks: { orderBy: { position: 'asc' } } },
    });
    return NextResponse.json(task);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await adminPrisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
