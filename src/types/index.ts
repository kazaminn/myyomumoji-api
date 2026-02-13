export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorPair {
  id: string;
  foreground: string;
  background: string;
}

export interface WcagResult {
  ratio: number;
  normalText: { aa: boolean; aaa: boolean };
  largeText: { aa: boolean; aaa: boolean };
}

export interface ApcaResult {
  lc: number;
  rating: "poor" | "marginal" | "good" | "excellent";
  minimumFontSize: number;
}

export interface ColorblindSimulation {
  safe: boolean;
  simulated: string;
}

export interface ColorblindResult {
  protanopia: ColorblindSimulation;
  deuteranopia: ColorblindSimulation;
  tritanopia: ColorblindSimulation;
}

export interface ValidationResult {
  id: string;
  foreground: string;
  background: string;
  wcag: WcagResult;
  apca: ApcaResult;
  colorblind: ColorblindResult;
}

export interface ValidationSummary {
  total: number;
  wcagAA: { passed: number; failed: number };
  wcagAAA: { passed: number; failed: number };
  apcaGood: number;
}

export interface BatchValidationData {
  results: ValidationResult[];
  summary: ValidationSummary;
}
