import React, { useRef, useEffect, useState } from 'react';
import { getColormapRgb, type ColormapType } from '../../utils/phantomSim';
import { Eye, Palette } from 'lucide-react';

interface PhantomCanvasViewerProps {
  grid: number[][];
  colormap: ColormapType;
  onColormapChange: (colormap: ColormapType) => void;
  crosshair?: { x: number; y: number };
  onCrosshairChange?: (pos: { x: number; y: number }) => void;
  roiCircle?: { x: number; y: number; radius: number };
  onRoiChange?: (roi: { x: number; y: number; radius: number }) => void;
  title?: string;
}

export const PhantomCanvasViewer: React.FC<PhantomCanvasViewerProps> = ({
  grid,
  colormap,
  onColormapChange,
  crosshair,
  onCrosshairChange,
  roiCircle,
  onRoiChange,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windowLevel, setWindowLevel] = useState<number>(50); // 0-100%
  const [windowWidth, setWindowWidth] = useState<number>(100); // 10-200%
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const size = grid.length || 128;

  // Render slice to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find min and max counts
    let maxVal = 0;
    let minVal = Infinity;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const v = grid[r][c];
        if (v > maxVal) maxVal = v;
        if (v < minVal) minVal = v;
      }
    }
    if (minVal === Infinity) minVal = 0;
    if (maxVal === 0) maxVal = 1;

    // Window / Level mapping
    const levelVal = minVal + (maxVal - minVal) * (windowLevel / 100);
    const widthVal = (maxVal - minVal) * (windowWidth / 100) || 1;
    const lower = levelVal - widthVal / 2;
    const upper = levelVal + widthVal / 2;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    let p = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const raw = grid[y] ? grid[y][x] || 0 : 0;
        const normalized = Math.max(0, Math.min(1, (raw - lower) / (upper - lower || 1)));
        const [r, g, b] = getColormapRgb(normalized, colormap);

        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
        data[p + 3] = 255; // Alpha
        p += 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw Overlays
    // 1. Draw crosshair if provided
    if (crosshair) {
      ctx.strokeStyle = '#38bdf8'; // Cyan
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(size, crosshair.y);
      ctx.stroke();

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, size);
      ctx.stroke();

      ctx.setLineDash([]);
      // Center circle
      ctx.beginPath();
      ctx.arc(crosshair.x, crosshair.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
    }

    // 2. Draw ROI Circle if provided
    if (roiCircle) {
      ctx.strokeStyle = '#10b981'; // Emerald
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.arc(roiCircle.x, roiCircle.y, roiCircle.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center cross
      ctx.beginPath();
      ctx.arc(roiCircle.x, roiCircle.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981';
      ctx.fill();
    }

  }, [grid, colormap, windowLevel, windowWidth, crosshair, roiCircle, size]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = size / rect.width;
    const x = Math.round((e.clientX - rect.left) * scale);
    const y = Math.round((e.clientY - rect.top) * scale);

    const clampedX = Math.max(0, Math.min(size - 1, x));
    const clampedY = Math.max(0, Math.min(size - 1, y));

    if (onCrosshairChange) {
      onCrosshairChange({ x: clampedX, y: clampedY });
    } else if (onRoiChange && roiCircle) {
      onRoiChange({ ...roiCircle, x: clampedX, y: clampedY });
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-blue-500" />
          <span>{title || '2D Axial Slice Viewer'}</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">{size} × {size} px</span>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative flex justify-center items-center bg-black rounded-xl p-2 overflow-hidden aspect-square max-w-[320px] mx-auto border border-slate-800">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleCanvasInteraction(e);
          }}
          onMouseMove={(e) => {
            if (isDragging) handleCanvasInteraction(e);
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="w-full h-full object-contain cursor-crosshair image-rendering-pixelated rounded"
        />
        <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-cyan-400 pointer-events-none">
          {crosshair ? `X: ${crosshair.x} Y: ${crosshair.y}` : roiCircle ? `R: ${roiCircle.radius}px` : ''}
        </div>
      </div>

      {/* Controls: Colormap & Window/Level */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Colormaps */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
            <Palette className="w-3 h-3" /> Colormap:
          </span>
          <div className="flex items-center gap-1">
            {(['grayscale', 'hot-metal', 'rainbow'] as ColormapType[]).map((cm) => (
              <button
                key={cm}
                type="button"
                onClick={() => onColormapChange(cm)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-all ${
                  colormap === cm
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cm === 'hot-metal' ? 'Hot' : cm}
              </button>
            ))}
          </div>
        </div>

        {/* Window & Level Sliders */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>Level</span>
              <span className="font-mono">{windowLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={windowLevel}
              onChange={(e) => setWindowLevel(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>Window</span>
              <span className="font-mono">{windowWidth}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={windowWidth}
              onChange={(e) => setWindowWidth(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
