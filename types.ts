export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  SCAM = 'SCAM',
}

export interface DetectionRule {
  pattern: RegExp;
  score: number;
  reason: string;
  type: 'keyword' | 'domain' | 'phone' | 'behavior';
}

export interface ScanResult {
  id: string;
  text: string;
  timestamp: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  reasons: string[];
  recommendations: string[];
}

export interface HistoryItem extends ScanResult {
  reported: boolean;
}