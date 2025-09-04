'use client';
import type { FC } from 'react';

const InfoCard: FC<{ icon: React.ElementType; title: string; value: string }> = ({
  icon: Icon,
  title,
  value,
}) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{title}</p>
      <p className="font-medium text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

export default InfoCard;
