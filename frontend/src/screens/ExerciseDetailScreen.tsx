import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useFitnessStore } from '../store/fitnessStore';

const exerciseData: any = {
  1: {
    name: 'Cardio',
    description: 'Cardiovascular exercises to build endurance',
    icon: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&w=600&q=80',
    workouts: [
      { name: 'Running', caloriesBurn: 300, image: 'https://images.unsplash.com/photo-1552172930-7b44c686467b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cycling', caloriesBurn: 280, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80' },
      { name: 'Jump Rope', caloriesBurn: 250, image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&w=400&q=80' },
      { name: 'Swimming', caloriesBurn: 320, image: 'https://images.unsplash.com/photo-1576610616656-570f080dd881?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  2: {
    name: 'Strength',
    description: 'Build muscle and increase strength',
    icon: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&w=600&q=80',
    workouts: [
      { name: 'Bench Press', caloriesBurn: 280, image: 'https://images.unsplash.com/photo-1556821552-23d5b814b9d1?auto=format&fit=crop&w=400&q=80' },
      { name: 'Deadlifts', caloriesBurn: 300, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
      { name: 'Squats', caloriesBurn: 290, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pull-ups', caloriesBurn: 200, image: 'https://images.unsplash.com/photo-1516981635215-25f5d024dc1c?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  3: {
    name: 'Flexibility',
    description: 'Improve flexibility and reduce stress',
    icon: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    workouts: [
      { name: 'Yoga', caloriesBurn: 120, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pilates', caloriesBurn: 140, image: 'https://images.unsplash.com/photo-1598100428697-de9518c0e5c8?auto=format&fit=crop&w=400&q=80' },
      { name: 'Stretching', caloriesBurn: 80, image: 'https://images.unsplash.com/photo-1520806553033-13453efada6c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tai Chi', caloriesBurn: 100, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  4: {
    name: 'Sports',
    description: 'Team and individual sports activities',
    icon: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    workouts: [
      { name: 'Basketball', caloriesBurn: 320, image: 'https://images.unsplash.com/photo-1546519638-68711109d298?auto=format&fit=crop&w=400&q=80' },
      { name: 'Football', caloriesBurn: 350, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tennis', caloriesBurn: 300, image: 'https://images.unsplash.com/photo-1554224311-beee415c15ac?auto=format&fit=crop&w=400&q=80' },
      { name: 'Badminton', caloriesBurn: 250, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80' },
    ],
  },
};

export default function ExerciseDetailScreen({ route, navigation }: any) {
  const exercise = route?.params?.exercise;
  const exerciseId = exercise?.id || '1';
  const data = exerciseData[exerciseId];
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [duration, setDuration] = useState('30');
  const [showLogForm, setShowLogForm] = useState(false);
  const addWorkout = useFitnessStore((state) => state.addWorkout);

  const handleLogWorkout = () => {
    if (!selectedWorkout || !duration) {
      Alert.alert('Error', 'Please select a workout and enter duration');
      return;
    }

    const calories = Math.round((parseInt(duration) / 30) * selectedWorkout.caloriesBurn);
    const newWorkout = {
      id: Date.now().toString(),
      exerciseName: selectedWorkout.name,
      duration: parseInt(duration),
      calories,
      date: new Date().toISOString().split('T')[0],
    };

    addWorkout(newWorkout);
    Alert.alert('Success', `Logged ${selectedWorkout.name} for ${duration} minutes!`);
    setShowLogForm(false);
    setDuration('30');
    setSelectedWorkout(null);
  };

  const WorkoutOption = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.workoutOption, selectedWorkout?.name === item.name && styles.workoutOptionSelected]}
      onPress={() => setSelectedWorkout(item)}
    >
      <Image source={{ uri: item.image }} style={styles.workoutOptionImage} />
      <View style={styles.workoutOptionContent}>
        <Text style={styles.workoutOptionName}>{item.name}</Text>
        <Text style={styles.workoutOptionCalories}>~{item.caloriesBurn} kcal/30min</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Hero Image */}
      <Image source={{ uri: data.icon }} style={styles.heroImage} />
      <View style={styles.heroOverlay} />

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      {/* Workouts List */}
      <View style={styles.workoutsSection}>
        <Text style={styles.sectionTitle}>Available Workouts</Text>
        {data.workouts.map((workout: any, index: number) => (
          <WorkoutOption key={index} item={workout} />
        ))}
      </View>

      {/* Log Workout Form */}
      {showLogForm && (
        <View style={styles.logFormSection}>
          <Text style={styles.formTitle}>Log Your Workout</Text>

          {selectedWorkout && (
            <View style={styles.selectedWorkout}>
              <Text style={styles.selectedWorkoutName}>{selectedWorkout.name}</Text>
              <Text style={styles.selectedWorkoutCalories}>
                {Math.round((parseInt(duration) / 30) * selectedWorkout.caloriesBurn)} kcal
              </Text>
            </View>
          )}

          <Text style={styles.formLabel}>Duration (minutes)</Text>
          <TextInput
            style={styles.durationInput}
            placeholder="30"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleLogWorkout}>
            <Text style={styles.submitButtonText}>Log Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowLogForm(false);
              setSelectedWorkout(null);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Button */}
      {!showLogForm && (
        <TouchableOpacity
          style={styles.logButton}
          onPress={() => setShowLogForm(true)}
        >
          <Text style={styles.logButtonText}>+ Log This Workout</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  backButtonText: { fontSize: 16, color: '#0f62fe', fontWeight: '600' },
  heroImage: { width: '100%', height: 280, resizeMode: 'cover' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  titleSection: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: '800', color: '#111', marginBottom: 8 },
  description: { fontSize: 15, color: '#666', lineHeight: 22 },
  workoutsSection: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: '#111' },
  workoutOption: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  workoutOptionSelected: { borderColor: '#0f62fe', backgroundColor: '#f0f7ff' },
  workoutOptionImage: { width: 80, height: 80, borderRadius: 8 },
  workoutOptionContent: { flex: 1, marginLeft: 12 },
  workoutOptionName: { fontSize: 16, fontWeight: '700', color: '#111' },
  workoutOptionCalories: { fontSize: 13, color: '#999', marginTop: 4 },
  logFormSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#111' },
  selectedWorkout: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  selectedWorkoutName: { fontSize: 16, fontWeight: '600', color: '#0f62fe' },
  selectedWorkoutCalories: { fontSize: 18, fontWeight: '800', color: '#0f62fe', marginTop: 4 },
  formLabel: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 8 },
  durationInput: {
    backgroundColor: '#f7f7f8',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#0f62fe',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelButton: { paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#999', fontSize: 16 },
  logButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#0f62fe',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
