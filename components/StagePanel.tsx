'use client';
import type { FC } from 'react';
import type { Stage } from '@/types/project';
import ProgressBar from '@/components/ProgressBar';
import InfoCard from '@/components/InfoCard';
import SubStageCard from '@/components/SubStageCard';
import { ChevronDown, CheckCircle2, CheckSquare, XSquare } from 'lucide-react';

type Props = {
  stage: Stage;
  stageProgress: number;
  isActive: boolean;
  onToggle: () => void;
  onSetStageDone: (done: boolean) => void;
  onToggleTask: (subId: string, taskId: number) => void;
};

const StagePanel: FC<Props> = ({
  stage,
  stageProgress,
  isActive,
  onToggle,
  onSetStageDone,
  onToggleTask,
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-md overflow-hidden transition-colors">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none"
        aria-expanded={isActive}
        aria-controls={`stage-${stage.id}`}
      >
        <div className="flex-grow">
          <div className="flex items-center gap-3">
            <span
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                stageProgress === 100
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              }`}
            >
              {stageProgress === 100 ? (
                <CheckCircle2 size={24} aria-label="Этап завершён" />
              ) : (
                `${stage.id}`
              )}
            </span>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {stage.title}
              </h3>
              {stage.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{stage.description}</p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex-grow">
              <ProgressBar value={stageProgress} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-12 text-right">
              {stageProgress}%
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
            isActive ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Body */}
      {isActive && (
        <div
          id={`stage-${stage.id}`}
          className="bg-slate-50/70 dark:bg-slate-800 px-4 py-4 sm:px-6 sm:py-6 border-t border-slate-200 dark:border-slate-700"
        >
          {/* Controls */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSetStageDone(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-[0.99]"
              title="Отметить все задачи этапа как выполненные"
            >
              <CheckSquare className="h-4 w-4" />
              Отметить всё
            </button>
            <button
              onClick={() => onSetStageDone(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.99]"
              title="Снять все отметки выполнения на этапе"
            >
              <XSquare className="h-4 w-4" />
              Снять отметки
            </button>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <InfoCard icon={() => <span className="w-5 inline-block">📅</span>} title="Сроки этапа" value={stage.dates} />
            <InfoCard icon={() => <span className="w-5 inline-block">⏱</span>} title="Общая длительность" value={stage.duration} />
          </div>

          {/* Sub-stages */}
          <div className="space-y-6">
          {(stage.subStages ?? []).map((ss) => (
    <SubStageCard
      key={ss.id}
      subStage={ss}
      onToggleTask={(taskId) => onToggleTask(ss.id, Number(taskId))}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default StagePanel;
