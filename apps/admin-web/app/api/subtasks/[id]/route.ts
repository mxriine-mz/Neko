import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data: { text?: string; done?: boolean } = {};
    if (typeof body.text === 'string' && body.text.trim()) data.text = body.text.trim();
    if (typeof body.done === 'boolean') data.done = body.done;
    const subtask = await adminPrisma.subtask.update({ where: { id }, data });
    return NextResponse.json(subtask);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await adminPrisma.subtask.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
