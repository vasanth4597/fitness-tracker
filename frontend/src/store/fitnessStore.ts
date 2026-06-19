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
  workoutHistory: [
    {
      id: '1',
      exerciseName: 'Morning Run',
      duration: 30,
      calories: 250,
      date: '2026-06-19',
    },
    {
      id: '2',
      exerciseName: 'Strength Training',
      duration: 45,
      calories: 280,
      date: '2026-06-18',
    },
    {
      id: '3',
      exerciseName: 'Yoga',
      duration: 40,
      calories: 120,
      date: '2026-06-17',
    },
  ],
  addWorkout: (workout) =>
    set((state) => ({
      workoutHistory: [workout, ...state.workoutHistory],
    })),
  updateDailyStats: (stats) =>
    set((state) => ({
      dailyStats: { ...state.dailyStats, ...stats },
    })),
}));
