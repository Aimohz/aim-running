import React, { useState } from 'react';
import { Settings, Calendar, Heart, Award, RefreshCcw, Save, ExternalLink } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { formatPace } from '../../services/tcxGpxParser';

export function SettingsView() {
  const { settings, updateSettings, showToast, clearAllWorkouts, restoreSampleData } = useTraining();

  const [raceName, setRaceName] = useState(settings.targetRaceName || 'City Half Marathon');
  const [raceDate, setRaceDate] = useState(settings.targetRaceDate || '2027-10-10');
  const [goalTime, setGoalTime] = useState(settings.targetGoalTime || '02:15:00');
  const [maxHr, setMaxHr] = useState(settings.maxHeartRate?.toString() || '185');
  const [restingHr, setRestingHr] = useState(settings.restingHeartRate?.toString() || '62');

  // Calculate required half marathon pace for goal time
  const calculateRequiredPace = (timeStr) => {
    try {
      const parts = timeStr.split(':').map(Number);
      if (parts.length === 3) {
        const totalSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        const paceSec = Math.round(totalSec / 21.0975);
        return formatPace(paceSec);
      }
    } catch {
      return "--:--";
    }
    return "--:--";
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      targetRaceName: raceName,
      targetRaceDate: raceDate,
      targetGoalTime: goalTime,
      maxHeartRate: parseInt(maxHr, 10) || 185,
      restingHeartRate: parseInt(restingHr, 10) || 62
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Profile & Target Parameters</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Race Targets & Physiological Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tune your half marathon target date and heart rate zones to ensure tailored load monitoring.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Race Goal Settings */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Half Marathon Event Targets</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Name</label>
              <input
                type="text"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Race Date</label>
              <input
                type="date"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Time (HH:MM:SS)</label>
              <input
                type="text"
                placeholder="02:15:00"
                value={goalTime}
                onChange={(e) => setGoalTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="block text-[11px] text-emerald-400 font-mono mt-1">
                Required Pace: {calculateRequiredPace(goalTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Heart Rate Zones */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Fitbit Heart Rate Calibration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Heart Rate (bpm)</label>
              <input
                type="number"
                value={maxHr}
                onChange={(e) => setMaxHr(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Default rule of thumb: 220 minus your age.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Checked from your Fitbit morning sleep summary.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

      {/* Data Management Section */}
      <div className="p-5 rounded-2xl glass-card space-y-4 border border-slate-800">
        <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
          <RefreshCcw className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Data Management & Reset</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The dashboard is currently loaded with <strong>starter sample runs</strong> to demonstrate how charts, heart rate zones, and shoe wear look. Whenever you are ready to track your own real journey, you can clear the sample data with one click!
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you ready to clear all sample demo workouts and start tracking your real runs?")) {
                clearAllWorkouts();
              }
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center space-x-1.5 transition-colors"
          >
            <span>Clear Demo Data (Start Fresh)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reload demo sample data? This will reset the starter workouts.")) {
                restoreSampleData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Reload Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
