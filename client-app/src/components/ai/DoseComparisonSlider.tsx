import React, { useRef, useEffect, useState } from 'react';
import { type AiDoseImages } from '../../utils/aiSim';
import { getColormapRgb, type ColormapType } from '../../utils/phantomSim';
import { Columns, SplitSquareVertical } from 'lucide-react';

interface DoseComparisonSliderProps {
  slices: AiDoseImages;
  colormap: ColormapType;
  onColormapChange: (colormap: ColormapType) => void;
}

export const DoseComparisonSlider: React.FC<DoseComparisonSliderProps> = ({
  slices,
  colormap,
  onColormapChange
}) => {
  const [splitPos, setSplitPos] = useState<number>(50); // 0 to 100%
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = slices.standardDose.length || 128;

  // Render Split Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'split') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const splitCol = Math.round((splitPos / 100) * size);

    let maxVal = 4500;
    let minVal = 0;

    let p = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Left of split: Low-Dose; Right of split: AI-Restored
        const raw = x < splitCol
          ? slices.lowDose[y][x]
          : slices.aiRestored[y][x];

        const normalized = Math.max(0, Math.min(1, (raw - minVal) / (maxVal - minVal)));
        const [r, g, b] = getColormapRgb(normalized, colormap);

        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
        data[p + 3] = 255;
        p += 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw Split Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitCol, 0);
    ctx.lineTo(splitCol, size);
    ctx.stroke();

  }, [slices, colormap, splitPos, viewMode, size]);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const pos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(Math.round(pos));
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Clinical Dose & AI Enhancement Comparison</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare 25% dose scan vs. deep learning restored reconstruction
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode switch */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {/* Colormap toggle */}
          <div className="hidden sm:flex items-center gap-1">
            {(['hot-metal', 'rainbow', 'grayscale'] as ColormapType[]).map((cm) => (
              <button
                key={cm}
                type="button"
                onClick={() => onColormapChange(cm)}
                className={`px-2 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  colormap === cm
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cm === 'hot-metal' ? 'Hot' : cm}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'split' ? (
        <div className="space-y-3">
          <div
            className="relative flex justify-center items-center bg-black rounded-2xl p-2 overflow-hidden aspect-square max-w-[360px] mx-auto border border-slate-800 cursor-ew-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handlePointerMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handlePointerMove}
          >
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="w-full h-full object-contain image-rendering-pixelated rounded-xl"
            />

            {/* Left & Right Labels */}
            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md px-2 py-1 rounded text-amber-400 border border-amber-500/30 pointer-events-none">
              Low Dose (25%)
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md px-2 py-1 rounded text-cyan-400 border border-cyan-500/30 pointer-events-none">
              U-Net Restored
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-8 flex items-center justify-center pointer-events-none"
              style={{ left: `calc(${splitPos}% - 16px)` }}
            >
              <div className="w-6 h-6 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center text-[10px] font-bold">
                ↔
              </div>
            </div>
          </div>

          <div className="max-w-[360px] mx-auto flex items-center gap-3 text-xs text-slate-500">
            <span>Low Dose</span>
            <input
              type="range"
              min="5"
              max="95"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span>AI Restored</span>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SingleSliceCard
            title="1. Standard Dose (100%)"
            subtitle="Full Diagnostic Reference"
            grid={slices.standardDose}
            colormap={colormap}
            badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
          />
          <SingleSliceCard
            title="2. Low Dose (25%)"
            subtitle="High Poisson Noise"
            grid={slices.lowDose}
            colormap={colormap}
            badgeColor="bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
          />
          <SingleSliceCard
            title="3. Deep Learning U-Net"
            subtitle="Noise Suppressed & Sharp Edges"
            grid={slices.aiRestored}
            colormap={colormap}
            badgeColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
          />
        </div>
      )}
    </div>
  );
};

const SingleSliceCard: React.FC<{
  title: string;
  subtitle: string;
  grid: number[][];
  colormap: ColormapType;
  badgeColor: string;
}> = ({ title, subtitle, grid, colormap, badgeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = grid.length || 128;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const maxVal = 4500;
    const minVal = 0;

    let p = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const raw = grid[y][x];
        const normalized = Math.max(0, Math.min(1, (raw - minVal) / (maxVal - minVal)));
        const [r, g, b] = getColormapRgb(normalized, colormap);
        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
        data[p + 3] = 255;
        p += 4;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [grid, colormap, size]);

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{title}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>Active</span>
      </div>
      <div className="bg-black rounded-xl p-1.5 aspect-square border border-slate-800 flex items-center justify-center">
        <canvas ref={canvasRef} width={size} height={size} className="w-full h-full object-contain image-rendering-pixelated rounded" />
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">{subtitle}</p>
    </div>
  );
};
