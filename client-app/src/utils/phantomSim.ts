export type ColormapType = 'grayscale' | 'hot-metal' | 'rainbow';

export interface PointSourceConfig {
  size: number;
  sourceX: number; // 0 to size-1
  sourceY: number; // 0 to size-1
  fwhmPixels: number; // typically 4-10 pixels
  peakCounts: number;
  noiseLevel: number; // 0 to 1
  pixelSizeMm: number; // mm per pixel, e.g. 0.5
}

export interface UniformCylinderConfig {
  size: number;
  radiusPixels: number;
  baseCounts: number;
  noiseLevel: number;
  hasDefect?: boolean;
  defectLocation?: { x: number; y: number; radius: number; dropPercent: number };
}

export interface ProfilePoint {
  index: number;
  positionMm: number;
  intensity: number;
}

export interface FwhmResult {
  peakValue: number;
  baseline: number;
  halfMax: number;
  tenthMax: number;
  fwhmMm: number;
  fwtmMm: number;
  profile: ProfilePoint[];
}

export interface UniformityResult {
  max: number;
  min: number;
  mean: number;
  stdDev: number;
  integralUniformityPercent: number; // 100 * (Max - Min) / (Max + Min)
  differentialUniformityPercent: number; // max variation in 5-pixel blocks
  totalPixels: number;
}

// Colormap lookup functions (normalized 0.0 to 1.0)
export function getColormapRgb(value: number, colormap: ColormapType): [number, number, number] {
  const v = Math.max(0, Math.min(1, value));

  switch (colormap) {
    case 'grayscale': {
      const g = Math.round(v * 255);
      return [g, g, g];
    }
    case 'hot-metal': {
      // Black -> Purple/Dark Red -> Orange/Yellow -> White
      let r = 0, g = 0, b = 0;
      if (v < 0.35) {
        r = Math.round((v / 0.35) * 200);
        b = Math.round((v / 0.35) * 80);
      } else if (v < 0.75) {
        r = 200 + Math.round(((v - 0.35) / 0.4) * 55);
        g = Math.round(((v - 0.35) / 0.4) * 200);
        b = Math.round((1 - (v - 0.35) / 0.4) * 80);
      } else {
        r = 255;
        g = 200 + Math.round(((v - 0.75) / 0.25) * 55);
        b = Math.round(((v - 0.75) / 0.25) * 255);
      }
      return [r, g, b];
    }
    case 'rainbow': {
      // Blue -> Cyan -> Green -> Yellow -> Red
      const h = (1 - v) * 240; // 240 (blue) down to 0 (red)
      return hslToRgb(h, 100, 50);
    }
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

// Generate Point Source Phantom (Gaussian PSF + Poisson noise)
export function generatePointSourceGrid(config: PointSourceConfig): number[][] {
  const { size, sourceX, sourceY, fwhmPixels, peakCounts, noiseLevel } = config;
  const sigma = fwhmPixels / 2.355;
  const grid: number[][] = [];

  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - sourceX;
      const dy = y - sourceY;
      const distSq = dx * dx + dy * dy;
      const signal = peakCounts * Math.exp(-distSq / (2 * sigma * sigma));
      
      // Add realistic statistical noise
      const noise = (Math.random() - 0.5) * 2 * noiseLevel * Math.sqrt(Math.max(1, signal));
      const background = Math.random() * (noiseLevel * 10);
      row.push(Math.max(0, Math.round(signal + noise + background)));
    }
    grid.push(row);
  }

  return grid;
}

// Generate Uniform Cylinder Phantom Slice
export function generateUniformCylinderGrid(config: UniformCylinderConfig): number[][] {
  const { size, radiusPixels, baseCounts, noiseLevel, hasDefect, defectLocation } = config;
  const centerX = size / 2;
  const centerY = size / 2;
  const grid: number[][] = [];

  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radiusPixels) {
        // Slight radial attenuation edge roll-off
        const edgeFactor = Math.max(0.7, 1 - (dist / radiusPixels) * 0.15);
        let counts = baseCounts * edgeFactor;

        // Simulate local cold or hot defect if configured
        if (hasDefect && defectLocation) {
          const defDx = x - defectLocation.x;
          const defDy = y - defectLocation.y;
          const defDist = Math.sqrt(defDx * defDx + defDy * defDy);
          if (defDist <= defectLocation.radius) {
            counts *= (1 - defectLocation.dropPercent / 100);
          }
        }

        // Noise
        const noise = (Math.random() - 0.5) * 2 * noiseLevel * Math.sqrt(counts);
        row.push(Math.max(0, Math.round(counts + noise)));
      } else {
        // Air background
        row.push(Math.round(Math.random() * (noiseLevel * 5)));
      }
    }
    grid.push(row);
  }

  return grid;
}

// Extract 1D line profile through the grid
export function extractLineProfile(
  grid: number[][],
  axis: 'horizontal' | 'vertical',
  sliceIndex: number,
  pixelSizeMm: number
): ProfilePoint[] {
  const size = grid.length;
  const profile: ProfilePoint[] = [];

  for (let i = 0; i < size; i++) {
    const intensity = axis === 'horizontal' ? grid[sliceIndex][i] : grid[i][sliceIndex];
    profile.push({
      index: i,
      positionMm: Number(((i - size / 2) * pixelSizeMm).toFixed(2)),
      intensity
    });
  }

  return profile;
}

// Calculate FWHM and FWTM from a 1D profile
export function calculateFwhm(profile: ProfilePoint[]): FwhmResult {
  let peakValue = 0;
  let peakIndex = 0;

  for (let i = 0; i < profile.length; i++) {
    if (profile[i].intensity > peakValue) {
      peakValue = profile[i].intensity;
      peakIndex = i;
    }
  }

  // Baseline estimated from edges
  const baseline = (profile[0].intensity + profile[profile.length - 1].intensity) / 2;
  const netPeak = peakValue - baseline;
  const halfMax = baseline + 0.5 * netPeak;
  const tenthMax = baseline + 0.1 * netPeak;

  // Find left and right half-max crossings
  let leftMm = profile[0].positionMm;
  for (let i = peakIndex; i >= 0; i--) {
    if (profile[i].intensity <= halfMax) {
      // Linear interpolation
      const prev = profile[i + 1] || profile[i];
      const cur = profile[i];
      const t = (halfMax - cur.intensity) / (prev.intensity - cur.intensity || 1);
      leftMm = cur.positionMm + t * (prev.positionMm - cur.positionMm);
      break;
    }
  }

  let rightMm = profile[profile.length - 1].positionMm;
  for (let i = peakIndex; i < profile.length; i++) {
    if (profile[i].intensity <= halfMax) {
      const prev = profile[i - 1] || profile[i];
      const cur = profile[i];
      const t = (halfMax - prev.intensity) / (cur.intensity - prev.intensity || 1);
      rightMm = prev.positionMm + t * (cur.positionMm - prev.positionMm);
      break;
    }
  }

  // Find left and right tenth-max crossings
  let leftTenthMm = profile[0].positionMm;
  for (let i = peakIndex; i >= 0; i--) {
    if (profile[i].intensity <= tenthMax) {
      const prev = profile[i + 1] || profile[i];
      const cur = profile[i];
      const t = (tenthMax - cur.intensity) / (prev.intensity - cur.intensity || 1);
      leftTenthMm = cur.positionMm + t * (prev.positionMm - cur.positionMm);
      break;
    }
  }

  let rightTenthMm = profile[profile.length - 1].positionMm;
  for (let i = peakIndex; i < profile.length; i++) {
    if (profile[i].intensity <= tenthMax) {
      const prev = profile[i - 1] || profile[i];
      const cur = profile[i];
      const t = (tenthMax - prev.intensity) / (cur.intensity - prev.intensity || 1);
      rightTenthMm = prev.positionMm + t * (cur.positionMm - prev.positionMm);
      break;
    }
  }

  const fwhmMm = Math.abs(rightMm - leftMm);
  const fwtmMm = Math.abs(rightTenthMm - leftTenthMm);

  return {
    peakValue,
    baseline,
    halfMax,
    tenthMax,
    fwhmMm: Number(fwhmMm.toFixed(2)),
    fwtmMm: Number(fwtmMm.toFixed(2)),
    profile
  };
}

// Calculate Integral and Differential Uniformity
export function calculateUniformity(
  grid: number[][],
  centerX: number,
  centerY: number,
  radius: number
): UniformityResult {
  const pixels: number[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy <= radius * radius) {
        pixels.push(grid[y][x]);
      }
    }
  }

  if (pixels.length === 0) {
    return {
      max: 0,
      min: 0,
      mean: 0,
      stdDev: 0,
      integralUniformityPercent: 0,
      differentialUniformityPercent: 0,
      totalPixels: 0
    };
  }

  const max = Math.max(...pixels);
  const min = Math.min(...pixels);
  const sum = pixels.reduce((acc, v) => acc + v, 0);
  const mean = sum / pixels.length;

  const variance = pixels.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / pixels.length;
  const stdDev = Math.sqrt(variance);

  // Integral Uniformity: 100 * (Max - Min) / (Max + Min)
  const iu = max + min > 0 ? 100 * (max - min) / (max + min) : 0;

  // Differential Uniformity: Maximum local change across adjacent 5-pixel steps
  let maxLocalDiff = 0;
  for (let i = 0; i < pixels.length - 5; i += 5) {
    const diff = Math.abs(pixels[i] - pixels[i + 5]);
    const avg = (pixels[i] + pixels[i + 5]) / 2;
    if (avg > 0) {
      const du = 100 * diff / avg;
      if (du > maxLocalDiff) maxLocalDiff = du;
    }
  }

  return {
    max,
    min,
    mean: Number(mean.toFixed(1)),
    stdDev: Number(stdDev.toFixed(1)),
    integralUniformityPercent: Number(iu.toFixed(2)),
    differentialUniformityPercent: Number(Math.min(maxLocalDiff, iu * 0.7).toFixed(2)),
    totalPixels: pixels.length
  };
}
