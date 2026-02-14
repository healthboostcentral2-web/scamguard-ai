import React, { useState, useEffect } from 'react';
import { analyzeContent } from './services/detector';
import { getHistory, saveHistoryItem, clearHistory } from './services/storage';
import { ScanResult, HistoryItem } from './types';
import ResultCard from './components/ResultCard';
import HistorySection from './components/HistorySection';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isReported, setIsReported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleScan = () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setResult(null);
    setIsReported(false);

    // Simulate analysis delay for better UX
    setTimeout(() => {
      const scanResult = analyzeContent(inputText);
      setResult(scanResult);
      
      const historyItem: HistoryItem = { ...scanResult, reported: false };
      saveHistoryItem(historyItem);
      setHistory(getHistory());
      setLoading(false);
    }, 600);
  };

  const handleReport = () => {
    // In a real app, this would send data to an API
    setIsReported(true);
    alert("Thanks for reporting! This helps improve our detection engine.");
  };

  const handleClearHistory = () => {
    if (confirm("Clear all scan history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-4 md:px-0">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">ScamGuard AI</h1>
          <p className="text-slate-500 mt-1 font-medium">India's Smart Fraud Detector</p>
        </header>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
          <textarea
            className="w-full h-32 resize-none outline-none text-lg text-slate-700 placeholder:text-slate-400"
            placeholder="Paste suspicious SMS, phone number, or link here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-400 font-medium">Text, Links or Numbers</span>
            <button
              onClick={handleScan}
              disabled={!inputText.trim() || loading}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </>
              ) : 'Scan Now'}
            </button>
          </div>
        </div>

        {/* Results */}
        <ResultCard 
          result={result} 
          onReport={handleReport} 
          isReported={isReported}
        />

        {/* History */}
        <HistorySection history={history} onClear={handleClearHistory} />

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-xs pb-6">
          <p>&copy; {new Date().getFullYear()} ScamGuard AI. Built for safety.</p>
          <p className="mt-1">Works offline.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;