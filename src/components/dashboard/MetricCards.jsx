import React from 'react';
import { Gauge, ShieldCheck, ShieldAlert, Award, Compass, TrendingUp, CalendarDays } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function MetricCards() {
  const { metrics, settings } = useTraining();

  const isSafe = !metrics.is10PercentExceeded;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 1. This Week's Volume */}
      <div className="p-4 rounded-2xl glass-card relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">This Week</span>
          <CalendarDays className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{metrics.currentWeekKm}</span>
          <span className="text-xs font-semibold text-slate-400">km</span>
        </div>
        <div className="mt-2 flex items-center text-xs">
          <span className="text-slate-400">Last wk: {metrics.prevWeekKm} km</span>
          {metrics.prevWeekKm > 0 && (
            <span className={`ml-2 font-mono font-semibold ${metrics.percentChange >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {metrics.percentChange > 0 ? `+${metrics.percentChange}%` : `${metrics.percentChange}%`}
            </span>
          )}
        </div>
      </div>

      {/* 2. 10% Safe Workload Gauge */}
      <div className={`p-4 rounded-2xl glass-card relative overflow-hidden border ${
        isSafe ? 'border-emerald-500/20' : 'border-amber-500/40 bg-amber-950/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">10% Safe Rule</span>
          {isSafe ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
          )}
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.safeVolumeCeiling}
          </span>
          <span className="text-xs font-semibold text-slate-400">km max</span>
        </div>
        <div className="mt-2 text-xs">
          {isSafe ? (
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <span>Within safe load</span>
            </span>
          ) : (
            <span className="text-amber-400 font-medium">
              Over +10% limit! Deload recommended.
            </span>
          )}
        </div>
      </div>

      {/* 3. Longest Run to Date */}
      <div className="p-4 rounded-2xl glass-card relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Longest Run</span>
          <Award className="w-4 h-4 text-teal-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{metrics.longestRunKm}</span>
          <span className="text-xs font-semibold text-slate-400">/ 21.1 km</span>
        </div>
        <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (metrics.longestRunKm / 21.1) * 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Total Volume & Workouts */}
      <div className="p-4 rounded-2xl glass-card relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Progress</span>
          <TrendingUp className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{metrics.totalLifetimeKm}</span>
          <span className="text-xs font-semibold text-slate-400">km logged</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Across <span className="text-slate-200 font-semibold">{metrics.sortedWorkouts.length}</span> recorded sessions
        </div>
      </div>

    </div>
  );
}
