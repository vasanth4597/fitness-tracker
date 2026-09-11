import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useFitnessStore } from '../store/fitnessStore';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing, font, shadow } from '../config/theme';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

// ── Animated circular progress ring ─────────────────────────────────────────
function CircleRing({
  percent,
  color,
  size = 56,
}: {
  percent: number;
  color: string;
  size?: number;
}) {
  const animVal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animVal, {
      toValue: percent,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Track ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      />
      {/* Fake progress ring using border trick */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: percent > 50 ? color : 'transparent',
          transform: [{ rotate: `${-90 + (percent / 100) * 180}deg` }],
          opacity: percent > 0 ? 1 : 0,
        }}
      />
    </View>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  emoji,
  accentColor,
  percent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  unit: string;
  emoji: string;
  accentColor: string;
  percent: number;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { borderColor: `${accentColor}30` },
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
            },
          ],
        },
      ]}
    >
      <View style={styles.statTop}>
        <View style={[styles.statIconBox, { backgroundColor: `${accentColor}20` }]}>
          <Text style={styles.statEmoji}>{emoji}</Text>
        </View>
        <CircleRing percent={percent} color={accentColor} size={48} />
      </View>
      <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// ── Exercise category card ───────────────────────────────────────────────────
function ExerciseCard({ item, onPress }: { item: any; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, styles.exerciseCardWrap]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
        style={styles.exerciseCard}
      >
        <Image source={{ uri: item.icon }} style={styles.exerciseImage} resizeMode="cover" />
        <View style={styles.exerciseOverlay} />
        {/* Color accent tag */}
        <View style={[styles.categoryTag, { backgroundColor: item.tagColor }]}>
          <Text style={styles.categoryTagText}>{item.tag}</Text>
        </View>
        <View style={styles.exerciseContent}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDesc}>{item.description}</Text>
        </View>
        <View style={styles.arrowCircle}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Workout history row ──────────────────────────────────────────────────────
function WorkoutRow({ item, index }: { item: any; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const emojiMap: Record<string, string> = {
    'Morning Run': '🏃',
    'Strength Training': '🏋️',
    Yoga: '🧘',
    Cycling: '🚴',
    Running: '🏃',
  };
  const emoji = emojiMap[item.exerciseName] ?? '💪';

  return (
    <Animated.View
      style={[
        styles.workoutRow,
        {
          opacity: anim,
          transform: [
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        },
      ]}
    >
      <View style={styles.workoutLeftBorder} />
      <View style={styles.workoutBadge}>
        <Text style={styles.workoutEmoji}>{emoji}</Text>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{item.exerciseName}</Text>
        <Text style={styles.workoutDate}>{item.date}</Text>
      </View>
      <View style={styles.workoutMeta}>
        <Text style={styles.workoutDuration}>⏱ {item.duration}m</Text>
        <Text style={styles.workoutCalories}>🔥 {item.calories} kcal</Text>
      </View>
    </Animated.View>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }: DashboardProps) {
  const dailyStats = useFitnessStore((state) => state.dailyStats);
  const workoutHistory = useFitnessStore((state) => state.workoutHistory);
  const streak = useFitnessStore((state) => state.streak);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const fabPressIn = () =>
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }).start();
  const fabPressOut = () =>
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();

  const exercises = [
    {
      id: '1',
      name: 'Cardio',
      tag: 'BURN',
      tagColor: colors.danger,
      icon: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Running, Cycling, Jump Rope',
    },
    {
      id: '2',
      name: 'Strength',
      tag: 'BUILD',
      tagColor: colors.secondary,
      icon: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Weight Training, Bodyweight',
    },
    {
      id: '3',
      name: 'Flexibility',
      tag: 'FLOW',
      tagColor: colors.primary,
      icon: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Yoga, Stretching, Pilates',
    },
    {
      id: '4',
      name: 'Sports',
      tag: 'PLAY',
      tagColor: colors.warning,
      icon: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Basketball, Football, Tennis',
    },
  ];

  const firstName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Athlete';
  const initials = firstName.slice(0, 2).toUpperCase();

  const goalPercent = 65;
  const goalAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(goalAnim, {
      toValue: goalPercent,
      duration: 1400,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Gradient Header ── */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Blob inside header */}
          <View style={styles.headerBlob} />

          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Good day 👋</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Streak badge */}
            <View style={styles.streakBadge}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakCount}>{streak}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutIcon}>⊗</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Quote Banner ── */}
        <View style={styles.quoteBanner}>
          <Text style={styles.quoteText}>"Push yourself, because no one else will." 💪</Text>
        </View>

        {/* ── Daily Stats Grid ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Steps"
              value={dailyStats.steps.toLocaleString()}
              unit="steps"
              emoji="👣"
              accentColor={colors.steps}
              percent={Math.min((dailyStats.steps / 10000) * 100, 100)}
              delay={0}
            />
            <StatCard
              label="Calories"
              value={dailyStats.calories}
              unit="kcal"
              emoji="🔥"
              accentColor={colors.calories}
              percent={Math.min((dailyStats.calories / 600) * 100, 100)}
              delay={100}
            />
            <StatCard
              label="Distance"
              value={dailyStats.distance.toFixed(1)}
              unit="km"
              emoji="📍"
              accentColor={colors.distance}
              percent={Math.min((dailyStats.distance / 10) * 100, 100)}
              delay={200}
            />
            <StatCard
              label="Duration"
              value={dailyStats.duration}
              unit="min"
              emoji="⏱️"
              accentColor={colors.duration}
              percent={Math.min((dailyStats.duration / 90) * 100, 100)}
              delay={300}
            />
          </View>
        </View>

        {/* ── Weekly Goal ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goal</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>🎯 Distance Goal</Text>
              <Text style={styles.goalPercent}>{goalPercent}%</Text>
            </View>
            <View style={styles.goalTrack}>
              <Animated.View
                style={[
                  styles.goalFill,
                  {
                    width: goalAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.goalSub}>26 / 40 km completed — Keep going! 🚀</Text>
          </View>
        </View>

        {/* ── Exercise Categories ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Modules</Text>
          {exercises.map((item) => (
            <ExerciseCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            />
          ))}
        </View>

        {/* ── Workout History ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            <Text style={styles.seeAll}>See all →</Text>
          </View>
          {workoutHistory.slice(0, 5).map((item, i) => (
            <WorkoutRow key={item.id} item={item} index={i} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Floating Action Button ── */}
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ExerciseDetail')}
          onPressIn={fabPressIn}
          onPressOut={fabPressOut}
          activeOpacity={1}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl + 8,
    backgroundColor: 'rgba(0,255,135,0.07)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  headerBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.06,
    top: -80,
    right: -60,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: font.size.md, fontWeight: font.weight.black, color: colors.bg },
  greeting: { fontSize: font.size.sm, color: colors.textSecondary },
  userName: { fontSize: font.size.lg, fontWeight: font.weight.black, color: colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,179,0,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.3)',
  },
  streakFire: { fontSize: 14 },
  streakCount: { fontSize: font.size.md, fontWeight: font.weight.black, color: colors.warning },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bgInput,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutIcon: { fontSize: 20, color: colors.textSecondary },

  // Quote
  quoteBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  quoteText: { fontSize: font.size.sm, color: colors.primary, fontStyle: 'italic' },

  // Section
  section: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.black,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },
  seeAll: { fontSize: font.size.sm, color: colors.primary, fontWeight: font.weight.semiBold },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: (width - spacing.lg * 2 - 12) / 2,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    ...shadow.subtle,
  },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: font.size.xxl, fontWeight: font.weight.black, letterSpacing: -0.5 },
  statUnit: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2, fontWeight: font.weight.semiBold },
  statLabel: {
    fontSize: font.size.xs,
    color: colors.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: font.weight.semiBold,
  },

  // Goal
  goalCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  goalLabel: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary },
  goalPercent: { fontSize: font.size.xl, fontWeight: font.weight.black, color: colors.primary },
  goalTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  goalFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 },
  goalSub: { fontSize: font.size.sm, color: colors.textSecondary },

  // Exercise cards
  exerciseCardWrap: { marginBottom: 14 },
  exerciseCard: {
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.subtle,
  },
  exerciseImage: { width: '100%', height: '100%' },
  exerciseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  categoryTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  categoryTagText: { fontSize: font.size.xs, fontWeight: font.weight.black, color: '#fff', letterSpacing: 1 },
  exerciseContent: {
    position: 'absolute',
    bottom: 50,
    left: 14,
    right: 14,
  },
  exerciseName: { fontSize: font.size.xxl, fontWeight: font.weight.black, color: '#fff', marginBottom: 4 },
  exerciseDesc: { fontSize: font.size.sm, color: 'rgba(255,255,255,0.75)' },
  arrowCircle: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  arrowText: { fontSize: 18, color: '#fff', fontWeight: font.weight.bold },

  // Workout rows
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    marginBottom: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  workoutLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
  },
  workoutBadge: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 6,
  },
  workoutEmoji: { fontSize: 22 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary, marginBottom: 3 },
  workoutDate: { fontSize: font.size.xs, color: colors.textMuted },
  workoutMeta: { alignItems: 'flex-end', gap: 4 },
  workoutDuration: { fontSize: font.size.sm, color: colors.duration, fontWeight: font.weight.bold },
  workoutCalories: { fontSize: font.size.sm, color: colors.calories, fontWeight: font.weight.bold },

  // FAB
  fabWrap: { position: 'absolute', bottom: 28, right: 24 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.glow,
  },
  fabText: { fontSize: 32, color: colors.bg, fontWeight: font.weight.black, lineHeight: 36 },
});
