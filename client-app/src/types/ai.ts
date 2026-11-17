export interface AiScenarioDto {
  id: string;
  code: string;
  defaultDoseReductionFactor: number;
  defaultLesionDiameterMm: number;
  title: string;
  clinicalContext: string;
  methodologyDescription: string;
  expectedOutcome: string;
}
