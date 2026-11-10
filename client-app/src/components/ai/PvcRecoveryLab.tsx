import React, { useState, useMemo } from 'react';
import { generateRecoveryCurves } from '../../utils/aiSim';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Target, TrendingUp, Info } from 'lucide-react';

export const PvcRecoveryLab: React.FC = () => {
  const [selectedDiameter, setSelectedDiameter] = useState<number>(15); // mm
  const curveData = useMemo(() => generateRecoveryCurves(), []);

  // Compute estimated recovery for selected diameter
  const trueSuv = 8.5; // True lesion metabolic uptake
  const uncorrectedRc = Math.min(100, Math.round(100 * (1 - Math.exp(-selectedDiameter / 8.5))));
  const pvcRc = Math.min(100, Math.round(uncorrectedRc * 1.35 + (37 - selectedDiameter) * 0.4));

  const measuredSuvUncorrected = Number(((trueSuv * uncorrectedRc) / 100).toFixed(1));
  const measuredSuvPvc = Number(((trueSuv * pvcRc) / 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            Partial Volume Effect (PVE) & Contrast Recovery in Oncology
          </p>
          <p className="leading-relaxed">
            Due to finite detector resolution (~4.5 mm FWHM), radioactive activity spills out of small tumors into surrounding cooler tissue. This causes serious underestimation of tumor SUVmax in lesions smaller than 2-3 times the FWHM. Partial Volume Correction (PVC) restores true quantification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Recovery Simulation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Lesion Geometry & Uptake Simulator</span>
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Tumor Sphere Diameter</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{selectedDiameter} mm</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="35"
                  value={selectedDiameter}
                  onChange={(e) => setSelectedDiameter(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>8 mm (High PVE)</span>
                  <span>20 mm (Moderate)</span>
                  <span>35 mm (Negligible)</span>
                </div>
              </div>

              {/* SUV Metrics Table */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">True Tumor SUV:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{trueSuv}</span>
                </div>

                <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-red-700 dark:text-red-400 block">Uncorrected SUV:</span>
                    <span className="text-[10px] text-slate-400">Recovery: {uncorrectedRc}%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-lg">{measuredSuvUncorrected}</span>
                    <span className="text-[10px] text-red-500 block">(-{100 - uncorrectedRc}% error)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">PVC Corrected SUV:</span>
                    <span className="text-[10px] text-slate-400">Recovery: {pvcRc}%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">{measuredSuvPvc}</span>
                    <span className="text-[10px] text-emerald-500 block">(Restored)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recharts Recovery Coefficient Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>NEMA IEC Contrast Recovery Coefficient (CRC) Curve</span>
              </span>
              <span className="text-[11px] text-slate-400">Standard NEMA NU 2 Sec 7</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis 
                    dataKey="diameterMm" 
                    unit=" mm" 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    unit="%" 
                    domain={[0, 110]} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    labelFormatter={(val) => `Sphere Diameter: ${val} mm`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Ideal (100%)', fill: '#94a3b8', fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="uncorrectedRc" name="Uncorrected PET" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pvcCorrectedRc" name="PVC Corrected" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              The curve illustrates how contrast recovery drops below 60% for lesions under 15 mm in conventional reconstructions, while deep-learning PVC restores quantification fidelity to within ±5% of ground truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
