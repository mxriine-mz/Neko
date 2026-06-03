import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { sectionId, title } = await req.json();
    if (!sectionId) return NextResponse.json({ error: 'sectionId requis' }, { status: 400 });
    const note = await adminPrisma.note.create({
      data: { sectionId, title: (title || 'Sans titre').trim() || 'Sans titre', content: '' },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
