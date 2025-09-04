'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  // ждём маунта, чтобы не было SSR/CSR расхождения
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // до маунта показываем нейтральную метку
  const label = mounted ? (theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая') : '…';

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        onClick={toggle}
        className="rounded-xl border border-slate-300 bg-white/80 px-3 py-1.5 text-sm text-slate-700 shadow-sm backdrop-blur hover:bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
        title="Переключить тему"
      >
        {/* игнорируем возможное несовпадение текста до маунта */}
        <span suppressHydrationWarning>{label}</span>
      </button>
    </div>
  );
}
