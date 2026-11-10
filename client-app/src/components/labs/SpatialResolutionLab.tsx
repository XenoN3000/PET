import React, { useState, useMemo } from 'react';
import { 
  generatePointSourceGrid, 
  extractLineProfile, 
  calculateFwhm, 
  type ColormapType 
} from '../../utils/phantomSim';
import { PhantomCanvasViewer } from './PhantomCanvasViewer';
import { AcceptanceBadge } from './AcceptanceBadge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';
import { Activity, Sliders, Info } from 'lucide-react';

export const SpatialResolutionLab: React.FC = () => {
  const [sourceRadiusMm, setSourceRadiusMm] = useState<number>(10); // 10 mm = 1 cm
  const [smoothingSigma, setSmoothingSigma] = useState<number>(1.8); // FWHM ~ 4.2mm default
  const [noiseLevel, setNoiseLevel] = useState<number>(0.15);
  const [colormap, setColormap] = useState<ColormapType>('hot-metal');
  const [profileAxis, setProfileAxis] = useState<'horizontal' | 'vertical'>('horizontal');

  const size = 128;
  const pixelSizeMm = 0.5; // 128 * 0.5 = 64 mm FOV

  // Center point
  const centerX = size / 2;
  const centerY = size / 2;

  // Source position offset based on sourceRadiusMm
  const sourcePixelOffset = Math.round(sourceRadiusMm / pixelSizeMm);
  const sourceX = centerX;
  const sourceY = Math.min(size - 10, Math.max(10, centerY - sourcePixelOffset));

  const [crosshair, setCrosshair] = useState<{ x: number; y: number }>({ x: sourceX, y: sourceY });

  // Regenerate grid whenever params change
  const grid = useMemo(() => {
    return generatePointSourceGrid({
      size,
      sourceX,
      sourceY,
      fwhmPixels: smoothingSigma * 2.355,
      peakCounts: 4500,
      noiseLevel,
      pixelSizeMm
    });
  }, [sourceX, sourceY, smoothingSigma, noiseLevel, size, pixelSizeMm]);

  // Keep crosshair aligned if user hasn't custom moved it
  React.useEffect(() => {
    setCrosshair({ x: sourceX, y: sourceY });
  }, [sourceX, sourceY]);

  // Extract 1D profile
  const fwhmResult = useMemo(() => {
    const sliceIndex = profileAxis === 'horizontal' ? crosshair.y : crosshair.x;
    const profile = extractLineProfile(grid, profileAxis, sliceIndex, pixelSizeMm);
    return calculateFwhm(profile);
  }, [grid, profileAxis, crosshair, pixelSizeMm]);

  const targetFwhm = 4.5; // NEMA NU 2 limit in mm for 1 cm radius
  const isPass = fwhmResult.fwhmMm <= targetFwhm;

  return (
    <div className="space-y-6">
      {/* Top Description Box */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            NEMA NU 2 Spatial Resolution Workbench
          </p>
          <p className="leading-relaxed">
            Measures the scanner's point spread function (PSF). Click on the 2D reconstructed image or adjust the sliders to change radial distance, reconstruction smoothing, and statistical noise. The line profile updates dynamically to derive FWHM and FWTM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Viewer & Simulation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <PhantomCanvasViewer
            title="Point Source Phantom (2D Axial Slice)"
            grid={grid}
            colormap={colormap}
            onColormapChange={setColormap}
            crosshair={crosshair}
            onCrosshairChange={setCrosshair}
          />

          {/* Interactive Parameters Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>Acquisition & Geometry Controls</span>
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Radial Offset (NEMA specifies 1cm, 10cm, 20cm)</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{(sourceRadiusMm / 10).toFixed(1)} cm</span>
                </div>
                <div className="flex gap-2">
                  {[10, 100, 200].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSourceRadiusMm(Math.min(25, r))} // scaled for small demo FOV
                      className={`flex-1 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        sourceRadiusMm === (r === 10 ? 10 : r === 100 ? 18 : 24)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r / 10} cm
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Detector Intrinsic Blurring / Filter Width</span>
                  <span className="font-mono">{smoothingSigma} px</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.5"
                  step="0.1"
                  value={smoothingSigma}
                  onChange={(e) => setSmoothingSigma(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Statistical Noise (Poisson)</span>
                  <span className="font-mono">{(noiseLevel * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.05"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Profile Direction:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setProfileAxis('horizontal')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      profileAxis === 'horizontal' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Radial (Horiz)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileAxis('vertical')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      profileAxis === 'vertical' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Tangential (Vert)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Line Profile Plot & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Line Profile Chart Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Line Intensity Response Profile</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                Peak: {fwhmResult.peakValue} counts
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fwhmResult.profile} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis 
                    dataKey="positionMm" 
                    unit=" mm" 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    labelFormatter={(val) => `Position: ${val} mm`}
                    formatter={(val: any) => [`${val} counts`, 'Intensity']}
                  />
                  <ReferenceLine y={fwhmResult.halfMax} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Half Max (FWHM)', fill: '#10b981', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={fwhmResult.tenthMax} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Tenth Max (FWTM)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                  <Area type="monotone" dataKey="intensity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#profileGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Numerical Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Radial FWHM</p>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {fwhmResult.fwhmMm} <span className="text-xs font-normal">mm</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Full Width at Half Max</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Radial FWTM</p>
              <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
                {fwhmResult.fwhmMm ? fwhmResult.fwtmMm : 0} <span className="text-xs font-normal">mm</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Full Width at Tenth Max</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">FWTM / FWHM Ratio</p>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                {fwhmResult.fwhmMm ? (fwhmResult.fwtmMm / fwhmResult.fwhmMm).toFixed(2) : 0}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Ideal Gaussian = 1.82</p>
            </div>
          </div>

          {/* Acceptance Criteria Status Badge */}
          <AcceptanceBadge
            isPass={isPass}
            parameterName="Spatial Resolution (Radial FWHM @ 1cm)"
            currentValue={fwhmResult.fwhmMm}
            targetValue={targetFwhm}
            unit="mm"
            comparisonOperator="<="
            toleranceDescription="FWHM must be <= 4.5 mm at 1 cm radius from FOV center."
            remedialAction="Check reconstruction filter cutoff frequency, crystal identification mapping matrices, and table centering laser alignment."
          />
        </div>
      </div>
    </div>
  );
};
