// Migration ponctuelle : web-viewer/data/{notes,planners}.json -> neko_admin (Prisma).
// Idempotent : ne fait rien si la base admin contient déjà des données.
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../lib/generated/admin/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../web-viewer/data');
const prisma = new PrismaClient();

const read = (f) => {
  try {
    return JSON.parse(readFileSync(path.join(dataDir, f), 'utf8'));
  } catch {
    return null;
  }
};

async function main() {
  const existing = (await prisma.section.count()) + (await prisma.planner.count());
  if (existing > 0) {
    console.log('Base admin déjà peuplée — migration ignorée.');
    return;
  }

  // ── Notes ──
  const notes = read('notes.json');
  let nSec = 0,
    nNote = 0;
  for (const [i, s] of (notes?.sections ?? []).entries()) {
    const section = await prisma.section.create({ data: { name: s.name || 'Sans titre', position: i } });
    nSec++;
    for (const [j, n] of (s.notes ?? []).entries()) {
      await prisma.note.create({
        data: {
          sectionId: section.id,
          title: n.title || 'Sans titre',
          content: n.content || '',
          position: j,
        },
      });
      nNote++;
    }
  }

  // ── Planners ──
  const planners = read('planners.json');
  let nPlan = 0,
    nCol = 0,
    nTask = 0,
    nSub = 0;
  for (const [i, p] of (planners?.planners ?? []).entries()) {
    const planner = await prisma.planner.create({ data: { name: p.name || 'Planner', position: i } });
    nPlan++;
    const colMap = {};
    for (const [j, c] of (p.columns ?? []).entries()) {
      const col = await prisma.boardColumn.create({ data: { plannerId: planner.id, name: c.name || 'Colonne', position: j } });
      colMap[c.id] = col.id;
      nCol++;
    }
    for (const [j, t] of (p.tasks ?? []).entries()) {
      const columnId = colMap[t.columnId] || Object.values(colMap)[0];
      if (!columnId) continue;
      const task = await prisma.task.create({
        data: {
          plannerId: planner.id,
          columnId,
          title: t.title || 'Sans titre',
          description: t.description || '',
          assignee: t.assignee || null,
          tags: Array.isArray(t.tags) ? t.tags : [],
          start: t.start || null,
          end: t.end || null,
          position: j,
        },
      });
      nTask++;
      for (const [k, sub] of (t.subtasks ?? []).entries()) {
        await prisma.subtask.create({ data: { taskId: task.id, text: sub.text || '', done: !!sub.done, position: k } });
        nSub++;
      }
    }
  }

  console.log(`Migré : ${nSec} sections, ${nNote} notes | ${nPlan} planners, ${nCol} colonnes, ${nTask} tâches, ${nSub} sous-tâches.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
