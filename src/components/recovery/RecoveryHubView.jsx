import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, ShieldCheck, Sparkles, Plus, Footprints, AlertTriangle } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function RecoveryHubView() {
  const { workouts, shoes, addShoe, metrics } = useTraining();
  const [showAddShoe, setShowAddShoe] = useState(false);
  const [newShoeName, setNewShoeName] = useState('');
  const [newShoeMaxKm, setNewShoeMaxKm] = useState('600');

  // Filter workouts with recorded soreness
  const recentSorenessLogs = workouts.filter(w => w.soreness && w.soreness > 0).slice(0, 5);

  const handleCreateShoe = (e) => {
    e.preventDefault();
    if (!newShoeName.trim()) return;

    addShoe({
      name: newShoeName.trim(),
      currentKm: 0,
      maxKm: parseFloat(newShoeMaxKm) || 600
    });

    setNewShoeName('');
    setShowAddShoe(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/20">
        <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
          <HeartPulse className="w-4 h-4" />
          <span>Injury Prevention & Gear Health</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Recovery & Durability Command
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Muscles recover in 48 hours, but tendons, ligaments, and bones adapt over months. Keep your volume safe and rotate running shoes before cushioning compresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* 1. Soreness & Injury Risk Assessment */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Soreness & Hotspots</h3>
            <span className="text-[11px] font-semibold text-slate-400">Past 5 sessions</span>
          </div>

          {recentSorenessLogs.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white">No active soreness flagged!</p>
              <p className="text-slate-500 mt-0.5">Your body is handling the current training load smoothly.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSorenessLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      log.soreness <= 2 ? 'bg-emerald-400' : log.soreness <= 4 ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <div>
                      <span className="font-bold text-white">{log.sorenessLocation || 'General'}</span>
                      <span className="text-slate-500 ml-2 font-mono text-[11px]">{log.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Score:</span>
                    <span className="font-mono font-bold text-white">{log.soreness}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recovery Protocols */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based Recovery Protocol:</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
              <li><strong>Sleep 7.5–9 hours:</strong> 95% of tissue repair occurs during deep REM sleep.</li>
              <li><strong>Conversational Effort:</strong> Never race your easy runs; keeping HR under 70% accelerates capillary growth.</li>
              <li><strong>Calf & Foot Strength:</strong> 3 sets of 15 single-leg calf raises twice a week builds shin & achilles resilience.</li>
            </ul>
          </div>
        </div>

        {/* 2. Running Shoe Mileage Tracker */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Running Shoes & Foam Life</h3>
              <p className="text-xs text-slate-400">Replace shoes every 550–700 km to prevent joint shock</p>
            </div>
            <button
              onClick={() => setShowAddShoe(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shoes</span>
            </button>
          </div>

          {/* Add Shoe Mini Form */}
          {showAddShoe && (
            <form onSubmit={handleCreateShoe} className="p-3 rounded-xl bg-slate-950 border border-slate-700 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Shoe Model (e.g. Asics Novablast 4)"
                  value={newShoeName}
                  onChange={(e) => setNewShoeName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Max Lifespan km (600)"
                  value={newShoeMaxKm}
                  onChange={(e) => setNewShoeMaxKm(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddShoe(false)}
                  className="px-2.5 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-400 text-slate-950"
                >
                  Save Shoe
                </button>
              </div>
            </form>
          )}

          {/* Shoes List */}
          <div className="space-y-3">
            {shoes.map((shoe) => {
              const wearPercent = Math.min(100, Math.round((shoe.currentKm / shoe.maxKm) * 100));
              const isWarning = wearPercent >= 80;

              return (
                <div key={shoe.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Footprints className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">{shoe.name}</span>
                    </div>

                    <div className="text-slate-400 font-mono">
                      <span className="text-white font-bold">{shoe.currentKm}</span> / {shoe.maxKm} km ({wearPercent}%)
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        wearPercent >= 90
                          ? 'bg-rose-500'
                          : wearPercent >= 75
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${wearPercent}%` }}
                    />
                  </div>

                  {isWarning && (
                    <div className="text-[10px] text-amber-400 flex items-center space-x-1 pt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Shoe cushioning is 80%+ worn. Consider introducing a new pair for rotation.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
