import React, { useState } from 'react';
import { SpatialResolutionLab } from '../components/labs/SpatialResolutionLab';
import { DailyUniformityLab } from '../components/labs/DailyUniformityLab';
import { FlaskConical, Target, Disc3, ShieldCheck } from 'lucide-react';

export const LabsPage: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'resolution' | 'uniformity'>('resolution');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Interactive QC Simulation Workbenches</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hands-on Quality Control Labs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive phantom acquisition, profile analysis, and real-time pass/fail tolerance validation
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Real-time IAEA & NEMA Evaluation</span>
        </div>
      </div>

      {/* Lab Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveLab('resolution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLab === 'resolution'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Spatial Resolution (FWHM) Lab</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLab('uniformity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLab === 'uniformity'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>Daily Uniformity (IU & DU) Lab</span>
        </button>
      </div>

      {/* Active Lab Content */}
      <div className="pt-2">
        {activeLab === 'resolution' ? (
          <SpatialResolutionLab />
        ) : (
          <DailyUniformityLab />
        )}
      </div>
    </div>
  );
};
