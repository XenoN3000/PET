import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  phase: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, description, phase }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        <Construction className="w-8 h-8" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 mb-2">
        {phase}
      </span>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-6">
        {description}
      </p>
    </div>
  );
};
