'use client';
import { useEffect, useState } from 'react';
import type { Stage } from '@/types/project';

const LS_KEY = 'project_timeline_data_v1';

export function useProjectData(initial: Stage[]) {
  const [data, setData] = useState<Stage[]>(initial);
  const [activeStageId, setActiveStageId] = useState<number | null>(0);

  // загрузка из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed: Stage[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((s) => 'subStages' in s)) {
          setData(parsed);
        }
      }
    } catch {}
  }, []);

  // сохранение в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const toggleTask = (stageId: number, subId: string, taskId: number) => {
    setData((prev) =>
      prev.map((stage) =>
        stage.id !== stageId
          ? stage
          : {
              ...stage,
              subStages: stage.subStages.map((ss) =>
                ss.id !== subId
                  ? ss
                  : {
                      ...ss,
                      tasks: ss.tasks.map((t) =>
                        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t,
                      ),
                    },
              ),
            },
      ),
    );
  };

  const setStageDone = (stageId: number, done: boolean) => {
    setData((prev) =>
      prev.map((stage) =>
        stage.id !== stageId
          ? stage
          : {
              ...stage,
              subStages: stage.subStages.map((ss) => ({
                ...ss,
                tasks: ss.tasks.map((t) => ({ ...t, isCompleted: done })),
              })),
            },
      ),
    );
  };

  const resetAll = () => {
    setData((prev) =>
      prev.map((stage) => ({
        ...stage,
        subStages: stage.subStages.map((ss) => ({
          ...ss,
          tasks: ss.tasks.map((t) => ({ ...t, isCompleted: false })),
        })),
      })),
    );
  };

  // ➕ экспорт/импорт
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `project-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    // минимальная проверка структуры
    const ok =
      Array.isArray(parsed) &&
      parsed.every(
        (s) =>
          typeof s.id === 'number' &&
          Array.isArray(s.subStages) &&
          s.subStages.every(
            (ss: any) =>
              typeof ss.id === 'string' &&
              Array.isArray(ss.tasks) &&
              ss.tasks.every(
                (t: any) =>
                  typeof t.id === 'number' &&
                  typeof t.text === 'string' &&
                  typeof t.isCompleted === 'boolean',
              ),
          ),
      );
    if (!ok) throw new Error('Неверный формат файла JSON');
    setData(parsed);
  };

  return {
    data,
    activeStageId,
    setActiveStageId,
    toggleTask,
    setStageDone,
    resetAll,
    exportJSON,
    importJSON,
  };
}
