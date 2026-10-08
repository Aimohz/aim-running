import React from 'react';
import { LayoutDashboard, Map, Activity, HeartPulse, Plus } from 'lucide-react';

export function BottomNav({ currentTab, setCurrentTab, onOpenLogModal }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'action', isAction: true },
    { id: 'workouts', label: 'History', icon: Activity },
    { id: 'recovery', label: 'Recovery', icon: HeartPulse }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {items.map(item => {
          if (item.isAction) {
            return (
              <button
                key="log-btn"
                onClick={onOpenLogModal}
                className="w-12 h-12 -mt-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-slate-950 active:scale-95 transition-transform"
                title="Log Run"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
