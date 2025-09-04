'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Stage } from '@/types/project';

const LS_KEY = 'timeline:progress:v1';

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function normalize(stages: Stage[] | null | undefined): Stage[] {
  if (!Array.isArray(stages)) return [];
  return stages.map((s) => ({
    ...s,
    substages: (s.substages ?? []).map((sub) => ({
      ...sub,
      tasks: (sub.tasks ?? []).map((t) => ({ ...t, isCompleted: Boolean(t.isCompleted) })),
    })),
  }));
}

export function useProjectData(initialData: Stage[]) {
  const [data, setData] = useState<Stage[]>(normalize(initialData));
  const [activeStageId, setActiveStageId] = useState<number | null>(null);

  // -------- первичная инициализация: KV -> LS -> initial
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    (async () => {
      try {
        const server = await jsonFetch<{ data: Stage[] | null }>('/api/progress');
        const normalized = normalize(server?.data);
        if (normalized.length) {
          setData(normalized);
          localStorage.setItem(LS_KEY, JSON.stringify(normalized));
          return;
        }
      } catch {}
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Stage[];
          setData(normalize(parsed));
          return;
        }
      } catch {}
      setData(normalize(initialData));
    })();
  }, [initialData]);

  // -------- отправка на сервер (debounce)
  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pushServer = useCallback((next: Stage[]) => {
    if (saveDebounce.current) clearTimeout(saveDebounce.current);
    saveDebounce.current = setTimeout(() => {
      jsonFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ data: next, version: '1' }),
      }).catch(() => {});
    }, 350);
  }, []);

  // -------- единая безопасная функция обновления
  const update = useCallback(
    (updater: (prev: Stage[]) => Stage[]) => {
      setData((prev) => {
        const next = normalize(updater(prev));
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(next));
        } catch {}
        pushServer(next);
        return next;
      });
    },
    [pushServer],
  );

  // -------- мутации (через functional setState)
  const toggleTask = useCallback(
    (stageId: number, subId: number, taskId: number) => {
      update((prev) =>
        prev.map((s) =>
          s.id !== stageId
            ? s
            : {
                ...s,
                substages: (s.substages ?? []).map((sub) =>
                  sub.id !== subId
                    ? sub
                    : {
                        ...sub,
                        tasks: (sub.tasks ?? []).map((t) =>
                          t.id !== taskId ? t : { ...t, isCompleted: !t.isCompleted },
                        ),
                      },
                ),
              },
        ),
      );
    },
    [update],
  );

  const setStageDone = useCallback(
    (stageId: number, done: boolean) => {
      update((prev) =>
        prev.map((s) =>
          s.id !== stageId
            ? s
            : {
                ...s,
                done,
                substages: (s.substages ?? []).map((sub) => ({
                  ...sub,
                  tasks: (sub.tasks ?? []).map((t) => ({ ...t, isCompleted: done })),
                })),
              },
        ),
      );
    },
    [update],
  );

  const resetAll = useCallback(() => {
    update((prev) =>
      prev.map((s) => ({
        ...s,
        done: false,
        substages: (s.substages ?? []).map((sub) => ({
          ...sub,
          tasks: (sub.tasks ?? []).map((t) => ({ ...t, isCompleted: false })),
        })),
      })),
    );
  }, [update]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importJSON = useCallback(
    async (file: File) => {
      const text = await file.text();
      const parsed = JSON.parse(text) as Stage[];
      const normalized = normalize(parsed);
      if (!normalized.length) throw new Error('Неверный формат файла');
      // через update, чтобы всё сохранилось и синхронизировалось
      update(() => normalized);
    },
    [update],
  );

  return useMemo(
    () => ({
      data,
      activeStageId,
      setActiveStageId,
      toggleTask,
      setStageDone,
      resetAll,
      exportJSON,
      importJSON,
    }),
    [data, activeStageId, toggleTask, setStageDone, resetAll, exportJSON, importJSON],
  );
}
