export type Task = { id: number; text: string; isCompleted: boolean };
export type SubStage = { id: string; title: string; dates: string; duration: string; tasks: Task[]; result: string };
export type Stage = { id: number; title: string; description: string; duration: string; dates: string; subStages: SubStage[] };
export type StageProgress = { name: string; progress: number };
export type OverallProgress = { percent: number; completedTasks: number; totalTasks: number };
