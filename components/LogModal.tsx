
import React, { useState, useEffect, useRef } from 'react';
import { Container, AIAnalysisResult } from '../types';
import { X, Sparkles, Cpu, Terminal, AlertTriangle, CheckCircle, Copy, Search } from 'lucide-react';
import { analyzeContainerLogs } from '../services/geminiService';

interface LogModalProps {
  container: Container | null;
  onClose: () => void;
}

export const LogModal: React.FC<LogModalProps> = ({ container, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Reset AI result and filter when opening a new container
    setAiResult(null);
    setFilterQuery('');
  }, [container]);

  if (!container) return null;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
        const result = await analyzeContainerLogs(container.name, container.logs);
        setAiResult(result);
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const filteredLogs = container.logs.filter(log => 
    log.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <Terminal size={20} className="text-slate-300" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {container.name} 
                        <span className="text-xs font-normal text-slate-500 font-mono px-2 py-0.5 bg-slate-800 rounded">{container.id.substring(0,12)}</span>
                    </h3>
                    <p className="text-sm text-slate-400">Container Logs & Analysis</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Logs Column */}
            <div className="flex-1 flex flex-col min-h-[300px] border-r border-slate-800">
                
                {/* Search / Filter Bar */}
                <div className="p-2 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Filter logs..." 
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-600 font-mono"
                        />
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-sm space-y-1 bg-slate-950 text-slate-300">
                    {filteredLogs.length === 0 ? (
                        <div className="text-slate-600 italic p-4 text-center">
                            {container.logs.length === 0 ? 'No logs available for this container.' : 'No logs match your filter.'}
                        </div>
                    ) : (
                        filteredLogs.map((log, index) => (
                            <div key={index} className={`break-all ${
                                log.includes('ERROR') || log.includes('Exception') ? 'text-rose-400' : 
                                log.includes('[audit]') ? 'text-cyan-400 font-bold' :
                                'text-slate-300'
                            }`}>
                                <span className="text-slate-600 select-none mr-3">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </div>
                        ))
                    )}
                    <div ref={logsEndRef} />
                </div>
                
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                     <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || container.logs.length === 0}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-900/20"
                     >
                        {isAnalyzing ? (
                            <>
                                <Cpu className="animate-spin" size={18} />
                                Analyzing with Gemini...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Analyze Logs with AI
                            </>
                        )}
                     </button>
                </div>
            </div>

            {/* Analysis Result Column */}
            {aiResult && (
                <div className="w-full md:w-[350px] bg-slate-900 p-6 overflow-y-auto animate-slide-in-right">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AI Insights</h4>
                    
                    <div className={`p-4 rounded-xl border mb-4 ${
                        aiResult.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' : 
                        aiResult.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
                        'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-2 font-bold">
                            <AlertTriangle size={16} />
                            Analysis Summary
                        </div>
                        <p className="text-sm leading-relaxed opacity-90">{aiResult.summary}</p>
                    </div>

                    <div className="mb-6">
                        <h5 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" />
                            Suggested Fix
                        </h5>
                        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 group relative">
                            <code className="text-sm font-mono text-blue-300 break-all">
                                {aiResult.suggestedFix}
                            </code>
                            <button 
                                onClick={() => navigator.clipboard.writeText(aiResult.suggestedFix)}
                                className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 text-center mt-8">
                        Powered by Gemini 2.5 Flash
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
