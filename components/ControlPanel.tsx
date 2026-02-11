import React from 'react';
import { Activity, Layers, MapPin } from 'lucide-react';
import { SimulationParams } from '../types';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isSimulating: boolean;
  onSimulate: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, isSimulating, onSimulate, onReset }) => {
  
  const handleMagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, magnitude: parseFloat(e.target.value) }));
  };

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, depth: parseFloat(e.target.value) }));
  };

  const handleLocationChange = (val: string) => {
    setParams(prev => ({ ...prev, locationType: val }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-700 pb-4">
        <Activity className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-white">Simulation Parameters</h2>
      </div>

      {/* Magnitude Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-slate-300 font-medium">Magnitude (Richter)</span>
            <span className={`font-mono font-bold ${params.magnitude >= 7 ? 'text-red-400' : params.magnitude >= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                {params.magnitude.toFixed(1)}
            </span>
        </div>
        <input 
            type="range" 
            min="1.0" 
            max="9.5" 
            step="0.1" 
            value={params.magnitude}
            onChange={handleMagChange}
            disabled={isSimulating}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
        />
        <div className="flex justify-between text-xs text-slate-500">
            <span>Micro (1.0)</span>
            <span>Great (9.5)</span>
        </div>
      </div>

      {/* Depth Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-slate-300 font-medium">Depth (Hypocenter)</span>
            <span className="font-mono font-bold text-blue-300">{params.depth} km</span>
        </div>
        <input 
            type="range" 
            min="0" 
            max="700" 
            step="5" 
            value={params.depth}
            onChange={handleDepthChange}
            disabled={isSimulating}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-slate-500">
            <span>Shallow (0km)</span>
            <span>Deep (700km)</span>
        </div>
      </div>

      {/* Environment Select */}
      <div className="space-y-2">
        <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <MapPin size={16} /> Environment
        </label>
        <div className="grid grid-cols-3 gap-2">
            {['Urban Metropolis', 'Coastal Region', 'Rural Farmland', 'Mountainous', 'Industrial Zone', 'Desert'].map((loc) => (
                <button
                    key={loc}
                    onClick={() => handleLocationChange(loc)}
                    disabled={isSimulating}
                    className={`text-xs p-2 rounded border transition-colors ${
                        params.locationType === loc 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    {loc}
                </button>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex gap-4">
        {!isSimulating ? (
            <button 
                onClick={onSimulate}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Activity size={20} />
                TRIGGER QUAKE
            </button>
        ) : (
             <button 
                onClick={onReset}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                RESET SYSTEM
            </button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;