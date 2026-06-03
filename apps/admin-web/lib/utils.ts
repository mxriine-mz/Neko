// Helpers de formatage — utilisables côté client et serveur.

export function fmtBytes(n: number | null | undefined): string {
  if (n == null) return '—';
  const u = ['o', 'Ko', 'Mo', 'Go', 'To'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
}

export function fmtUptime(seconds: number | null | undefined): string {
  if (seconds == null) return '—';
  const s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}j ${h}h ${m}min`;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

export function fmtDate(d: string | Date | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(d: string | Date | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtRange(start?: string | null, end?: string | null): string {
  const f = (x?: string | null) =>
    x ? new Date(x).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '?';
  return start && end ? `${f(start)} – ${f(end)}` : f(start || end);
}

export function initial(s?: string | null): string {
  return (String(s || '?').trim()[0] || '?').toUpperCase();
}

// Petite palette stable pour colorer les colonnes du planner
export const COL_COLORS = [
  '#38bdf8',
  '#34d399',
  '#f59e0b',
  '#f472b6',
  '#a78bfa',
  '#fb7185',
  '#22d3ee',
  '#facc15',
];

export function colColor(index: number): string {
  return COL_COLORS[Math.max(0, index) % COL_COLORS.length];
}
