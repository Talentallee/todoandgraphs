'use client';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type D = { name: string; progress: number };

type ChartColors = {
  grid: string;
  axis: string;
  bar: string;
  tooltipBg: string;
  tooltipText: string;
  tooltipBorder: string;
};

// читаем CSS-переменные и понимаем, тёмная тема или нет
function readColors(): ChartColors {
  if (typeof window === 'undefined') {
    return {
      grid: '#e2e8f0',
      axis: '#64748b',
      bar: '#2563eb',
      tooltipBg: '#ffffff',
      tooltipText: '#0f172a',
      tooltipBorder: '#e2e8f0',
    };
  }
  const cs = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.classList.contains('dark');
  return {
    grid: cs.getPropertyValue('--chart-grid').trim() || (isDark ? '#334155' : '#e2e8f0'),
    axis: cs.getPropertyValue('--chart-axis').trim() || (isDark ? '#94a3b8' : '#64748b'),
    bar:  cs.getPropertyValue('--chart-bar').trim()  || (isDark ? '#60a5fa' : '#2563eb'),
    tooltipBg: isDark ? '#1e293b' : '#ffffff',      // slate-800 / white
    tooltipText: isDark ? '#f1f5f9' : '#0f172a',     // slate-100 / slate-900
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',   // slate-700 / slate-200
  };
}

export default function StageChart({ data }: { data: D[] }) {
  const [colors, setColors] = useState<ChartColors>(() => readColors());

  // обновляем цвета при смене темы (переключение класса .dark на <html>)
  useEffect(() => {
    setColors(readColors()); // на маунт

    const root = document.documentElement;
    const mo = new MutationObserver(() => setColors(readColors()));
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: colors.tooltipBg,
      color: colors.tooltipText,
      border: `1px solid ${colors.tooltipBorder}`,
      borderRadius: '0.5rem',
    }),
    [colors],
  );

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" tick={{ fill: colors.axis, fontSize: 12 }} />
          <YAxis tick={{ fill: colors.axis, fontSize: 12 }} unit="%" />
          <Tooltip
            cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }} // slate-400 @ 12%
            contentStyle={tooltipStyle}
          />
          <Bar dataKey="progress" fill={colors.bar} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
