import { INITIAL_WORKOUTS, INITIAL_SHOES, INITIAL_USER_SETTINGS, INITIAL_COMPLETED_MILESTONES } from '../data/sampleData';

const STORAGE_KEYS = {
  WORKOUTS: 'aim_workouts_v1',
  SHOES: 'aim_shoes_v1',
  SETTINGS: 'aim_settings_v1',
  MILESTONES: 'aim_milestones_v1',
  ACTIVE_PHASE: 'aim_active_phase_v1'
};

export function loadStoredData() {
  try {
    const workoutsStr = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    const shoesStr = localStorage.getItem(STORAGE_KEYS.SHOES);
    const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const milestonesStr = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    const activePhaseStr = localStorage.getItem(STORAGE_KEYS.ACTIVE_PHASE);

    return {
      workouts: workoutsStr ? JSON.parse(workoutsStr) : INITIAL_WORKOUTS,
      shoes: shoesStr ? JSON.parse(shoesStr) : INITIAL_SHOES,
      settings: settingsStr ? { ...INITIAL_USER_SETTINGS, ...JSON.parse(settingsStr) } : INITIAL_USER_SETTINGS,
      completedMilestones: milestonesStr ? JSON.parse(milestonesStr) : INITIAL_COMPLETED_MILESTONES,
      activePhaseId: activePhaseStr ? parseInt(activePhaseStr, 10) : 1
    };
  } catch (err) {
    console.error("Failed to load local storage:", err);
    return {
      workouts: INITIAL_WORKOUTS,
      shoes: INITIAL_SHOES,
      settings: INITIAL_USER_SETTINGS,
      completedMilestones: INITIAL_COMPLETED_MILESTONES,
      activePhaseId: 1
    };
  }
}

export function saveStoredData(data) {
  try {
    if (data.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(data.workouts));
    if (data.shoes) localStorage.setItem(STORAGE_KEYS.SHOES, JSON.stringify(data.shoes));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    if (data.completedMilestones) localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(data.completedMilestones));
    if (data.activePhaseId !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE_PHASE, data.activePhaseId.toString());
  } catch (err) {
    console.error("Failed to save to local storage:", err);
  }
}

/**
 * Downloads a complete JSON snapshot to disk for 100% free Google Drive or OneDrive backup.
 */
export function exportBackupFile(fullState) {
  const exportPayload = {
    app: "AiM Running",
    version: "1.0",
    exportDate: new Date().toISOString(),
    data: fullState
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportPayload, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `aim_training_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Parses an imported JSON backup file.
 */
export function parseImportBackup(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed.app && parsed.data) {
      return parsed.data;
    }
    if (parsed.workouts) {
      return parsed;
    }
    throw new Error("Invalid AiM backup file format.");
  } catch (err) {
    throw new Error("Failed to parse backup JSON: " + err.message);
  }
}
