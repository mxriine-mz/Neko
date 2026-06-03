'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { fmtBytes, COL_COLORS } from '@/lib/utils';

export function MemoryDonut({ used, total }: { used: number; total: number }) {
  const free = Math.max(0, total - used);
  const data = [
    { name: 'Utilisée', value: used },
    { name: 'Libre', value: free },
  ];
  const pct = total ? Math.round((used / total) * 100) : 0;
  return (
    <div className="relative h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={48}
            outerRadius={66}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill="#3b82f6" />
            <Cell fill="rgba(255,255,255,0.07)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-extrabold">{pct}%</span>
        <span className="text-[11px] text-ink-3">{fmtBytes(used)}</span>
      </div>
    </div>
  );
}

export function CommandsBars({ categories }: { categories: Record<string, number> }) {
  const data = Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  if (!data.length) return <p className="text-[13px] text-ink-3">Aucune commande détectée.</p>;
  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={92}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#15151d',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: '#f4f4f5' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((_, i) => (
            <Cell key={i} fill={COL_COLORS[i % COL_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
