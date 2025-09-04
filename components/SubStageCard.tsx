'use client';
import type { FC } from 'react';
import type { SubStage } from '@/types/project';
import ProgressBar from '@/components/ProgressBar';

type Props = {
  subStage: SubStage;
  onToggleTask: (taskId: number) => void;
};

const SubStageCard: FC<Props> = ({ subStage, onToggleTask }) => {
  const completed = subStage.tasks.filter(t => t.isCompleted).length;
  const total = subStage.tasks.length;
  const subStageProgress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-md transition-colors">
      {/* Заголовок */}
      <div className="mb-3">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100">
          {subStage.id}. {subStage.title}
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span><strong className="font-medium">Даты:</strong> {subStage.dates}</span>
          <span><strong className="font-medium">Длительность:</strong> {subStage.duration}</span>
        </div>
      </div>

      {/* Прогрессбар */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Прогресс ({completed}/{total})
          </span>
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            {Math.round(subStageProgress)}%
          </span>
        </div>
        <ProgressBar value={subStageProgress} />
      </div>

      {/* Задачи */}
      <div className="space-y-2 mb-4">
        {subStage.tasks.map((task) => (
          <label
            key={task.id}
            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggleTask(task.id)}
              className="hidden"
              aria-label={task.text}
            />
            <div className="mt-0.5">
              {task.isCompleted ? (
                <span className="inline-block w-5 text-green-600 dark:text-green-400">✓</span>
              ) : (
                <span className="inline-block w-5 text-slate-400 dark:text-slate-500">○</span>
              )}
            </div>
            <span
              className={`flex-1 text-sm ${
                task.isCompleted
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {task.text}
            </span>
          </label>
        ))}
      </div>

      {/* Результат */}
      <div className="mt-4 pt-4 border-t border-dashed border-slate-300 dark:border-slate-600">
        <div className="flex items-start space-x-3">
          <span className="w-5 inline-block text-slate-500 dark:text-slate-400 mt-0.5" aria-hidden>
            🎯
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Ожидаемый результат:
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subStage.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubStageCard;
