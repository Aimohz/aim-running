export const TRAINING_PHASES = [
  {
    id: 1,
    title: "Phase 1: Habit & Walk-Run Base",
    tagline: "Build connective tissue strength & cardiovascular habit",
    weeksLabel: "Weeks 1 – 8",
    color: "emerald",
    icon: "Footprints",
    targetMileage: "6 – 12 km/week",
    unlockMilestone: "Run continuously for 20 minutes at conversational pace without walking",
    criteria: [
      { id: "p1-1", text: "Complete 12 walk-to-run interval sessions", requiredCount: 12 },
      { id: "p1-2", text: "Maintain 3 workouts/week for 3 consecutive weeks", requiredCount: 3 },
      { id: "p1-3", text: "Continuous 20-min run test (no stopping)", requiredCount: 1, isFinalGate: true }
    ],
    overview: "Focus is on building aerobic enzymes, tendon stiffness, and bone remodeling. Pace does NOT matter—effort should be strictly conversational (Zone 2).",
    sampleWorkouts: [
      { name: "Interval Kickoff", type: "Walk-Run", description: "5 min brisk walk warmup. 6x (1 min easy jog / 2 min walk). 5 min cooldown.", distance: 2.5, duration: 28 },
      { name: "Interval Step-up", type: "Walk-Run", description: "5 min walk. 5x (2 min easy jog / 2 min walk). 5 min cooldown.", distance: 3.0, duration: 30 },
      { name: "Continuous Milestone Test", type: "Continuous Run", description: "20 min easy jog without stopping. Conversational pace.", distance: 3.2, duration: 20 }
    ]
  },
  {
    id: 2,
    title: "Phase 2: 5K Consolidation & Durability",
    tagline: "Eliminate walking intervals and complete your first 5K",
    weeksLabel: "Weeks 9 – 18",
    color: "cyan",
    icon: "Flame",
    targetMileage: "12 – 18 km/week",
    unlockMilestone: "Complete a continuous 5.0 km run comfortably and pain-free",
    criteria: [
      { id: "p2-1", text: "Complete 15 continuous running sessions (20-30 mins each)", requiredCount: 15 },
      { id: "p2-2", text: "Complete at least one 4.0 km continuous run", requiredCount: 1 },
      { id: "p2-3", text: "Official 5.0 km Milestone Run completed", requiredCount: 1, isFinalGate: true }
    ],
    overview: "Transition to uninterrupted running. Introduce 4 short strides at the end of one run per week to stimulate neuromuscular coordination without fatigue.",
    sampleWorkouts: [
      { name: "Aerobic Easy 25", type: "Easy Run", description: "25 min steady aerobic running. Heart rate strictly Zone 2.", distance: 3.5, duration: 25 },
      { name: "Long Run Builder", type: "Long Run", description: "4.5 km gentle long run. Focus on relaxed shoulders and deep breathing.", distance: 4.5, duration: 34 },
      { name: "5K Milestone Challenge", type: "Milestone Run", description: "5.0 km continuous run at steady, sustainable effort.", distance: 5.0, duration: 36 }
    ]
  },
  {
    id: 3,
    title: "Phase 3: 10K Endurance Foundation",
    tagline: "Double your distance and build aerobic capacity",
    weeksLabel: "Weeks 19 – 32",
    color: "blue",
    icon: "Compass",
    targetMileage: "18 – 28 km/week",
    unlockMilestone: "Complete a continuous 10.0 km run and maintain 20+ km/week for 4 weeks",
    criteria: [
      { id: "p3-1", text: "Log 4 consecutive weeks above 20 km total volume", requiredCount: 4 },
      { id: "p3-2", text: "Complete long runs of 7 km, 8 km, and 9 km", requiredCount: 3 },
      { id: "p3-3", text: "Official 10.0 km Milestone Run completed", requiredCount: 1, isFinalGate: true }
    ],
    overview: "You are now building the true mitochondrial density needed for a half marathon. Every 4th week is a deload/recovery week (25% volume drop).",
    sampleWorkouts: [
      { name: "Midweek Aerobic Base", type: "Easy Run", description: "6.0 km easy conversational run.", distance: 6.0, duration: 42 },
      { name: "Conversational Tempo", type: "Tempo Run", description: "1 km warmup, 3 km comfortably hard (Zone 3/4), 1 km cooldown.", distance: 5.0, duration: 32 },
      { name: "Weekend Long Run 10K", type: "Milestone Run", description: "10.0 km steady long run. Practice hydration every 20 minutes.", distance: 10.0, duration: 72 }
    ]
  },
  {
    id: 4,
    title: "Phase 4: Half Marathon Peak Build",
    tagline: "Extend the long run to 18 km & master race pacing",
    weeksLabel: "Weeks 33 – 48",
    color: "purple",
    icon: "TrendingUp",
    targetMileage: "28 – 38 km/week",
    unlockMilestone: "Complete an 18.0 km long run comfortably with fueling strategy dialed in",
    criteria: [
      { id: "p4-1", text: "Complete 12 km, 14 km, and 16 km progression long runs", requiredCount: 3 },
      { id: "p4-2", text: "Complete 6 Half-Marathon Goal Pace (HMP) segments", requiredCount: 6 },
      { id: "p4-3", text: "Peak 18.0 km Long Run completed", requiredCount: 1, isFinalGate: true }
    ],
    overview: "The peak training block. Long runs reach 14 to 18 km. Practice taking energy gels/chews and electrolyte fluids on runs longer than 75 minutes.",
    sampleWorkouts: [
      { name: "Target Pace Segment Run", type: "Pace Run", description: "2 km warmup + 5 km at target Half Marathon Pace + 1 km cooldown.", distance: 8.0, duration: 52 },
      { name: "Progression Long Run", type: "Long Run", description: "15 km long run: first 12 km easy Zone 2, final 3 km slightly faster.", distance: 15.0, duration: 105 },
      { name: "Peak 18K Rehearsal", type: "Milestone Run", description: "18.0 km peak endurance test with full race gear and fueling.", distance: 18.0, duration: 126 }
    ]
  },
  {
    id: 5,
    title: "Phase 5: Taper & Race Day Celebration",
    tagline: "Fresh legs, carbohydrate loading, and the 21.1 km finish line!",
    weeksLabel: "Weeks 49 – 52",
    color: "amber",
    icon: "Trophy",
    targetMileage: "14 – 22 km/week (Tapered)",
    unlockMilestone: "Cross the 21.1 km Half Marathon Finish Line!",
    criteria: [
      { id: "p5-1", text: "Follow 3-week volume taper schedule (reduce volume by 40-50%)", requiredCount: 3 },
      { id: "p5-2", text: "Race week preparation: hydration, sleep & gear checklist ready", requiredCount: 1 },
      { id: "p5-3", text: "FINISH THE 21.1 KM HALF MARATHON!", requiredCount: 1, isFinalGate: true }
    ],
    overview: "Mileage drops dramatically while maintaining short, crisp pickups so your legs remain springy. Rest, hydrate, and celebrate your 1-year transformation!",
    sampleWorkouts: [
      { name: "Taper Sharpener", type: "Easy + Strides", description: "4 km easy jog with 4x 20-second relaxed strides.", distance: 4.0, duration: 26 },
      { name: "Shakeout Jog", type: "Shakeout", description: "2.5 km slow jog 24 hours before race day to calm pre-race nerves.", distance: 2.5, duration: 18 },
      { name: "RACE DAY: 21.1 KM HALF MARATHON", type: "Race", description: "The culmination of 52 weeks of dedication! Pace smart in the first 5 km, stay steady through 15 km, and fly the final 6.1 km!", distance: 21.1, duration: 135 }
    ]
  }
];
