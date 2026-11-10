import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AiMetricsCardProps {
  lowDosePsnr: number;
  aiPsnr: number;
  lowDoseSsim: number;
  aiSsim: number;
  lowDoseDice: number;
  aiDice: number;
}

export const AiMetricsCard: React.FC<AiMetricsCardProps> = ({
  lowDosePsnr,
  aiPsnr,
  lowDoseSsim,
  aiSsim,
  lowDoseDice,
  aiDice
}) => {
  const psnrGain = Number((aiPsnr - lowDosePsnr).toFixed(1));
  const ssimGain = Number(((aiSsim - lowDoseSsim) * 100).toFixed(1));
  const diceGain = Number(((aiDice - lowDoseDice) * 100).toFixed(1));

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PSNR */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Peak SNR (PSNR)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{psnrGain} dB
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{aiPsnr} dB</span>
            <span className="text-xs text-slate-400 line-through">{lowDosePsnr} dB</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Standard: &gt; 30 dB indicates high fidelity noise suppression without artifact creation.
          </p>
        </div>

        {/* SSIM */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Structural Similarity (SSIM)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{ssimGain}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400">{aiSsim}</span>
            <span className="text-xs text-slate-400 line-through">{lowDoseSsim}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Measures preservation of anatomical boundaries, organ shapes, and lesion borders.
          </p>
        </div>

        {/* Dice Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dice Similarity (DSC)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{diceGain}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">{aiDice}</span>
            <span className="text-xs text-slate-400 line-through">{lowDoseDice}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Overlap coefficient of metabolic tumor volume (&gt;0.85 indicates excellent lesion detectability).
          </p>
        </div>
      </div>

      {/* Clinical Guidance Note */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white block">
            Clinical Quantitative Validation (Abdelrahman et al. / IAEA)
          </span>
          <p className="leading-relaxed">
            In low-dose oncology imaging, simple Gaussian post-smoothing improves SNR but suppresses critical small metastatic foci. The deep learning U-Net architecture trained with perceptual loss preserves fine structural edges while reducing radiation dose by up to 75%.
          </p>
        </div>
      </div>
    </div>
  );
};
