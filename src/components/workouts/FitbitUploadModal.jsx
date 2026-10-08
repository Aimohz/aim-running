import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Watch, ArrowRight } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { parseActivityFile, formatPace } from '../../services/tcxGpxParser';

export function FitbitUploadModal({ isOpen, onClose }) {
  const { addWorkout, shoes, activePhaseId } = useTraining();
  
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [workoutType, setWorkoutType] = useState('Walk-Run');
  const [selectedShoe, setSelectedShoe] = useState(shoes[0]?.id || '');
  const [workoutTitle, setWorkoutTitle] = useState('');
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const result = parseActivityFile(text, file.name);
        setParsedData(result);
        setWorkoutTitle(`Fitbit: ${result.distanceKm} km Run`);
      } catch (err) {
        setErrorMsg(`Failed to parse file: ${err.message}`);
        setParsedData(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading file from disk.");
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!parsedData) return;

    addWorkout({
      date: parsedData.date,
      title: workoutTitle || `Fitbit ${parsedData.format.toUpperCase()} Run`,
      phaseId: activePhaseId,
      type: workoutType,
      distanceKm: parsedData.distanceKm,
      durationMin: parsedData.durationMin,
      avgPaceSec: parsedData.avgPaceSec,
      avgHeartRate: parsedData.avgHeartRate,
      maxHeartRate: parsedData.maxHeartRate,
      rpe: 6,
      soreness: 1,
      sorenessLocation: "None",
      shoeId: selectedShoe,
      source: "fitbit",
      notes: `Imported from Fitbit ${parsedData.fileName} (${parsedData.sampleCount} HR points).`
    });

    // Reset and close
    setParsedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Watch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Fitbit Activity</h3>
              <p className="text-[11px] text-slate-400">Direct TCX / GPX file parser (zero API setup)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          
          {/* How to export tip */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">How to export from Fitbit:</div>
            <p className="text-[11px] leading-relaxed">
              Log in at <strong>fitbit.com</strong> &rarr; Click <strong>Log &rarr; Activities</strong> &rarr; Click your run &rarr; Click the <strong>gear icon (&bull;&bull;&bull;) &rarr; Export as TCX</strong>. Drop that file below!
            </p>
          </div>

          {/* Drag & drop box */}
          {!parsedData && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : 'border-slate-700 bg-slate-950/60 hover:border-slate-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".tcx,.gpx,application/xml,text/xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Drag & drop your Fitbit .TCX or .GPX file here</p>
              <p className="text-[11px] text-slate-400 mt-1">or click to browse your computer</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Card */}
          {parsedData && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Activity Parsed Successfully!</span>
                </div>
                <span className="font-mono text-slate-400">{parsedData.fileName}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Distance</div>
                  <div className="text-sm font-bold font-mono text-white">{parsedData.distanceKm} km</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Duration</div>
                  <div className="text-sm font-bold font-mono text-white">{parsedData.durationMin} min</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Avg Pace</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">{formatPace(parsedData.avgPaceSec)}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Avg Heart Rate</div>
                  <div className="text-sm font-bold font-mono text-rose-400">
                    {parsedData.avgHeartRate ? `${parsedData.avgHeartRate} bpm` : '--'}
                  </div>
                </div>
              </div>

              {/* Title & Workout Type */}
              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Workout Type</label>
                    <select
                      value={workoutType}
                      onChange={(e) => setWorkoutType(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Walk-Run">Walk-Run</option>
                      <option value="Easy Run">Easy Aerobic</option>
                      <option value="Long Run">Long Run</option>
                      <option value="Tempo Run">Tempo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shoe</label>
                    <select
                      value={selectedShoe}
                      onChange={(e) => setSelectedShoe(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      {shoes.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Confirm or Cancel upload */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setParsedData(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Choose Another
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Add to Log
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
