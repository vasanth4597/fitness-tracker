import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useFitnessStore } from '../store/fitnessStore';
import { colors, radius, spacing, font, shadow } from '../config/theme';

const { width } = Dimensions.get('window');

const exerciseData: any = {
  1: {
    name: 'Cardio',
    description: 'Cardiovascular exercises to build endurance and burn fat',
    accentColor: colors.danger,
    icon: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    workouts: [
      { name: 'Running', caloriesBurn: 300, emoji: '🏃', image: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Cycling', caloriesBurn: 280, emoji: '🚴', image: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Jump Rope', caloriesBurn: 250, emoji: '🪢', image: 'https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Swimming', caloriesBurn: 320, emoji: '🏊', image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
    ],
  },
  2: {
    name: 'Strength',
    description: 'Build muscle and increase strength with resistance training',
    accentColor: colors.secondary,
    icon: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    workouts: [
      { name: 'Bench Press', caloriesBurn: 280, emoji: '🏋️', image: 'https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Deadlifts', caloriesBurn: 300, emoji: '💪', image: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Squats', caloriesBurn: 290, emoji: '🦵', image: 'https://images.pexels.com/photos/4164512/pexels-photo-4164512.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Pull-ups', caloriesBurn: 200, emoji: '🤸', image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
    ],
  },
  3: {
    name: 'Flexibility',
    description: 'Improve flexibility, balance, and reduce stress',
    accentColor: colors.primary,
    icon: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    workouts: [
      { name: 'Yoga', caloriesBurn: 120, emoji: '🧘', image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Pilates', caloriesBurn: 140, emoji: '🤸', image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Stretching', caloriesBurn: 80, emoji: '🙆', image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Tai Chi', caloriesBurn: 100, emoji: '☯️', image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
    ],
  },
  4: {
    name: 'Sports',
    description: 'Team and individual sports for fun and fitness',
    accentColor: colors.warning,
    icon: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    workouts: [
      { name: 'Basketball', caloriesBurn: 320, emoji: '🏀', image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Football', caloriesBurn: 350, emoji: '⚽', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Tennis', caloriesBurn: 300, emoji: '🎾', image: 'https://images.pexels.com/photos/1432038/pexels-photo-1432038.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
      { name: 'Badminton', caloriesBurn: 250, emoji: '🏸', image: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
    ],
  },
};

export default function ExerciseDetailScreen({ route, navigation }: any) {
  const exercise = route?.params?.exercise;
  const exerciseId = exercise?.id || '1';
  const data = exerciseData[exerciseId];
  const accent = data.accentColor;

  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [duration, setDuration] = useState(30);
  const [showLogForm, setShowLogForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const addWorkout = useFitnessStore((state) => state.addWorkout);

  // ── Animations ────────────────────────────────────────────────────────
  const heroAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const submitScale = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const openLogForm = () => {
    setShowLogForm(true);
    formAnim.setValue(0);
    Animated.timing(formAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  const handleLogWorkout = () => {
    if (!selectedWorkout) {
      Alert.alert('Select Workout', 'Please pick a workout from the list above.');
      return;
    }
    const calories = Math.round((duration / 30) * selectedWorkout.caloriesBurn);
    const newWorkout = {
      id: Date.now().toString(),
      exerciseName: selectedWorkout.name,
      duration,
      calories,
      date: new Date().toISOString().split('T')[0],
    };

    // Success animation
    setSubmitted(true);
    Animated.sequence([
      Animated.spring(submitScale, { toValue: 1.08, useNativeDriver: true }),
      Animated.spring(submitScale, { toValue: 1, useNativeDriver: true }),
    ]).start(() => {
      addWorkout(newWorkout);
      setTimeout(() => {
        setSubmitted(false);
        setShowLogForm(false);
        setDuration(30);
        setSelectedWorkout(null);
        navigation.goBack();
      }, 800);
    });
  };

  const estCalories = selectedWorkout
    ? Math.round((duration / 30) * selectedWorkout.caloriesBurn)
    : 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Image ── */}
        <Animated.View
          style={[
            styles.heroWrap,
            {
              opacity: heroAnim,
              transform: [{ scale: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] }) }],
            },
          ]}
        >
          <Image source={{ uri: data.icon }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Hero text */}
          <View style={styles.heroText}>
            <View style={[styles.accentPill, { backgroundColor: accent }]}>
              <Text style={styles.accentPillText}>{data.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{data.name}</Text>
            <Text style={styles.heroDesc}>{data.description}</Text>
          </View>
        </Animated.View>

        {/* ── Workout Options ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Workout</Text>
          {data.workouts.map((workout: any, index: number) => {
            const isSelected = selectedWorkout?.name === workout.name;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.workoutPill,
                  isSelected && [styles.workoutPillSelected, { borderColor: accent }],
                ]}
                onPress={() => setSelectedWorkout(workout)}
                activeOpacity={0.8}
              >
                <View style={[styles.workoutPillLeft, isSelected && { backgroundColor: `${accent}20` }]}>
                  <Text style={styles.workoutPillEmoji}>{workout.emoji}</Text>
                </View>
                <Image source={{ uri: workout.image }} style={styles.workoutThumb} />
                <View style={styles.workoutPillInfo}>
                  <Text style={[styles.workoutPillName, isSelected && { color: accent }]}>
                    {workout.name}
                  </Text>
                  <Text style={styles.workoutPillCal}>~{workout.caloriesBurn} kcal / 30 min</Text>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: accent }]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Log Form ── */}
        {showLogForm && (
          <Animated.View
            style={[
              styles.logFormCard,
              {
                opacity: formAnim,
                transform: [
                  {
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.formTitle}>Log Workout</Text>

            {/* Selected summary */}
            {selectedWorkout && (
              <View style={[styles.selectedSummary, { borderColor: `${accent}50` }]}>
                <Text style={styles.selectedEmoji}>{selectedWorkout.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.selectedName, { color: accent }]}>{selectedWorkout.name}</Text>
                  <Text style={styles.selectedCalPreview}>≈ {estCalories} kcal estimated</Text>
                </View>
                <Text style={[styles.selectedBigCal, { color: accent }]}>{estCalories}</Text>
              </View>
            )}

            {/* Duration stepper */}
            <Text style={styles.formLabel}>Duration (minutes)</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setDuration((d) => Math.max(5, d - 5))}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValue}>
                <Text style={[styles.stepValueText, { color: accent }]}>{duration}</Text>
                <Text style={styles.stepValueUnit}>min</Text>
              </View>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setDuration((d) => Math.min(180, d + 5))}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <Animated.View style={{ transform: [{ scale: submitScale }] }}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: submitted ? colors.success : accent },
                ]}
                onPress={handleLogWorkout}
                activeOpacity={0.9}
              >
                <Text style={styles.submitBtnText}>
                  {submitted ? '✓ Logged!' : 'Log Workout →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setShowLogForm(false); setSelectedWorkout(null); }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── CTA ── */}
        {!showLogForm && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.logCTA, { backgroundColor: accent, shadowColor: accent }]}
              onPress={openLogForm}
              activeOpacity={0.85}
            >
              <Text style={styles.logCTAText}>+ Log This Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  // Hero
  heroWrap: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,15,0.60)',
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: { fontSize: 20, color: '#fff', fontWeight: font.weight.bold },
  heroText: { position: 'absolute', bottom: 24, left: 20, right: 20 },
  accentPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: 8,
  },
  accentPillText: { fontSize: font.size.xs, fontWeight: font.weight.black, color: '#fff', letterSpacing: 1 },
  heroTitle: { fontSize: font.size.hero, fontWeight: font.weight.black, color: '#fff', marginBottom: 6 },
  heroDesc: { fontSize: font.size.sm, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },

  // Section
  section: { padding: spacing.lg },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.black,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Workout pills
  workoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: 'hidden',
    gap: 0,
  },
  workoutPillSelected: { borderWidth: 2 },
  workoutPillLeft: {
    width: 52,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
  },
  workoutPillEmoji: { fontSize: 26 },
  workoutThumb: { width: 70, height: 70, resizeMode: 'cover' },
  workoutPillInfo: { flex: 1, paddingHorizontal: 14 },
  workoutPillName: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary, marginBottom: 4 },
  workoutPillCal: { fontSize: font.size.xs, color: colors.textMuted },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkText: { color: '#fff', fontSize: 14, fontWeight: font.weight.black },

  // Log form
  logFormCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.subtle,
  },
  formTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.black,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  selectedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: 12,
  },
  selectedEmoji: { fontSize: 28 },
  selectedName: { fontSize: font.size.md, fontWeight: font.weight.bold },
  selectedCalPreview: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
  selectedBigCal: { fontSize: font.size.xxl, fontWeight: font.weight.black },
  formLabel: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: 6,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.bgCardHover,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontSize: 24, color: colors.textPrimary, fontWeight: font.weight.bold, lineHeight: 30 },
  stepValue: { alignItems: 'center' },
  stepValueText: { fontSize: font.size.hero, fontWeight: font.weight.black, lineHeight: font.size.hero + 4 },
  stepValueUnit: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },

  // Submit
  submitBtn: {
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  submitBtnText: { fontSize: font.size.lg, fontWeight: font.weight.black, color: '#fff', letterSpacing: 0.5 },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { fontSize: font.size.md, color: colors.textMuted },

  // CTA
  logCTA: {
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  logCTAText: { fontSize: font.size.lg, fontWeight: font.weight.black, color: '#fff' },
});
