import { create } from 'zustand';

interface WorkoutSession {
  id: string;
  exerciseName: string;
  duration: number;
  calories: number;
  date: string;
}

interface FitnessState {
  dailyStats: {
    steps: number;
    calories: number;
    distance: number;
    duration: number;
  };
  workoutHistory: WorkoutSession[];
  streak: number;
  weeklyGoal: {
    target: number; // km
    completed: number;
  };
  addWorkout: (workout: WorkoutSession) => void;
  updateDailyStats: (stats: Partial<FitnessState['dailyStats']>) => void;
}

export const useFitnessStore = create<FitnessState>((set) => ({
  dailyStats: {
    steps: 5234,
    calories: 320,
    distance: 2.3,
    duration: 45,
  },
  streak: 7,
  weeklyGoal: {
    target: 40,
    completed: 26,
  },
  workoutHistory: [
    {
      id: '1',
      exerciseName: 'Morning Run',
      duration: 30,
      calories: 250,
      date: '2026-09-10',
    },
    {
      id: '2',
      exerciseName: 'Strength Training',
      duration: 45,
      calories: 280,
      date: '2026-09-09',
    },
    {
      id: '3',
      exerciseName: 'Yoga',
      duration: 40,
      calories: 120,
      date: '2026-09-08',
    },
  ],
  addWorkout: (workout) =>
    set((state) => ({
      workoutHistory: [workout, ...state.workoutHistory],
      dailyStats: {
        ...state.dailyStats,
        calories: state.dailyStats.calories + workout.calories,
        duration: state.dailyStats.duration + workout.duration,
        // Rough distance estimate: 1 min ≈ 0.1 km for running-style workouts
        distance: parseFloat((state.dailyStats.distance + workout.duration * 0.1).toFixed(1)),
        steps: state.dailyStats.steps + workout.duration * 80,
      },
      weeklyGoal: {
        ...state.weeklyGoal,
        completed: parseFloat(
          (state.weeklyGoal.completed + workout.duration * 0.1).toFixed(1)
        ),
      },
    })),
  updateDailyStats: (stats) =>
    set((state) => ({
      dailyStats: { ...state.dailyStats, ...stats },
    })),
}));
