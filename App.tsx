import React, { useState, useEffect } from 'react';
import Seismograph from './components/Seismograph';
import SimulationMap from './components/SimulationMap';
import ControlPanel from './components/ControlPanel';
import ReportPanel from './components/ReportPanel';
import { SimulationParams, SimulationReport, ShakeLevel } from './types';
import { generateEarthquakeReport } from './services/geminiService';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [params, setParams] = useState<SimulationParams>({
    magnitude: 5.5,
    depth: 10,
    locationType: 'Urban Metropolis',
    epicenter: { x: 50, y: 50 } // Center default
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [shakeLevel, setShakeLevel] = useState<ShakeLevel>(ShakeLevel.NONE);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // --- Effects ---

  // Handle shake class on body for full immersion
  useEffect(() => {
    const body = document.body;
    body.className = ''; // Reset
    
    if (shakeLevel === ShakeLevel.MILD) body.classList.add('shake-mild');
    if (shakeLevel === ShakeLevel.MEDIUM) body.classList.add('shake-medium');
    if (shakeLevel === ShakeLevel.EXTREME) body.classList.add('shake-extreme');

    return () => {
      body.className = '';
    };
  }, [shakeLevel]);

  // --- Handlers ---

  const startSimulation = async () => {
    setIsSimulating(true);
    setReport(null);
    setLoadingReport(true);

    // 1. Determine Shake Intensity
    let level = ShakeLevel.MILD;
    if (params.magnitude > 5.0) level = ShakeLevel.MEDIUM;
    if (params.magnitude > 7.0) level = ShakeLevel.EXTREME;
    
    // Depth attenuation (deeper = less surface shaking usually, simplified here)
    if (params.depth > 100 && level === ShakeLevel.EXTREME) level = ShakeLevel.MEDIUM;
    if (params.depth > 300 && level === ShakeLevel.MEDIUM) level = ShakeLevel.MILD;

    setShakeLevel(level);

    // 2. Simulate duration of shaking based on magnitude (simulated 3-8 seconds)
    const shakeDuration = 3000 + (params.magnitude * 500);
    
    // 3. Parallel Process: Wait for shake AND Fetch AI Report
    const fetchReportPromise = generateEarthquakeReport(params);
    
    // Timer to stop visual shaking
    setTimeout(() => {
      setShakeLevel(ShakeLevel.NONE);
    }, shakeDuration);

    try {
        const result = await fetchReportPromise;
        setReport(result);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingReport(false);
        // Note: we keep isSimulating true to show "Reset" button state
    }
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setShakeLevel(ShakeLevel.NONE);
    setReport(null);
    setLoadingReport(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">SEISMOGEN</h1>
            <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">Earthquake Simulator V.2.1</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
             <div className="text-xs text-slate-500 font-mono">SYSTEM STATUS</div>
             <div className="flex items-center gap-2 justify-end">
                <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                <span className="text-sm font-bold text-slate-300">{isSimulating ? 'EVENT IN PROGRESS' : 'MONITORING'}</span>
             </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visuals & Controls */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Visuals Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
                <h3 className="text-slate-400 text-xs font-mono mb-2 uppercase">Real-time Seismograph</h3>
                <Seismograph shakeLevel={shakeLevel} magnitude={params.magnitude} />
            </div>
            <div className="col-span-1">
                <h3 className="text-slate-400 text-xs font-mono mb-2 uppercase">Epicenter Locator</h3>
                <SimulationMap 
                    epicenter={params.epicenter} 
                    onEpicenterChange={(pos) => setParams(prev => ({ ...prev, epicenter: pos }))} 
                    isShaking={isSimulating}
                    magnitude={params.magnitude}
                />
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1">
             <ControlPanel 
                params={params} 
                setParams={setParams} 
                isSimulating={isSimulating} 
                onSimulate={startSimulation}
                onReset={resetSimulation}
             />
          </div>

          {/* Educational Note */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-500">
             <strong className="text-slate-400">Did you know?</strong> 
             <span className="ml-1">
                The Richter scale is logarithmic. A magnitude 7.0 earthquake is 10 times larger in amplitude and releases 32 times more energy than a 6.0 earthquake.
             </span>
          </div>
        </div>

        {/* Right Column: AI Report */}
        <div className="lg:col-span-5 h-full min-h-[500px]">
            <ReportPanel report={report} isLoading={loadingReport} />
        </div>

      </main>
    </div>
  );
};

export default App;