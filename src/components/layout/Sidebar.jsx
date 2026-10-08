import React from 'react';
import { LayoutDashboard, Map, Activity, HeartPulse, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function Sidebar({ currentTab, setCurrentTab }) {
  const { metrics } = useTraining();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: '52-Wk Roadmap', icon: Map, badge: `Phase ${metrics.activePhase.id}` },
    { id: 'workouts', label: 'Activity Log', icon: Activity, count: metrics.sortedWorkouts.length },
    { id: 'recovery', label: 'Recovery & Gear', icon: HeartPulse, alert: metrics.is10PercentExceeded },
    { id: 'settings', label: 'Settings & Goals', icon: Settings }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 p-4 hidden md:flex flex-col justify-between shrink-0">
      <div>
        {/* User Card */}
        <div className="p-3 mb-6 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            🏃
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate">Runner Profile</h3>
            <p className="text-xs text-slate-400 truncate">Phase {metrics.activePhase.id}: {metrics.activePhase.weeksLabel}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-mono">
                    {item.count}
                  </span>
                )}

                {item.alert && (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety Guideline Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The 10% Golden Rule</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Never increase weekly mileage by more than 10% over the previous week to safeguard tendons & joints.
        </p>
      </div>
    </aside>
  );
}
