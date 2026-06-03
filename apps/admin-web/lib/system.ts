import os from 'os';
import fs from 'fs';
import path from 'path';
import { botPrisma } from './botPrisma';

// Racine du dépôt Neko (l'app vit dans apps/admin-web → remonter de 2 niveaux)
const REPO_ROOT = path.resolve(process.cwd(), '../..');

// Compte les commandes du bot (fichiers .js sous src/Commands)
export function countCommands() {
  const root = path.join(REPO_ROOT, 'src/Commands');
  const categories: Record<string, number> = {};
  let total = 0;
  const walk = (dir: string, cat: string | null) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(dir, e.name), cat || e.name);
      else if (e.name.endsWith('.js')) {
        total++;
        if (cat) categories[cat] = (categories[cat] || 0) + 1;
      }
    }
  };
  walk(root, null);
  return { total, categories };
}

// Sauvegardes présentes dans backups/
export function readBackups() {
  const dir = path.join(REPO_ROOT, 'backups');
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => {
      const st = fs.statSync(path.join(dir, e.name));
      return { name: e.name, size: st.size, mtime: st.mtime };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return {
    count: files.length,
    totalSize: files.reduce((a, f) => a + f.size, 0),
    last: files[0] || null,
  };
}

// Latence + taille de la base du bot
export async function dbMetrics() {
  let latencyMs: number | null = null;
  let sizeBytes: number | null = null;
  try {
    const t = Date.now();
    await botPrisma.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - t;
    const r = await botPrisma.$queryRaw<{ bytes: bigint }[]>`
      SELECT pg_database_size(current_database()) AS bytes`;
    sizeBytes = Number(r[0].bytes);
  } catch {
    /* base indisponible */
  }
  return { latencyMs, sizeBytes };
}

export async function systemSnapshot() {
  const db = await dbMetrics();
  return {
    now: new Date().toISOString(),
    node: process.version,
    platform: `${os.type()} ${os.release()}`,
    hostname: os.hostname(),
    uptimeSystem: os.uptime(),
    uptimeProcess: process.uptime(),
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0]?.model || '—',
      load1: os.loadavg()[0],
    },
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      process: process.memoryUsage().rss,
    },
    db,
    commands: countCommands(),
    backups: readBackups(),
  };
}
