export interface AiDoseImages {
  standardDose: number[][];
  lowDose: number[][];
  aiRestored: number[][];
  pvcCorrected: number[][];
}

export interface MetricComparison {
  lowDosePsnr: number;
  aiPsnr: number;
  lowDoseSsim: number;
  aiSsim: number;
  lowDoseDice: number;
  aiDice: number;
  lesionPeakGt: number;
  lesionPeakLowDose: number;
  lesionPeakAi: number;
  lesionPeakPvc: number;
}

export interface RecoveryCurvePoint {
  diameterMm: number;
  idealRc: number; // 100%
  uncorrectedRc: number;
  pvcCorrectedRc: number;
}

// Generate realistic clinical torso slice with hepatic parenchyma & hot tumor lesions
export function generateAiSimulationSlices(
  size: number = 128,
  doseReductionFactor: number = 4, // 25% dose
  lesionDiameterMm: number = 15
): AiDoseImages {
  const standardDose: number[][] = [];
  const lowDose: number[][] = [];
  const aiRestored: number[][] = [];
  const pvcCorrected: number[][] = [];

  const centerX = size / 2;
  const centerY = size / 2;
  const a = size * 0.42; // Body horizontal semi-axis
  const b = size * 0.35; // Body vertical semi-axis

  // Lesion position
  const lesionX = centerX + 18;
  const lesionY = centerY - 10;
  const pixelSizeMm = 0.5;
  const lesionRadiusPixels = (lesionDiameterMm / 2) / pixelSizeMm;

  // Secondary smaller lesion
  const lesion2X = centerX - 20;
  const lesion2Y = centerY + 15;
  const lesion2RadiusPixels = (10 / 2) / pixelSizeMm;

  for (let y = 0; y < size; y++) {
    const rStd: number[] = [];
    const rLow: number[] = [];
    const rAi: number[] = [];
    const rPvc: number[] = [];

    for (let x = 0; x < size; x++) {
      const dx = (x - centerX) / a;
      const dy = (y - centerY) / b;
      const bodyDist = dx * dx + dy * dy;

      if (bodyDist <= 1.0) {
        // Inside body: soft tissue background base SUV ~ 1.5 (scale: 600 counts)
        let baseCounts = 600;

        // Liver region (anatomical right, x < centerX)
        const ldx = (x - (centerX - 18)) / 22;
        const ldy = (y - (centerY - 5)) / 18;
        if (ldx * ldx + ldy * ldy <= 1.0) {
          baseCounts = 1100; // Normal liver SUV ~ 2.5
        }

        // Spine attenuation cold center
        const sdx = x - centerX;
        const sdy = y - (centerY + 20);
        if (sdx * sdx + sdy * sdy <= 36) {
          baseCounts = 250;
        }

        // Primary Hot Lesion (Simulate PVE blur: true peak is 4500, blurred is ~2800)
        const dist1 = Math.sqrt((x - lesionX) ** 2 + (y - lesionY) ** 2);
        let lesion1Signal = 0;
        if (dist1 <= lesionRadiusPixels * 1.5) {
          const sigma = lesionRadiusPixels / 1.8;
          lesion1Signal = 3500 * Math.exp(-(dist1 * dist1) / (2 * sigma * sigma));
        }

        // Secondary small Lesion (10mm)
        const dist2 = Math.sqrt((x - lesion2X) ** 2 + (y - lesion2Y) ** 2);
        let lesion2Signal = 0;
        if (dist2 <= lesion2RadiusPixels * 1.5) {
          const sigma = lesion2RadiusPixels / 1.8;
          lesion2Signal = 2800 * Math.exp(-(dist2 * dist2) / (2 * sigma * sigma));
        }

        // 1. Standard Dose (Ground Truth)
        const stdCounts = baseCounts + lesion1Signal + lesion2Signal;
        const stdNoise = (Math.random() - 0.5) * 0.08 * Math.sqrt(stdCounts) * 10;
        const finalStd = Math.max(0, Math.round(stdCounts + stdNoise));
        rStd.push(finalStd);

        // 2. Low-Dose (Poisson variance amplified by reduction factor)
        const lowNoiseFactor = Math.sqrt(doseReductionFactor) * 0.35;
        const lowNoise = (Math.random() - 0.5) * lowNoiseFactor * Math.sqrt(stdCounts) * 15;
        const finalLow = Math.max(0, Math.round(stdCounts + lowNoise));
        rLow.push(finalLow);

        // 3. Deep Learning U-Net Restored (Noise suppressed, sharp boundary preserved)
        const residualNoise = (Math.random() - 0.5) * 0.06 * Math.sqrt(stdCounts) * 4;
        const finalAi = Math.max(0, Math.round(stdCounts + residualNoise));
        rAi.push(finalAi);

        // 4. PVC Corrected (Restores partial volume spill-out to true peak)
        let finalPvc = finalAi;
        if (dist1 <= lesionRadiusPixels * 1.2) {
          const pvcFactor = 1.0 + 0.45 * Math.exp(-(dist1 * dist1) / (lesionRadiusPixels * lesionRadiusPixels));
          finalPvc = Math.round(finalAi * pvcFactor);
        }
        rPvc.push(finalPvc);

      } else {
        // Air background
        const airNoise = Math.round(Math.random() * 15);
        rStd.push(airNoise);
        rLow.push(Math.round(airNoise * 2.5));
        rAi.push(Math.round(airNoise * 0.5));
        rPvc.push(Math.round(airNoise * 0.5));
      }
    }
    standardDose.push(rStd);
    lowDose.push(rLow);
    aiRestored.push(rAi);
    pvcCorrected.push(rPvc);
  }

  return { standardDose, lowDose, aiRestored, pvcCorrected };
}

// Peak Signal-to-Noise Ratio (PSNR) in dB
export function calculatePsnr(gt: number[][], test: number[][]): number {
  let mse = 0;
  let maxVal = 0;
  const size = gt.length;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const diff = gt[y][x] - test[y][x];
      mse += diff * diff;
      if (gt[y][x] > maxVal) maxVal = gt[y][x];
    }
  }

  mse /= (size * size);
  if (mse === 0) return 100;
  return Number((10 * Math.log10((maxVal * maxVal) / mse)).toFixed(2));
}

// Structural Similarity Index (SSIM) approximation
export function calculateSsim(gt: number[][], test: number[][]): number {
  const size = gt.length;
  let sumGt = 0;
  let sumTest = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      sumGt += gt[y][x];
      sumTest += test[y][x];
    }
  }

  const n = size * size;
  const muGt = sumGt / n;
  const muTest = sumTest / n;

  let varGt = 0;
  let varTest = 0;
  let cov = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dg = gt[y][x] - muGt;
      const dt = test[y][x] - muTest;
      varGt += dg * dg;
      varTest += dt * dt;
      cov += dg * dt;
    }
  }

  varGt /= (n - 1);
  varTest /= (n - 1);
  cov /= (n - 1);

  const c1 = (0.01 * 4000) ** 2;
  const c2 = (0.03 * 4000) ** 2;

  const ssim = ((2 * muGt * muTest + c1) * (2 * cov + c2)) /
               ((muGt * muGt + muTest * muTest + c1) * (varGt + varTest + c2));

  return Number(Math.max(0, Math.min(1, ssim)).toFixed(3));
}

// Dice Similarity Coefficient for lesion segmentation threshold
export function calculateDice(gt: number[][], test: number[][], threshold: number = 2200): number {
  let intersection = 0;
  let totalGt = 0;
  let totalTest = 0;
  const size = gt.length;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isGt = gt[y][x] >= threshold;
      const isTest = test[y][x] >= threshold;
      if (isGt) totalGt++;
      if (isTest) totalTest++;
      if (isGt && isTest) intersection++;
    }
  }

  if (totalGt + totalTest === 0) return 1.0;
  return Number(((2 * intersection) / (totalGt + totalTest)).toFixed(3));
}

// Generate NEMA IEC Recovery Coefficient Curve vs Sphere Diameter
export function generateRecoveryCurves(): RecoveryCurvePoint[] {
  const diameters = [10, 13, 17, 22, 28, 37];
  return diameters.map(d => {
    // Uncorrected RC drops severely for spheres < 20mm due to system resolution (~4.5mm FWHM)
    const uncorrected = Number((100 * (1 - Math.exp(-d / 8.5))).toFixed(1));
    // PVC restores RC close to 100% even for small spheres
    const pvc = Number(Math.min(100, uncorrected * 1.35 + (37 - d) * 0.4).toFixed(1));

    return {
      diameterMm: d,
      idealRc: 100,
      uncorrectedRc: uncorrected,
      pvcCorrectedRc: pvc
    };
  });
}
