import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SpatialResolutionLab } from '../components/labs/SpatialResolutionLab';
import { DailyUniformityLab } from '../components/labs/DailyUniformityLab';
import { apiService } from '../services/api';
import type { LabExperimentDto } from '../types/lab';
import { FlaskConical, Target, Disc3, ShieldCheck, Info } from 'lucide-react';

export const LabsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeLab, setActiveLab] = useState<'resolution' | 'uniformity'>('resolution');
  const [labs, setLabs] = useState<LabExperimentDto[]>([]);

  useEffect(() => {
    apiService.getLabs(i18n.language)
      .then(data => setLabs(data))
      .catch(err => console.warn('Could not fetch lab presets from backend, using defaults:', err));
  }, [i18n.language]);

  const currentLab = labs.find(l => 
    activeLab === 'resolution' ? l.slug === 'spatial-resolution' : l.slug === 'daily-uniformity'
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{currentLab?.subtitle || t('labs.badge')}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentLab?.title || t('labs.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLab?.description || t('labs.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{currentLab?.standard || t('labs.nemaEval')}</span>
        </div>
      </div>

      {/* Instructions Banner if available from DB */}
      {currentLab?.instructions && (
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">{currentLab.instructions}</p>
        </div>
      )}

      {/* Lab Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveLab('resolution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLab === 'resolution'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t('labs.resolutionTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLab('uniformity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLab === 'uniformity'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>{t('labs.uniformityTab')}</span>
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
