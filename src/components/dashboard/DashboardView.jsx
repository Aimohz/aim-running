import React from 'react';
import { MetricCards } from './MetricCards';
import { PhaseProgress } from './PhaseProgress';
import { WeeklyVolumeChart } from './WeeklyVolumeChart';
import { HeartRateChart } from './HeartRateChart';
import { UpcomingWorkouts } from './UpcomingWorkouts';

export function DashboardView({ onGoToRoadmap, onLogSpecificWorkout }) {
  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metric Cards */}
      <MetricCards />

      {/* 5-Phase Milestone Progress Bar */}
      <PhaseProgress onGoToRoadmap={onGoToRoadmap} />

      {/* Charts Grid: Weekly Mileage & Fitbit HR Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyVolumeChart />
        <HeartRateChart />
      </div>

      {/* Upcoming Suggested Workouts for Current Phase */}
      <UpcomingWorkouts onLogSpecificWorkout={onLogSpecificWorkout} />
    </div>
  );
}
