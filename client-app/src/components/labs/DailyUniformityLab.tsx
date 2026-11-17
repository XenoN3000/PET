import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  generateUniformCylinderGrid, 
  calculateUniformity, 
  type ColormapType 
} from '../../utils/phantomSim';
import { PhantomCanvasViewer } from './PhantomCanvasViewer';
import { AcceptanceBadge } from './AcceptanceBadge';
import { Sliders, Info, AlertTriangle, Percent } from 'lucide-react';

export const DailyUniformityLab: React.FC = () => {
  const { t } = useTranslation();
  const baseCounts = 3200;
  const [noiseLevel, setNoiseLevel] = useState<number>(0.12);
  const [hasDefect, setHasDefect] = useState<boolean>(false);
  const [defectDrop, setDefectDrop] = useState<number>(35); // 35% drop
  const [colormap, setColormap] = useState<ColormapType>('hot-metal');
  
  const size = 128;
  const cylinderRadius = 45; // 45px radius in 128x128
  const centerX = size / 2;
  const centerY = size / 2;

  // ROI sampling circle (NEMA specifies covering central 75% of cylinder)
  const [roiCircle, setRoiCircle] = useState<{ x: number; y: number; radius: number }>({
    x: centerX,
    y: centerY,
    radius: Math.round(cylinderRadius * 0.75) // ~34px
  });

  const grid = useMemo(() => {
    return generateUniformCylinderGrid({
      size,
      radiusPixels: cylinderRadius,
      baseCounts,
      noiseLevel,
      hasDefect,
      defectLocation: {
        x: centerX + 12,
        y: centerY - 10,
        radius: 12,
        dropPercent: defectDrop
      }
    });
  }, [baseCounts, noiseLevel, hasDefect, defectDrop, size, cylinderRadius, centerX, centerY]);

  // Compute uniformity metrics inside ROI
  const uniformity = useMemo(() => {
    return calculateUniformity(grid, roiCircle.x, roiCircle.y, roiCircle.radius);
  }, [grid, roiCircle]);

  const targetIu = 5.0; // IAEA / NEMA daily tolerance <= 5%
  const isPassIu = uniformity.integralUniformityPercent <= targetIu;

  const targetDu = 3.5; // DU tolerance <= 3.5%
  const isPassDu = uniformity.differentialUniformityPercent <= targetDu;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            {t('uniformityLab.title')}
          </p>
          <p className="leading-relaxed">
            {t('uniformityLab.desc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Viewer & ROI controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <PhantomCanvasViewer
            title={t('uniformityLab.sliceTitle')}
            grid={grid}
            colormap={colormap}
            onColormapChange={setColormap}
            roiCircle={roiCircle}
            onRoiChange={setRoiCircle}
          />

          {/* Controls Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('uniformityLab.controlsTitle')}</span>
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{t('uniformityLab.roiRadius')}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{roiCircle.radius} px ({((roiCircle.radius / cylinderRadius) * 100).toFixed(0)}% dia)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max={cylinderRadius - 2}
                  value={roiCircle.radius}
                  onChange={(e) => setRoiCircle({ ...roiCircle, radius: Number(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{t('uniformityLab.noiseCounts')}</span>
                  <span className="font-mono">{(noiseLevel * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Defect Injection Simulation */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="defectToggle"
                      checked={hasDefect}
                      onChange={(e) => setHasDefect(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="defectToggle" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('uniformityLab.simulateDefect')}</span>
                    </label>
                  </div>
                  {hasDefect && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 uppercase">
                      {t('uniformityLab.defectActive')}
                    </span>
                  )}
                </div>

                {hasDefect && (
                  <div className="pt-1 pl-6">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>{t('uniformityLab.defectSeverity')}</span>
                      <span className="font-mono text-red-600">-{defectDrop}%</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      step="5"
                      value={defectDrop}
                      onChange={(e) => setDefectDrop(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t('uniformityLab.defectHint')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Analysis & Acceptance Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Formula Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-500" />
              <span>{t('uniformityLab.formulaTitle')}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] space-y-1">
                <span className="text-slate-400 block font-sans text-[10px] uppercase font-bold">{t('labs.iu')}</span>
                <p className="text-blue-600 dark:text-blue-400 font-bold">
                  IU = 100 × (Max - Min) / (Max + Min)
                </p>
                <p className="text-slate-500 font-sans text-[10px]">{t('uniformityLab.iuFormulaDesc')}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] space-y-1">
                <span className="text-slate-400 block font-sans text-[10px] uppercase font-bold">{t('labs.du')}</span>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  DU = Max Local Change (5-pixel blocks)
                </p>
                <p className="text-slate-500 font-sans text-[10px]">{t('uniformityLab.duFormulaDesc')}</p>
              </div>
            </div>
          </div>

          {/* Statistical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('labs.iu')}</p>
              <p className={`text-2xl font-bold font-mono mt-1 ${
                isPassIu ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {uniformity.integralUniformityPercent}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t('uniformityLab.limitIu')}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('labs.du')}</p>
              <p className={`text-2xl font-bold font-mono mt-1 ${
                isPassDu ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {uniformity.differentialUniformityPercent}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t('uniformityLab.limitDu')}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('uniformityLab.meanCounts')}</p>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                {uniformity.mean}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Std: ±{uniformity.stdDev}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('uniformityLab.maxMinCounts')}</p>
              <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-2">
                {uniformity.max} / {uniformity.min}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">{t('uniformityLab.pixels', { count: uniformity.totalPixels })}</p>
            </div>
          </div>

          {/* Acceptance Badges */}
          <div className="space-y-3">
            <AcceptanceBadge
              isPass={isPassIu}
              parameterName={t('uniformityLab.dailyIuParam')}
              currentValue={uniformity.integralUniformityPercent}
              targetValue={targetIu}
              unit="%"
              comparisonOperator="<="
              toleranceDescription={t('uniformityLab.dailyIuTolerance')}
              remedialAction={t('uniformityLab.dailyIuRemedy')}
            />

            <AcceptanceBadge
              isPass={isPassDu}
              parameterName={t('uniformityLab.dailyDuParam')}
              currentValue={uniformity.differentialUniformityPercent}
              targetValue={targetDu}
              unit="%"
              comparisonOperator="<="
              toleranceDescription={t('uniformityLab.dailyDuTolerance')}
              remedialAction={t('uniformityLab.dailyDuRemedy')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
