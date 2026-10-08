import React from 'react';
import { Heart, Info } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

export function HeartRateChart() {
  const { metrics, settings } = useTraining();
  const maxHr = settings.maxHeartRate || 185;
  const counts = metrics.hrZoneCounts;
  const totalMin = counts.z1 + counts.z2 + counts.z3 + counts.z4 + counts.z5 || 1;

  const zones = [
    {
      id: 'z1',
      name: 'Zone 1: Active Recovery',
      range: `< ${Math.round(maxHr * 0.60)} bpm (<60%)`,
      minutes: Math.round(counts.z1),
      percent: Math.round((counts.z1 / totalMin) * 100),
      color: 'bg-blue-400',
      textColor: 'text-blue-400'
    },
    {
      id: 'z2',
      name: 'Zone 2: Aerobic Base (Target 80%)',
      range: `${Math.round(maxHr * 0.60)} – ${Math.round(maxHr * 0.70)} bpm (60-70%)`,
      minutes: Math.round(counts.z2),
      percent: Math.round((counts.z2 / totalMin) * 100),
      color: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      isKey: true
    },
    {
      id: 'z3',
      name: 'Zone 3: Tempo / Aerobic',
      range: `${Math.round(maxHr * 0.70)} – ${Math.round(maxHr * 0.80)} bpm (70-80%)`,
      minutes: Math.round(counts.z3),
      percent: Math.round((counts.z3 / totalMin) * 100),
      color: 'bg-yellow-400',
      textColor: 'text-yellow-400'
    },
    {
      id: 'z4',
      name: 'Zone 4: Threshold',
      range: `${Math.round(maxHr * 0.80)} – ${Math.round(maxHr * 0.90)} bpm (80-90%)`,
      minutes: Math.round(counts.z4),
      percent: Math.round((counts.z4 / totalMin) * 100),
      color: 'bg-orange-400',
      textColor: 'text-orange-400'
    },
    {
      id: 'z5',
      name: 'Zone 5: Anaerobic Max',
      range: `> ${Math.round(maxHr * 0.90)} bpm (>90%)`,
      minutes: Math.round(counts.z5),
      percent: Math.round((counts.z5 / totalMin) * 100),
      color: 'bg-red-400',
      textColor: 'text-red-400'
    }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <h3 className="text-sm font-bold text-white">Heart Rate Zone Distribution</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
              Fitbit HR
            </span>
          </div>
          <p className="text-xs text-slate-400">Targeting 80% in Zone 2 to build aerobic mitochondria</p>
        </div>
        <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
      </div>

      <div className="space-y-3 mt-1">
        {zones.map(z => (
          <div key={z.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${z.isKey ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                {z.name}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-[11px] font-mono">{z.range}</span>
                <span className="font-mono text-white font-bold">{z.percent}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${z.color}`}
                style={{ width: `${z.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Coach Tip:</strong> Running too fast in training causes premature fatigue and injury. If your heart rate enters Zone 3 or 4 during an easy day, slow down to a walk until it drops!
        </span>
      </div>
    </div>
  );
}
