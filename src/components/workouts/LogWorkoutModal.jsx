import React, { useState } from 'react';
import { X, Footprints, Heart, Gauge, AlertCircle, Sparkles } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { formatPace } from '../../services/tcxGpxParser';

export function LogWorkoutModal({ isOpen, onClose, initialData = null }) {
  const { addWorkout, shoes, activePhaseId } = useTraining();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState(initialData?.name || 'Aerobic Session');
  const [type, setType] = useState(initialData?.type || 'Walk-Run');
  const [distanceKm, setDistanceKm] = useState(initialData?.distance?.toString() || '3.0');
  const [durationMin, setDurationMin] = useState(initialData?.duration?.toString() || '30');
  const [avgHeartRate, setAvgHeartRate] = useState('142');
  const [rpe, setRpe] = useState(5); // 1-10
  const [soreness, setSoreness] = useState(1); // 0-10
  const [sorenessLocation, setSorenessLocation] = useState('None');
  const [shoeId, setShoeId] = useState(shoes[0]?.id || '');
  const [notes, setNotes] = useState(initialData?.description || '');

  if (!isOpen) return null;

  // Calculate live pace
  const distNum = parseFloat(distanceKm) || 0;
  const durNum = parseFloat(durationMin) || 0;
  const paceSec = distNum > 0 && durNum > 0 ? Math.round((durNum * 60) / distNum) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (distNum <= 0 || durNum <= 0) {
      alert("Please enter a valid distance and duration.");
      return;
    }

    addWorkout({
      date,
      title: title || 'Running Workout',
      phaseId: activePhaseId,
      type,
      distanceKm: distNum,
      durationMin: durNum,
      avgPaceSec: paceSec,
      avgHeartRate: avgHeartRate ? parseInt(avgHeartRate, 10) : null,
      rpe: parseInt(rpe, 10),
      soreness: parseInt(soreness, 10),
      sorenessLocation,
      shoeId,
      source: 'manual',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Log Running Session</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Workout Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Walk-Run">Walk-Run Intervals</option>
                <option value="Easy Run">Easy Aerobic (Zone 2)</option>
                <option value="Long Run">Long Run</option>
                <option value="Tempo Run">Tempo / Pace Run</option>
                <option value="Milestone Run">Milestone Test</option>
                <option value="Race">Half Marathon Race</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Workout Name</label>
            <input
              type="text"
              placeholder="e.g. 5x 2m Run / 2m Walk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Distance & Time & Live Pace */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration (min)</label>
              <input
                type="number"
                step="1"
                min="1"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Avg Pace</label>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 font-mono font-bold">
                {formatPace(paceSec)}
              </div>
            </div>
          </div>

          {/* Heart Rate & Effort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avg Heart Rate (Fitbit bpm)</label>
              <input
                type="number"
                placeholder="e.g. 142"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Perceived Effort (RPE {rpe}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                className="w-full accent-emerald-400 mt-2"
              />
            </div>
          </div>

          {/* Recovery Check: Soreness */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Body Soreness & Pain: {soreness}/10</span>
              <span className={`text-[10px] font-bold ${
                soreness <= 2 ? 'text-emerald-400' : soreness <= 4 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {soreness === 0 ? 'Fresh' : soreness <= 2 ? 'Mild' : soreness <= 5 ? 'Moderate' : 'Caution'}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              value={soreness}
              onChange={(e) => setSoreness(e.target.value)}
              className="w-full accent-amber-400"
            />

            {soreness > 0 && (
              <div className="pt-1">
                <label className="block text-[11px] text-slate-400 mb-1">Location of Soreness</label>
                <select
                  value={sorenessLocation}
                  onChange={(e) => setSorenessLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="None">None / General</option>
                  <option value="Calves">Calves</option>
                  <option value="Shins">Shins (Tibialis)</option>
                  <option value="Knees">Knees</option>
                  <option value="Hamstrings">Hamstrings</option>
                  <option value="IT Band">IT Band / Outer Hip</option>
                  <option value="Plantar / Foot">Plantar Fascia / Foot Arch</option>
                  <option value="Achilles">Achilles Tendon</option>
                </select>
              </div>
            )}
          </div>

          {/* Shoes */}
          {shoes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Shoes Used</label>
              <select
                value={shoeId}
                onChange={(e) => setShoeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {shoes.map(shoe => (
                  <option key={shoe.id} value={shoe.id}>
                    {shoe.name} ({shoe.currentKm} / {shoe.maxKm} km)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / How you felt</label>
            <textarea
              rows="2"
              placeholder="e.g. Kept conversational pace throughout, no breathing strain."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Save Workout
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
