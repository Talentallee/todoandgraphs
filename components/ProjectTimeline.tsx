'use client';

import dynamic from 'next/dynamic';
import ProgressBar from '@/components/ProgressBar';
import StagePanel from '@/components/StagePanel';
import { useProjectData } from '@/hooks/useProjectData';
import { calcByStage, calcOverall } from '@/lib/progress';
import type { Stage } from '@/types/project';
import { RefreshCcw, Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const StageChart = dynamic(() => import('@/components/StageChart'), { ssr: false });

export default function ProjectTimeline({ initialData }: { initialData: Stage[] }) {
  const {
    data,
    activeStageId,
    setActiveStageId,
    toggleTask,
    setStageDone,
    resetAll,
    exportJSON,
    importJSON,
  } = useProjectData(initialData);

  const stageProgress = calcByStage(data);
  const overall = calcOverall(data);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const onImportClick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await importJSON(f);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Не удалось импортировать файл';
      setImportError(msg);
    } finally {
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Хедер */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Комплексный план-график разработки веб-сервиса
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Ваш основной документ для отслеживания прогресса.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Сбросить */}
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                       bg-slate-700 text-white hover:bg-slate-600
                       dark:bg-slate-600 dark:hover:bg-slate-500
                       focus:outline-none shadow-md"
            title="Сбросить прогресс по всем этапам"
          >
            <RefreshCcw className="h-4 w-4" />
            Сбросить
          </button>

          {/* Экспорт */}
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                       bg-blue-600 text-white hover:bg-blue-500
                       dark:bg-blue-500 dark:hover:bg-blue-400
                       focus:outline-none shadow-md"
            title="Экспортировать прогресс в JSON"
          >
            <Download className="h-4 w-4" />
            Экспорт
          </button>

          {/* Импорт */}
          <button
            onClick={onImportClick}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                       bg-emerald-600 text-white hover:bg-emerald-500
                       dark:bg-emerald-500 dark:hover:bg-emerald-400
                       focus:outline-none shadow-md"
            title="Импортировать прогресс из JSON"
          >
            <Upload className="h-4 w-4" />
            Импорт
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      </header>

      {/* Ошибка импорта */}
      {importError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {importError}
        </div>
      )}

      {/* Карточка общего прогресса + график */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Общий прогресс проекта
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-slate-600 dark:text-slate-300">Выполнено</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(overall.percent)}%
              </span>
            </div>
            <ProgressBar value={overall.percent} />
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
              {overall.completedTasks} из {overall.totalTasks} задач выполнено
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-2">
            <StageChart data={stageProgress} />
          </div>
        </div>
      </div>

      {/* Этапы */}
      <div className="space-y-4">
        {data.map((stage) => {
          const isActive = activeStageId === stage.id;
          const currentStageProgress =
            stageProgress.find((p) => p.name === `Этап ${stage.id}`)?.progress || 0;

          return (
            <StagePanel
  key={stage.id}
  stage={stage}
  stageProgress={currentStageProgress}
  isActive={isActive}
  onToggle={() => setActiveStageId(isActive ? null : stage.id)}
  onSetStageDone={(done) => setStageDone(stage.id, done)}
  onToggleTask={(subId, taskId) =>
    toggleTask(stage.id, subId, Number(taskId))  // ← важное приведение типов
  }
/>
          );
        })}
      </div>
    </div>
  );
}
