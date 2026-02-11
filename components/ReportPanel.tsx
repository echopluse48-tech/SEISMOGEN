import React from 'react';
import { AlertTriangle, Info, Users, DollarSign, ShieldAlert } from 'lucide-react';
import { SimulationReport } from '../types';

interface ReportPanelProps {
  report: SimulationReport | null;
  isLoading: boolean;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ report, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 border border-slate-700 rounded-xl bg-slate-800/50 animate-pulse">
        <ActivityLoader />
        <p className="text-slate-400 text-sm font-mono">ANALYZING SEISMIC DATA...</p>
        <p className="text-slate-500 text-xs">Connecting to Gemini Geological AI Node...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500">
        <Info size={48} className="mb-4 opacity-50" />
        <p>No event data available.</p>
        <p className="text-sm">Run a simulation to generate an impact report.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-start">
            <div>
                <h3 className="text-red-400 font-mono text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Impact Assessment
                </h3>
                <h2 className="text-xl font-bold text-white leading-tight">{report.headline}</h2>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 uppercase">Mercalli Intensity</span>
                <span className="text-3xl font-black text-white">{report.intensityMercalli}</span>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            <p className="text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4 py-1 bg-slate-800/50">
                {report.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Users size={16} />
                        <span className="text-xs uppercase font-bold">Affected Pop.</span>
                    </div>
                    <p className="text-lg font-mono text-white">{report.affectedPopulationEstimate}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <DollarSign size={16} />
                        <span className="text-xs uppercase font-bold">Est. Damage</span>
                    </div>
                    <p className="text-lg font-mono text-white">{report.estimatedDamageCost}</p>
                </div>
            </div>

            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-5">
                <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3">
                    <ShieldAlert size={18} />
                    CRITICAL SAFETY PROTOCOLS
                </h4>
                <ul className="space-y-2">
                    {report.safetyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm">
                            <span className="bg-red-500/20 text-red-400 font-mono text-xs px-1.5 py-0.5 rounded border border-red-500/30">
                                0{idx + 1}
                            </span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

// Simple visual loader
const ActivityLoader = () => (
    <div className="flex items-center gap-1 h-8">
        {[...Array(5)].map((_, i) => (
            <div 
                key={i} 
                className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite]" 
                style={{ animationDelay: `${i * 0.1}s`, height: '60%' }}
            ></div>
        ))}
    </div>
);

export default ReportPanel;