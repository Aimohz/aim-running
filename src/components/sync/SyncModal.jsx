import React, { useState, useRef } from 'react';
import { X, Download, Upload, Cloud, RefreshCw, CheckCircle2, ExternalLink, HardDrive, Smartphone, Laptop } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { parseImportBackup } from '../../services/storageService';

export function SyncModal({ isOpen, onClose }) {
  const { downloadBackup, importBackup, settings, updateSettings, showToast } = useTraining();
  
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(settings.supabaseKey || '');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImportFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseImportBackup(text);
        importBackup(parsed);
        onClose();
      } catch (err) {
        alert("Failed to restore backup: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    updateSettings({
      supabaseUrl,
      supabaseKey,
      cloudSyncEnabled: !!(supabaseUrl && supabaseKey)
    });
    showToast("Supabase cloud connection saved!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cloud Sync & Cross-Device Access</h3>
              <p className="text-[11px] text-slate-400">Sync between Phone and Laptop &bull; 100% Free Forever</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Method 1: Google Drive / OneDrive 1-Click Backup */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Option A: Google Drive / OneDrive File Backup (Instant & Zero Setup)
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your entire training journey (all workouts, mileage, shoe wear, and unlocked milestones) in one portable file. Save it directly to your Google Drive or OneDrive folder.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={downloadBackup}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup (.JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore / Import Backup</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImportFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          {/* Method 2: Free Supabase Real-Time Cloud Sync */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Option B: Free Supabase Cloud Database (Live Phone $\leftrightarrow$ Laptop Sync)
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For automatic background syncing whenever you log runs on your phone or laptop. Supabase is 100% free with your GitHub account:
            </p>

            <ol className="text-[11px] text-slate-300 list-decimal list-inside space-y-1">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a> (log in with GitHub).</li>
              <li>Go to <strong>Project Settings &rarr; API</strong> and copy your Project URL & Anon Key.</li>
              <li>Paste them below:</li>
            </ol>

            <form onSubmit={handleSaveSupabase} className="space-y-2 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Supabase Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors"
                >
                  Save Cloud Credentials
                </button>
              </div>
            </form>
          </div>

          {/* Method 3: Fitbit -> Strava official auto-sync guide */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-orange-400 font-bold font-mono text-xs">Fitbit &rarr; Strava</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Official Fitbit Automatic Sync
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fitbit officially connects to Strava for free. Every workout you record on your Fitbit watch will automatically arrive in Strava within 15 seconds!
            </p>
            <a
              href="https://strava.fitbit.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-400 hover:underline pt-1"
            >
              <span>Link Fitbit to Strava at strava.fitbit.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
