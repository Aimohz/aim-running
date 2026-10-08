import React from 'react';
import { CheckCircle2, Circle, Lock, Unlock, Sparkles, AlertCircle, Compass, Award } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { TRAINING_PHASES } from '../../data/trainingPlan';

export function RoadmapView() {
  const { activePhaseId, completedMilestones, toggleMilestone, setActivePhaseId } = useTraining();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>52-Week Periodized Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Couch to 21.1 km Half Marathon
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Unlock each phase by achieving its physiological milestone. If life, travel, or fatigue interrupts your schedule, stay in your current phase until ready—no calendar guilt.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Milestones</div>
              <div className="text-lg font-bold font-mono text-white">
                {completedMilestones.length} <span className="text-xs text-slate-500 font-normal">/ 15 Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Phases List */}
      <div className="space-y-4">
        {TRAINING_PHASES.map((phase) => {
          const isActive = phase.id === activePhaseId;
          const isUnlocked = phase.id <= activePhaseId;
          const phaseCompleted = phase.criteria.every(c => completedMilestones.includes(c.id));

          return (
            <div
              key={phase.id}
              className={`rounded-2xl transition-all border overflow-hidden ${
                isActive
                  ? 'bg-slate-900/70 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : isUnlocked
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-75'
              }`}
            >
              {/* Phase Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold font-mono text-sm ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : phaseCompleted
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    P{phase.id}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {phase.weeksLabel}
                      </span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-xs text-emerald-400 font-mono font-medium">
                        {phase.targetMileage}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active Phase
                    </span>
                  ) : (
                    <button
                      onClick={() => setActivePhaseId(phase.id)}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>

              {/* Phase Details & Checklist */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Physiological Focus:</strong> {phase.overview}
                </div>

                {/* Milestone Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Phase Unlock Criteria:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {phase.criteria.map((c) => {
                      const isDone = completedMilestones.includes(c.id);

                      return (
                        <div
                          key={c.id}
                          onClick={() => toggleMilestone(c.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                            isDone
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-white'
                              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                            )}
                          </div>
                          <div className="text-xs leading-snug">
                            <span className={isDone ? 'line-through text-slate-400' : 'text-slate-200'}>
                              {c.text}
                            </span>
                            {c.isFinalGate && (
                              <span className="block text-[10px] text-amber-400 font-semibold mt-1">
                                🔑 Final Gate Requirement
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase Sample Workouts */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Core Workouts in this Phase:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {phase.sampleWorkouts.map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs">
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>{w.name}</span>
                          <span className="font-mono text-emerald-400 text-[11px]">{w.distance} km</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{w.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
