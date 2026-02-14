import React from 'react';
import { HistoryItem, RiskLevel } from '../types';

interface HistorySectionProps {
  history: HistoryItem[];
  onClear: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent Scans</h3>
        <button onClick={onClear} className="text-sm text-slate-500 hover:text-red-500 underline">
          Clear
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-slate-800 truncate font-medium text-sm">{item.text}</p>
              <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              item.riskLevel === RiskLevel.SCAM ? 'bg-red-100 text-red-700' :
              item.riskLevel === RiskLevel.SUSPICIOUS ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {item.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;