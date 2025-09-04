import type { Stage, StageProgress, OverallProgress } from '@/types/project';

export function calcByStage(data: Stage[]): StageProgress[] {
  return data.map((stage) => {
    const totals = stage.subStages.reduce(
      (acc, ss) => {
        acc.total += ss.tasks.length;
        acc.done += ss.tasks.filter(t => t.isCompleted).length;
        return acc;
      },
      { total: 0, done: 0 }
    );
    const progress = totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;
    return { name: `Этап ${stage.id}`, progress };
  });
}

export function calcOverall(data: Stage[]): OverallProgress {
  const { total, done } = data.reduce(
    (acc, stage) => {
      stage.subStages.forEach(ss => {
        acc.total += ss.tasks.length;
        acc.done += ss.tasks.filter(t => t.isCompleted).length;
      });
      return acc;
    },
    { total: 0, done: 0 }
  );
  const percent = total > 0 ? (done / total) * 100 : 0;
  return { percent, completedTasks: done, totalTasks: total };
}
