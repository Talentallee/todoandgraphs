'use client';
import type { FC } from 'react';

const ProgressBar: FC<{ value: number }> = ({ value }) => {
  const progress = Math.round(value);
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-500 ease-out bg-blue-600 dark:bg-blue-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
