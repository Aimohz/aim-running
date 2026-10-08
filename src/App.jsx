import React, { useState } from 'react';
import { TrainingProvider, useTraining } from './context/TrainingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { WorkoutListView } from './components/workouts/WorkoutListView';
import { RecoveryHubView } from './components/recovery/RecoveryHubView';
import { SettingsView } from './components/settings/SettingsView';
import { LogWorkoutModal } from './components/workouts/LogWorkoutModal';
import { FitbitUploadModal } from './components/workouts/FitbitUploadModal';
import { SyncModal } from './components/sync/SyncModal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [presetWorkout, setPresetWorkout] = useState(null);

  const { toastMessage } = useTraining();

  const handleLogSpecificWorkout = (workout) => {
    setPresetWorkout(workout);
    setIsLogModalOpen(true);
  };

  const handleOpenLogModal = () => {
    setPresetWorkout(null);
    setIsLogModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenLogModal={handleOpenLogModal}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onGoToRoadmap={() => setCurrentTab('roadmap')}
              onLogSpecificWorkout={handleLogSpecificWorkout}
            />
          )}

          {currentTab === 'roadmap' && <RoadmapView />}

          {currentTab === 'workouts' && (
            <WorkoutListView
              onOpenLogModal={handleOpenLogModal}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          )}

          {currentTab === 'recovery' && <RecoveryHubView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogModal={handleOpenLogModal}
      />

      {/* Modals */}
      <LogWorkoutModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialData={presetWorkout}
      />

      <FitbitUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <TrainingProvider>
      <AppContent />
    </TrainingProvider>
  );
}
