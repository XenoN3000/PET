import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  generateAiSimulationSlices, 
  calculatePsnr, 
  calculateSsim, 
  calculateDice,
  type AiDoseImages 
} from '../utils/aiSim';
import { type ColormapType } from '../utils/phantomSim';
import { DoseComparisonSlider } from '../components/ai/DoseComparisonSlider';
import { PvcRecoveryLab } from '../components/ai/PvcRecoveryLab';
import { AiMetricsCard } from '../components/ai/AiMetricsCard';
import { apiService } from '../services/api';
import type { AiScenarioDto } from '../types/ai';
import { Cpu, Target, Network, Sparkles, BookOpen, Info } from 'lucide-react';

export const AiModernPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'denoising' | 'pvc' | 'architecture'>('denoising');
  const [colormap, setColormap] = useState<ColormapType>('hot-metal');
  const [scenarios, setScenarios] = useState<AiScenarioDto[]>([]);

  useEffect(() => {
    apiService.getAiScenarios(i18n.language)
      .then(data => setScenarios(data))
      .catch(err => console.warn('Could not fetch AI scenarios, using local defaults:', err));
  }, [i18n.language]);

  const activeScenario = scenarios.find(s => 
    activeTab === 'pvc' ? s.code === 'PVC-RECOVERY' : s.code === 'LOW-DOSE-DENOISING'
  );

  const lesionDiameterMm = activeScenario?.defaultLesionDiameterMm || 15;
  const doseFactor = activeScenario?.defaultDoseReductionFactor || 4;

  const slices: AiDoseImages = useMemo(() => {
    return generateAiSimulationSlices(128, doseFactor, lesionDiameterMm);
  }, [doseFactor, lesionDiameterMm]);

  // Compute metrics
  const metrics = useMemo(() => {
    const lowDosePsnr = calculatePsnr(slices.standardDose, slices.lowDose);
    const aiPsnr = calculatePsnr(slices.standardDose, slices.aiRestored);

    const lowDoseSsim = calculateSsim(slices.standardDose, slices.lowDose);
    const aiSsim = calculateSsim(slices.standardDose, slices.aiRestored);

    const lowDoseDice = calculateDice(slices.standardDose, slices.lowDose, 2200);
    const aiDice = calculateDice(slices.standardDose, slices.aiRestored, 2200);

    return {
      lowDosePsnr,
      aiPsnr,
      lowDoseSsim,
      aiSsim,
      lowDoseDice,
      aiDice
    };
  }, [slices]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>{activeScenario?.title || t('ai.badge')}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeScenario?.title || t('ai.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeScenario?.clinicalContext || t('ai.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('ai.validation')}</span>
        </div>
      </div>

      {/* Methodology Description from DB */}
      {activeScenario?.methodologyDescription && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="leading-relaxed">{activeScenario.methodologyDescription}</p>
            {activeScenario.expectedOutcome && (
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
                {activeScenario.expectedOutcome}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('denoising')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'denoising'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{t('ai.lowDoseUnetTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pvc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pvc'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t('ai.pvcTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>{t('ai.archTab')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'denoising' && (
          <div className="space-y-6">
            <DoseComparisonSlider
              slices={slices}
              colormap={colormap}
              onColormapChange={setColormap}
            />

            <AiMetricsCard
              lowDosePsnr={metrics.lowDosePsnr}
              aiPsnr={metrics.aiPsnr}
              lowDoseSsim={metrics.lowDoseSsim}
              aiSsim={metrics.aiSsim}
              lowDoseDice={metrics.lowDoseDice}
              aiDice={metrics.aiDice}
            />
          </div>
        )}

        {activeTab === 'pvc' && (
          <PvcRecoveryLab />
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {t('ai.archTitle')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('ai.archSubtitle')}
                  </p>
                </div>
              </div>

              {/* ASCII Diagram of U-Net */}
              <div className="p-5 rounded-2xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed ltr" dir="ltr">
                <pre>{`
  [ Input Low-Dose Slice ]                                        [ Restored High-Quality Slice ]
             |                                                                   ^
             v                                                                   |
      +--------------+      Skip Connection (Edge Detail)                +---------------+
      | Conv 3x3, 64 | ================================================> | Conv 3x3, 64  |
      +--------------+                                                   +---------------+
             | MaxPool 2x2                                                       ^ UpConv 2x2
             v                                                                   |
      +--------------+      Skip Connection (Organ Geometry)             +---------------+
      | Conv 3x3, 128| ================================================> | Conv 3x3, 128 |
      +--------------+                                                   +---------------+
             | MaxPool 2x2                                                       ^ UpConv 2x2
             v                                                                   |
      +--------------+      Skip Connection (Contrast Level)             +---------------+
      | Conv 3x3, 256| ================================================> | Conv 3x3, 256 |
      +--------------+                                                   +---------------+
             | MaxPool 2x2                                                       ^ UpConv 2x2
             v                                                                   |
                      +---------------------------------------+
                      | Bottleneck Latent Space: Conv 3x3 512 |
                      +---------------------------------------+
                `}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{t('ai.skipConnTitle')}</span>
                  </h4>
                  <p className="leading-relaxed text-[11px]">
                    {t('ai.skipConnDesc')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span>{t('ai.perceptualTitle')}</span>
                  </h4>
                  <p className="leading-relaxed text-[11px]">
                    {t('ai.perceptualDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
