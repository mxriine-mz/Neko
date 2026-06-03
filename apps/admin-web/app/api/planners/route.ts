import { NextRequest, NextResponse } from 'next/server';
import { adminPrisma } from '@/lib/adminPrisma';

export const dynamic = 'force-dynamic';

const plannerInclude = {
  columns: { orderBy: { position: 'asc' as const } },
  tasks: {
    orderBy: { position: 'asc' as const },
    include: { subtasks: { orderBy: { position: 'asc' as const } } },
  },
};

export async function GET() {
  try {
    const planners = await adminPrisma.planner.findMany({
      orderBy: { position: 'asc' },
      include: plannerInclude,
    });
    return NextResponse.json(planners);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, categories } = await req.json();
    const cats: string[] = Array.isArray(categories)
      ? categories.map((c: string) => String(c).trim()).filter(Boolean)
      : [];
    const cols = cats.length ? cats : ['À faire'];
    const count = await adminPrisma.planner.count();
    const planner = await adminPrisma.planner.create({
      data: {
        name: (name || 'Planner').trim() || 'Planner',
        position: count,
        columns: { create: cols.map((c, i) => ({ name: c, position: i })) },
      },
      include: plannerInclude,
    });
    return NextResponse.json(planner, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
