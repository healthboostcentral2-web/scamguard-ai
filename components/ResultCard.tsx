import React from 'react';
import { RiskLevel, ScanResult } from '../types';

interface ResultCardProps {
  result: ScanResult | null;
  onReport: () => void;
  isReported: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReport, isReported }) => {
  if (!result) return null;

  const getColors = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SCAM:
        return 'bg-red-50 border-red-200 text-red-900 icon-red-600';
      case RiskLevel.SUSPICIOUS:
        return 'bg-yellow-50 border-yellow-200 text-yellow-900 icon-yellow-600';
      case RiskLevel.SAFE:
        return 'bg-green-50 border-green-200 text-green-900 icon-green-600';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  const colors = getColors(result.riskLevel);
  const badgeColor = result.riskLevel === RiskLevel.SCAM ? 'bg-red-600' : result.riskLevel === RiskLevel.SUSPICIOUS ? 'bg-yellow-500' : 'bg-green-600';

  return (
    <div className={`w-full rounded-2xl border-2 p-6 mb-6 shadow-sm animate-fade-in ${colors}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{result.riskLevel}</h2>
          <p className="text-sm opacity-80">Confidence: {result.confidenceScore}%</p>
        </div>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ${badgeColor}`}>
          {result.riskLevel === RiskLevel.SCAM ? '!' : result.riskLevel === RiskLevel.SUSPICIOUS ? '?' : '✓'}
        </div>
      </div>

      {/* Reasons */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-lg">Why?</h3>
        {result.reasons.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {result.reasons.map((reason, idx) => (
              <li key={idx} className="text-sm md:text-base opacity-90">{reason}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-80">No specific scam indicators found.</p>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white/60 rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2 text-lg">What To Do</h3>
        <ol className="list-decimal pl-5 space-y-2">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm md:text-base font-medium">{rec}</li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={onReport}
          disabled={isReported}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 ${isReported ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}
        >
          {isReported ? 'Reported ✓' : 'Report Scam'}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;