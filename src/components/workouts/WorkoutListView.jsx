import React, { useState } from 'react';
import { Search, Filter, Trash2, Heart, Footprints, Calendar, ArrowUpDown, Watch } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { formatPace } from '../../services/tcxGpxParser';

export function WorkoutListView({ onOpenLogModal, onOpenUploadModal }) {
  const { workouts, deleteWorkout, shoes, clearAllWorkouts } = useTraining();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');

  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = (w.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (w.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = filterPhase === 'all' || w.phaseId === parseInt(filterPhase, 10);
    return matchesSearch && matchesPhase;
  });

  const getShoeName = (shoeId) => {
    const s = shoes.find(item => item.id === shoeId);
    return s ? s.name : 'Standard Shoes';
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl glass-card">
        <div>
          <h2 className="text-lg font-bold text-white">Activity Log & Workout History</h2>
          <p className="text-xs text-slate-400">All recorded runs from Fitbit, Strava, and manual logs</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
            />
          </div>

          {/* Phase Filter */}
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Phases</option>
            <option value="1">Phase 1 (Walk-Run)</option>
            <option value="2">Phase 2 (5K)</option>
            <option value="3">Phase 3 (10K)</option>
            <option value="4">Phase 4 (Half Build)</option>
            <option value="5">Phase 5 (Taper)</option>
          </select>

          {/* Clear Demo Data Button */}
          {workouts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear demo workouts to start fresh with your real runs?")) {
                  clearAllWorkouts();
                }
              }}
              className="hidden sm:inline-block px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 transition-colors"
              title="Clear sample data"
            >
              Clear Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Workout Table / Card List */}
      {filteredWorkouts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card space-y-3">
          <Footprints className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No workouts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log your first walk-run session or upload a Fitbit TCX/GPX file to see your stats come alive.
          </p>
          <div className="flex justify-center space-x-2 pt-2">
            <button
              onClick={onOpenLogModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              Log Run
            </button>
            <button
              onClick={onOpenUploadModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Upload Fitbit File
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredWorkouts.map((w) => (
            <div
              key={w.id}
              className="p-3.5 sm:p-4 rounded-xl glass-card hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Info */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {w.source === 'fitbit' ? (
                    <Watch className="w-5 h-5 text-teal-400" title="Fitbit Activity" />
                  ) : w.source === 'strava' ? (
                    <span className="text-orange-400 font-bold font-mono text-xs">STR</span>
                  ) : (
                    <Footprints className="w-5 h-5 text-emerald-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-400">{w.date}</span>
                    <span className="text-xs text-slate-600">&bull;</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {w.type || 'Run'}
                    </span>
                    {w.source && (
                      <span className="text-[10px] text-teal-400 font-mono">
                        via {w.source}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mt-0.5">{w.title}</h3>

                  {w.notes && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                      "{w.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Stats */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                <div className="text-left sm:text-right">
                  <div className="text-base sm:text-lg font-bold font-mono text-white">
                    {w.distanceKm} <span className="text-xs text-slate-400 font-normal">km</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {w.durationMin} mins &bull; {formatPace(w.avgPaceSec)}
                  </div>
                </div>

                {w.avgHeartRate ? (
                  <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-mono">
                    <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                    <span>{w.avgHeartRate} bpm</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 font-mono">-- bpm</div>
                )}

                {/* Soreness Pill */}
                {w.soreness !== undefined && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    w.soreness <= 2
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                      : w.soreness <= 4
                      ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                      : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                  }`}>
                    Soreness {w.soreness}/10
                  </span>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${w.title}"?`)) {
                      deleteWorkout(w.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Delete workout"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
