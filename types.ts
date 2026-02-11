export interface SimulationParams {
  magnitude: number;
  depth: number; // in km
  locationType: string;
  epicenter: { x: number; y: number }; // Relative coordinates 0-100
}

export interface SimulationReport {
  headline: string;
  description: string;
  intensityMercalli: string;
  safetyTips: string[];
  estimatedDamageCost: string;
  affectedPopulationEstimate: string;
}

export enum ShakeLevel {
  NONE = 'NONE',
  MILD = 'MILD',
  MEDIUM = 'MEDIUM',
  EXTREME = 'EXTREME'
}
