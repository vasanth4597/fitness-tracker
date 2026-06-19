import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useFitnessStore } from '../store/fitnessStore';
import { useAuthStore } from '../store/authStore';

interface DashboardProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardProps) {
  const dailyStats = useFitnessStore((state) => state.dailyStats);
  const workoutHistory = useFitnessStore((state) => state.workoutHistory);
  const logout = useAuthStore((state) => state.logout);

  const exercises = [
    {
      id: '1',
      name: 'Cardio',
      icon: 'https://images.unsplash.com/photo-1552172930-7b44c686467b?auto=format&fit=crop&w=600&h=300&crop=faces&q=85',
      description: 'Running, Cycling, Jump Rope',
    },
    {
      id: '2',
      name: 'Strength',
      icon: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&w=600&h=300&q=85',
      description: 'Weight Training, Bodyweight',
    },
    {
      id: '3',
      name: 'Flexibility',
      icon: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&h=300&q=85',
      description: 'Yoga, Stretching, Pilates',
    },
    {
      id: '4',
      name: 'Sports',
      icon: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=300&q=85',
      description: 'Basketball, Football, Tennis',
    },
  ];

  const ProgressCard = ({ label, value, unit }: any) => (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>
        <Text style={styles.statIcon}>{label === 'Steps' ? '👣' : label === 'Calories' ? '🔥' : label === 'Distance' ? '📍' : '⏱️'}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  );

  const ExerciseCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
    >
      <Image
        source={{ uri: item.icon }}
        style={styles.exerciseImage}
        resizeMode="cover"
      />
      <View style={styles.exerciseOverlay} />
      <View style={styles.exerciseContent}>
        <View>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDesc}>{item.description}</Text>
        </View>
        <View style={styles.arrowIcon}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const WorkoutItem = ({ item }: any) => (
    <TouchableOpacity style={styles.workoutItem} activeOpacity={0.7}>
      <View style={styles.workoutBadge}>
        <Text style={styles.workoutEmoji}>💪</Text>
      </View>
      <View style={styles.workoutLeft}>
        <Text style={styles.workoutName}>{item.exerciseName}</Text>
        <Text style={styles.workoutTime}>{item.date}</Text>
      </View>
      <View style={styles.workoutRight}>
        <View style={styles.workoutStats}>
          <Text style={styles.workoutDuration}>⏱ {item.duration}m</Text>
          <Text style={styles.workoutCalories}>🔥 {item.calories} kcal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.subGreeting}>Let's crush your goals today</Text>
        </View>
        <TouchableOpacity style={styles.logoutSmall} onPress={logout}>
          <Text style={styles.logoutSmallText}>⊗</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Today's Progress</Text>
        <View style={styles.statsGrid}>
          <ProgressCard
            label="Steps"
            value={dailyStats.steps.toLocaleString()}
            unit="steps"
          />
          <ProgressCard
            label="Calories"
            value={dailyStats.calories}
            unit="kcal"
          />
          <ProgressCard
            label="Distance"
            value={dailyStats.distance.toFixed(1)}
            unit="km"
          />
          <ProgressCard
            label="Duration"
            value={dailyStats.duration}
            unit="min"
          />
        </View>
      </View>

      {/* Weekly Goal */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>🎯 Weekly Goal Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '65%' }]} />
        </View>
        <Text style={styles.goalText}>65% completed (26/40 km) - Great effort!</Text>
      </View>

      {/* Exercise Categories */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>💪 Exercise Modules</Text>
        <FlatList
          data={exercises}
          renderItem={ExerciseCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Workout History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>📈 Recent Workouts</Text>
        <FlatList
          data={workoutHistory}
          renderItem={WorkoutItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Footer Action */}
      <TouchableOpacity
        style={styles.addWorkoutButton}
        onPress={() => navigation.navigate('ExerciseDetail')}
        activeOpacity={0.8}
      >
        <Text style={styles.addWorkoutText}>+ Log New Workout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f62fe',
  },
  greeting: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  subGreeting: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: '500' },
  logoutSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoutSmallText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statsContainer: { paddingHorizontal: 20, paddingVertical: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16, color: '#111', letterSpacing: 0.3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: { fontSize: 28 },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#0f62fe', letterSpacing: -0.5 },
  statUnit: { fontSize: 11, color: '#ccc', marginTop: 6, fontWeight: '600' },
  goalCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  goalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 14, color: '#111', letterSpacing: 0.2 },
  progressBar: {
    height: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: '#0f62fe', borderRadius: 5 },
  goalText: { fontSize: 13, color: '#666', fontWeight: '600' },
  exercisesSection: { paddingHorizontal: 20, paddingVertical: 20 },
  exerciseCard: {
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  exerciseImage: { width: '100%', height: '100%' },
  exerciseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  exerciseContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 18,
    flexDirection: 'column',
  },
  exerciseName: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 6, letterSpacing: 0.3 },
  exerciseDesc: { fontSize: 14, color: '#f0f0f0', lineHeight: 20 },
  arrowIcon: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  historySection: { paddingHorizontal: 20, paddingVertical: 20 },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f8f8f8',
  },
  workoutBadge: {
    width: 54,
    height: 54,
    borderRadius: 13,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  workoutEmoji: { fontSize: 28 },
  workoutLeft: { flex: 1 },
  workoutRight: { alignItems: 'flex-end' },
  workoutName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4, letterSpacing: 0.1 },
  workoutTime: { fontSize: 13, color: '#999', fontWeight: '500' },
  workoutStats: { alignItems: 'flex-end', gap: 6 },
  workoutDuration: { fontSize: 14, fontWeight: '700', color: '#0f62fe', letterSpacing: 0.1 },
  workoutCalories: { fontSize: 14, fontWeight: '700', color: '#ff6b35', letterSpacing: 0.1 },
  addWorkoutButton: {
    marginHorizontal: 20,
    marginVertical: 28,
    backgroundColor: '#0f62fe',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0f62fe',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  addWorkoutText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.4 },
});
