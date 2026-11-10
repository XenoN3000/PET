export type QcFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Periodic' | 'Annual' | 'Acceptance';

export interface PhantomSpecDto {
  id: string;
  name: string;
  type: string;
  recommendedIsotope: string;
  activityLevel: string;
  preparationInstructions: string;
  dimensions: string;
}

export interface TestStepDto {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  isCritical: boolean;
  cautionNote?: string | null;
}

export interface AcceptanceCriterionDto {
  id: string;
  parameterName: string;
  comparisonOperator: string;
  targetValue: number;
  unit: string;
  toleranceDescription: string;
  remedialAction: string;
}

export interface QcProtocolDto {
  id: string;
  code: string;
  title: string;
  standard: string;
  frequency: QcFrequency;
  description: string;
  clinicalPurpose: string;
  acquisitionParameters: string;
  phantom?: PhantomSpecDto;
  steps: TestStepDto[];
  acceptanceCriteria: AcceptanceCriterionDto[];
}
