import React from 'react';
import { Play, Sparkles, Clock, MapPin, Check } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function UpcomingWorkouts({ onLogSpecificWorkout }) {
  const { metrics } = useTraining();
  const phase = metrics.activePhase;

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white">Suggested Workouts for {phase.weeksLabel}</h3>
          <p className="text-xs text-slate-400">Recommended syllabus for your current phase</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
          Target: 3-4x / wk
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phase.sampleWorkouts.map((w, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {w.type}
                </span>
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                  <span>{w.distance} km</span>
                  <span>&bull;</span>
                  <span>{w.duration} min</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{w.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{w.description}</p>
            </div>

            <button
              onClick={() => onLogSpecificWorkout(w)}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Play className="w-3 h-3 fill-emerald-400" />
              <span>Log this Session</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
