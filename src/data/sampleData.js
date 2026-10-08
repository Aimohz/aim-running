// Helper to format dates relative to today
const getRelativeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SHOES = [
  {
    id: "shoe-1",
    name: "Brooks Ghost 15",
    brand: "Brooks",
    currentKm: 34.2,
    maxKm: 600,
    isDefault: true,
    purchaseDate: "2026-09-01"
  },
  {
    id: "shoe-2",
    name: "Nike Pegasus 40",
    brand: "Nike",
    currentKm: 12.0,
    maxKm: 650,
    isDefault: false,
    purchaseDate: "2026-09-20"
  }
];

export const INITIAL_USER_SETTINGS = {
  name: "Runner",
  targetRaceDate: "2027-10-10", // ~1 year from now
  targetRaceName: "City Half Marathon",
  targetGoalTime: "02:15:00",
  maxHeartRate: 185,
  restingHeartRate: 62,
  weeklyMileageGoal: 12,
  cloudSyncEnabled: false,
  supabaseUrl: "",
  supabaseKey: "",
  stravaConnected: false
};

export const INITIAL_WORKOUTS = [
  {
    id: "run-01",
    date: getRelativeDate(21),
    title: "Week 1: Walk-Run Kickoff",
    phaseId: 1,
    distanceKm: 2.4,
    durationMin: 25,
    avgPaceSec: 625, // 10:25 /km
    avgHeartRate: 138,
    maxHeartRate: 152,
    rpe: 4, // 1-10
    soreness: 2, // 0-10
    sorenessLocation: "Calves",
    shoeId: "shoe-1",
    source: "fitbit",
    type: "Walk-Run",
    notes: "First session back! 1 min run / 2 min walk intervals. Felt surprisingly controlled."
  },
  {
    id: "run-02",
    date: getRelativeDate(19),
    title: "Week 1: Interval Step-up",
    phaseId: 1,
    distanceKm: 2.8,
    durationMin: 27,
    avgPaceSec: 578, // 9:38 /km
    avgHeartRate: 142,
    maxHeartRate: 156,
    rpe: 5,
    soreness: 2,
    sorenessLocation: "Shins",
    shoeId: "shoe-1",
    source: "fitbit",
    type: "Walk-Run",
    notes: "Stuck strictly to conversational breathing. Calves felt good."
  },
  {
    id: "run-03",
    date: getRelativeDate(16),
    title: "Week 1: Weekend Aerobic Walk-Jog",
    phaseId: 1,
    distanceKm: 3.1,
    durationMin: 30,
    avgPaceSec: 580,
    avgHeartRate: 140,
    maxHeartRate: 155,
    rpe: 4,
    soreness: 1,
    sorenessLocation: "None",
    shoeId: "shoe-1",
    source: "fitbit",
    type: "Walk-Run",
    notes: "Total 8.3 km for Week 1. Kept within safe zone."
  },
  {
    id: "run-04",
    date: getRelativeDate(14),
    title: "Week 2: 90s Run / 90s Walk",
    phaseId: 1,
    distanceKm: 3.0,
    durationMin: 28,
    avgPaceSec: 560, // 9:20 /km
    avgHeartRate: 144,
    maxHeartRate: 158,
    rpe: 5,
    soreness: 2,
    sorenessLocation: "Calves",
    shoeId: "shoe-1",
    source: "strava",
    type: "Walk-Run",
    notes: "Synced from Fitbit via Strava. Heart rate stayed well in Zone 2."
  },
  {
    id: "run-05",
    date: getRelativeDate(11),
    title: "Week 2: Midweek Progression",
    phaseId: 1,
    distanceKm: 3.3,
    durationMin: 30,
    avgPaceSec: 545, // 9:05 /km
    avgHeartRate: 146,
    maxHeartRate: 160,
    rpe: 6,
    soreness: 3,
    sorenessLocation: "Right Shin",
    shoeId: "shoe-1",
    source: "fitbit",
    type: "Walk-Run",
    notes: "Felt slight shin tightness at min 22, slowed down and stretched afterward."
  },
  {
    id: "run-06",
    date: getRelativeDate(8),
    title: "Week 2: Sunday Long Walk-Run",
    phaseId: 1,
    distanceKm: 3.6,
    durationMin: 32,
    avgPaceSec: 533, // 8:53 /km
    avgHeartRate: 143,
    maxHeartRate: 159,
    rpe: 5,
    soreness: 1,
    sorenessLocation: "None",
    shoeId: "shoe-1",
    source: "manual",
    type: "Walk-Run",
    notes: "Shin tightness resolved with foam rolling. Great steady pace."
  },
  {
    id: "run-07",
    date: getRelativeDate(5),
    title: "Week 3: 2m Run / 1m Walk",
    phaseId: 1,
    distanceKm: 3.8,
    durationMin: 32,
    avgPaceSec: 505, // 8:25 /km
    avgHeartRate: 147,
    maxHeartRate: 162,
    rpe: 6,
    soreness: 2,
    sorenessLocation: "Calves",
    shoeId: "shoe-2",
    source: "fitbit",
    type: "Walk-Run",
    notes: "Tested Nike Pegasus shoes today. Smooth transitions."
  },
  {
    id: "run-08",
    date: getRelativeDate(2),
    title: "Week 3: Continuous Jog Progress",
    phaseId: 1,
    distanceKm: 4.0,
    durationMin: 33,
    avgPaceSec: 495, // 8:15 /km
    avgHeartRate: 148,
    maxHeartRate: 164,
    rpe: 6,
    soreness: 1,
    sorenessLocation: "None",
    shoeId: "shoe-1",
    source: "fitbit",
    type: "Walk-Run",
    notes: "Ran 12 minutes non-stop in the middle block! Approaching the 20-min continuous milestone."
  }
];

export const INITIAL_COMPLETED_MILESTONES = ["p1-1"];
