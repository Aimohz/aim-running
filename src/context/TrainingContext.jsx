import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { loadStoredData, saveStoredData, exportBackupFile } from '../services/storageService';
import { TRAINING_PHASES } from '../data/trainingPlan';

const TrainingContext = createContext(null);

export function TrainingProvider({ children }) {
  const [data, setData] = useState(() => loadStoredData());
  const [toastMessage, setToastMessage] = useState(null);

  // Sync back to local storage whenever state changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add Workout & update shoe mileage
  const addWorkout = (newWorkout) => {
    const workoutWithId = {
      ...newWorkout,
      id: newWorkout.id || `run-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setData(prev => {
      const updatedWorkouts = [workoutWithId, ...prev.workouts];
      
      // Update shoe mileage if shoe assigned
      let updatedShoes = prev.shoes;
      if (newWorkout.shoeId && newWorkout.distanceKm) {
        updatedShoes = prev.shoes.map(shoe => {
          if (shoe.id === newWorkout.shoeId) {
            return {
              ...shoe,
              currentKm: Math.round((shoe.currentKm + parseFloat(newWorkout.distanceKm)) * 10) / 10
            };
          }
          return shoe;
        });
      }

      return {
        ...prev,
        workouts: updatedWorkouts,
        shoes: updatedShoes
      };
    });

    showToast(`Logged "${workoutWithId.title || 'Workout'}" (${newWorkout.distanceKm} km)!`);
  };

  // Delete Workout
  const deleteWorkout = (workoutId) => {
    setData(prev => {
      const target = prev.workouts.find(w => w.id === workoutId);
      let updatedShoes = prev.shoes;
      if (target && target.shoeId && target.distanceKm) {
        updatedShoes = prev.shoes.map(shoe => {
          if (shoe.id === target.shoeId) {
            return {
              ...shoe,
              currentKm: Math.max(0, Math.round((shoe.currentKm - parseFloat(target.distanceKm)) * 10) / 10)
            };
          }
          return shoe;
        });
      }

      return {
        ...prev,
        workouts: prev.workouts.filter(w => w.id !== workoutId),
        shoes: updatedShoes
      };
    });
    showToast("Workout removed.");
  };

  // Toggle milestone completion
  const toggleMilestone = (milestoneId) => {
    setData(prev => {
      const isCompleted = prev.completedMilestones.includes(milestoneId);
      const nextCompleted = isCompleted
        ? prev.completedMilestones.filter(id => id !== milestoneId)
        : [...prev.completedMilestones, milestoneId];

      if (!isCompleted) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas unavailable
        }
        showToast("Milestone unlocked! Great progress! 🎉");
      }

      return {
        ...prev,
        completedMilestones: nextCompleted
      };
    });
  };

  const setActivePhaseId = (phaseId) => {
    setData(prev => ({ ...prev, activePhaseId: phaseId }));
  };

  const updateSettings = (updates) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
    showToast("Settings updated.");
  };

  const addShoe = (newShoe) => {
    const shoeWithId = {
      ...newShoe,
      id: `shoe-${Date.now()}`,
      currentKm: parseFloat(newShoe.currentKm || 0)
    };
    setData(prev => ({
      ...prev,
      shoes: [...prev.shoes, shoeWithId]
    }));
    showToast(`Added shoe "${newShoe.name}"!`);
  };

  const clearAllWorkouts = () => {
    setData(prev => ({
      ...prev,
      workouts: [],
      shoes: prev.shoes.map(s => ({ ...s, currentKm: 0 })),
      completedMilestones: []
    }));
    showToast("Cleared all workouts. Ready for your real data! 🏃");
  };

  const restoreSampleData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const importBackup = (importedData) => {
    setData({
      workouts: importedData.workouts || [],
      shoes: importedData.shoes || [],
      settings: importedData.settings || data.settings,
      completedMilestones: importedData.completedMilestones || [],
      activePhaseId: importedData.activePhaseId || 1
    });
    showToast("Backup imported successfully!");
  };

  const downloadBackup = () => {
    exportBackupFile(data);
    showToast("Backup downloaded! You can upload this to Google Drive or OneDrive.");
  };

  // Computed metrics
  const computedMetrics = useMemo(() => {
    const now = new Date();
    
    // Sort workouts newest first
    const sortedWorkouts = [...data.workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate current week (Monday to Sunday) & previous week
    const currentDay = now.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + diffToMonday);
    thisMonday.setHours(0, 0, 0, 0);

    const prevMonday = new Date(thisMonday);
    prevMonday.setDate(thisMonday.getDate() - 7);
    const prevSunday = new Date(thisMonday);
    prevSunday.setMilliseconds(-1);

    let currentWeekKm = 0;
    let prevWeekKm = 0;
    let currentWeekRuns = 0;
    let longestRunKm = 0;
    let totalLifetimeKm = 0;
    let totalDurationMin = 0;

    // Heart rate zone breakdown (Zone 1-5)
    // Zone 1: 50-60%, Zone 2: 60-70%, Zone 3: 70-80%, Zone 4: 80-90%, Zone 5: 90-100%
    const maxHr = data.settings.maxHeartRate || 185;
    const hrZoneCounts = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };

    sortedWorkouts.forEach(w => {
      const dist = parseFloat(w.distanceKm) || 0;
      const dur = parseFloat(w.durationMin) || 0;
      const workoutDate = new Date(w.date);

      totalLifetimeKm += dist;
      totalDurationMin += dur;
      if (dist > longestRunKm) longestRunKm = dist;

      if (workoutDate >= thisMonday) {
        currentWeekKm += dist;
        currentWeekRuns += 1;
      } else if (workoutDate >= prevMonday && workoutDate <= prevSunday) {
        prevWeekKm += dist;
      }

      // HR zones
      if (w.avgHeartRate) {
        const pct = w.avgHeartRate / maxHr;
        if (pct < 0.60) hrZoneCounts.z1 += dur;
        else if (pct < 0.70) hrZoneCounts.z2 += dur;
        else if (pct < 0.80) hrZoneCounts.z3 += dur;
        else if (pct < 0.90) hrZoneCounts.z4 += dur;
        else hrZoneCounts.z5 += dur;
      }
    });

    currentWeekKm = Math.round(currentWeekKm * 10) / 10;
    prevWeekKm = Math.round(prevWeekKm * 10) / 10;
    totalLifetimeKm = Math.round(totalLifetimeKm * 10) / 10;

    // 10% Safe Rule: Current week shouldn't exceed prev week * 1.10
    // If prev week was 0, baseline starts at 8 km
    const baselinePrev = prevWeekKm > 0 ? prevWeekKm : 8;
    const safeVolumeCeiling = Math.round(baselinePrev * 1.10 * 10) / 10;
    const percentChange = prevWeekKm > 0 
      ? Math.round(((currentWeekKm - prevWeekKm) / prevWeekKm) * 100) 
      : 0;
    const is10PercentExceeded = currentWeekKm > safeVolumeCeiling;

    // Countdown to target race
    const targetDate = new Date(data.settings.targetRaceDate || "2027-10-10");
    const diffTime = targetDate - now;
    const daysToRace = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const weeksToRace = Math.round(daysToRace / 7);

    // Active Phase Details
    const activePhase = TRAINING_PHASES.find(p => p.id === data.activePhaseId) || TRAINING_PHASES[0];

    return {
      sortedWorkouts,
      currentWeekKm,
      prevWeekKm,
      currentWeekRuns,
      safeVolumeCeiling,
      percentChange,
      is10PercentExceeded,
      longestRunKm,
      totalLifetimeKm,
      totalDurationMin,
      hrZoneCounts,
      daysToRace,
      weeksToRace,
      activePhase
    };
  }, [data]);

  const value = {
    workouts: data.workouts,
    shoes: data.shoes,
    settings: data.settings,
    completedMilestones: data.completedMilestones,
    activePhaseId: data.activePhaseId,
    metrics: computedMetrics,
    toastMessage,
    addWorkout,
    deleteWorkout,
    toggleMilestone,
    setActivePhaseId,
    updateSettings,
    addShoe,
    importBackup,
    downloadBackup,
    clearAllWorkouts,
    restoreSampleData,
    showToast
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
}
