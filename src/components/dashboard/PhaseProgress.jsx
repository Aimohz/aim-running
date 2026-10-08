import React from 'react';
import { CheckCircle2, Lock, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { TRAINING_PHASES } from '../../data/trainingPlan';

export function PhaseProgress({ onGoToRoadmap }) {
  const { activePhaseId, completedMilestones, setActivePhaseId } = useTraining();

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl glass-panel relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Roadmap Progression</span>
            <span className="text-xs text-slate-500">&bull;</span>
            <span className="text-xs text-slate-300">Phase {activePhaseId} of 5</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            {TRAINING_PHASES[activePhaseId - 1]?.title}
          </h2>
        </div>

        <button
          onClick={onGoToRoadmap}
          className="self-start sm:self-auto text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 group"
        >
          <span>View Syllabus & Milestones</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 5-Step Visual Track */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {TRAINING_PHASES.map((phase) => {
          const isCurrent = phase.id === activePhaseId;
          const isPast = phase.id < activePhaseId;
          const isLocked = phase.id > activePhaseId;

          // Check if all criteria in phase are done
          const allCompleted = phase.criteria.every(c => completedMilestones.includes(c.id));

          return (
            <div
              key={phase.id}
              onClick={() => setActivePhaseId(phase.id)}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer text-left ${
                isCurrent
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : isPast
                  ? 'bg-slate-900/50 border-emerald-500/20 text-slate-400 hover:border-emerald-500/40'
                  : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase font-mono ${
                  isCurrent ? 'text-emerald-400' : isPast ? 'text-teal-400' : 'text-slate-500'
                }`}>
                  P{phase.id}
                </span>

                {isPast || allCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div className="text-xs font-bold text-white truncate">
                {phase.id === 1 ? 'Walk-Run' : phase.id === 2 ? '5K Build' : phase.id === 3 ? '10K Base' : phase.id === 4 ? '18K Peak' : '21.1K Race'}
              </div>

              <div className="text-[10px] text-slate-400 hidden sm:block truncate">
                {phase.weeksLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Milestone Box */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 text-xs overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
          <span className="text-slate-400 shrink-0">Current Gate:</span>
          <span className="font-semibold text-slate-200 truncate">
            {TRAINING_PHASES[activePhaseId - 1]?.unlockMilestone}
          </span>
        </div>

        <button
          onClick={onGoToRoadmap}
          className="text-[11px] font-semibold text-emerald-400 hover:underline shrink-0 ml-3"
        >
          Check Off &rarr;
        </button>
      </div>
    </div>
  );
}
