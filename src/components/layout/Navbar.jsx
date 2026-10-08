import React from 'react';
import { Flame, Plus, Upload, Calendar, RefreshCw, Zap } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function Navbar({ onOpenLogModal, onOpenUploadModal, onOpenSyncModal }) {
  const { metrics, settings } = useTraining();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-extrabold tracking-tighter text-slate-950 text-xl font-mono">AiM</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">AiM Running</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                52-Wk Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Return to Running &bull; Half Marathon Build</p>
          </div>
        </div>

        {/* Race Countdown Banner */}
        <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Goal: <strong className="text-white">{settings.targetRaceName || "Half Marathon"}</strong>
          </span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-emerald-400 font-mono font-bold">
            {metrics.daysToRace} days left ({metrics.weeksToRace} wks)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cloud & Backup Sync */}
          <button
            onClick={onOpenSyncModal}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center space-x-1.5"
            title="Cloud & Drive Sync"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sync & Cloud</span>
          </button>

          {/* Upload Fitbit TCX/GPX */}
          <button
            onClick={onOpenUploadModal}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/50 rounded-lg transition-colors flex items-center space-x-1.5"
            title="Upload Fitbit File"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Fitbit</span>
          </button>

          {/* Quick Manual Log */}
          <button
            onClick={onOpenLogModal}
            className="px-3 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Run</span>
          </button>
        </div>

      </div>
    </header>
  );
}
