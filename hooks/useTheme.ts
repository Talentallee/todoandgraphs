'use client';
import { useEffect, useState } from 'react';

const KEY = 'theme_v1';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(KEY) as 'light' | 'dark' | null;
    if (saved) return saved;
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefers ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement; // <html>
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
}
