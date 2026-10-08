import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { useTraining } from '../../context/TrainingContext';

export function WeeklyVolumeChart() {
  const { workouts, metrics } = useTraining();

  // Aggregate distance by ISO calendar weeks (last 6 weeks)
  const chartData = useMemo(() => {
    const weeksMap = {};
    const now = new Date();

    // Initialize past 6 weeks
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      
      // Get week Monday
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diff);

      const label = `${monday.getMonth() + 1}/${monday.getDate()}`;
      const key = monday.toISOString().split('T')[0];
      weeksMap[key] = {
        key,
        name: `Wk of ${label}`,
        distance: 0,
        runs: 0
      };
    }

    // Populate with workouts
    workouts.forEach(w => {
      const wDate = new Date(w.date);
      const day = wDate.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(wDate);
      monday.setDate(wDate.getDate() + diff);
      const key = monday.toISOString().split('T')[0];

      if (weeksMap[key]) {
        weeksMap[key].distance = Math.round((weeksMap[key].distance + parseFloat(w.distanceKm || 0)) * 10) / 10;
        weeksMap[key].runs += 1;
      }
    });

    return Object.values(weeksMap);
  }, [workouts]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-card h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white">Weekly Mileage Progression</h3>
          <p className="text-xs text-slate-400">Total kilometers logged each week</p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span className="text-slate-400">Logged (km)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded bg-amber-400" />
            <span className="text-slate-400">+10% Safe Cap</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="k" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 shadow-xl text-xs">
                      <p className="font-bold text-white mb-1">{data.name}</p>
                      <p className="text-emerald-400 font-mono font-semibold">{data.distance} km total</p>
                      <p className="text-slate-400">{data.runs} runs recorded</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {metrics.safeVolumeCeiling > 0 && (
              <ReferenceLine
                y={metrics.safeVolumeCeiling}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: '10% Cap', fill: '#f59e0b', fontSize: 10, position: 'top' }}
              />
            )}
            <Bar dataKey="distance" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
