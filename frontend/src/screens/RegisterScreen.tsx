import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config/api';
import { colors, radius, spacing, font, shadow } from '../config/theme';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const login = useAuthStore((state) => state.login);

  // ── Entrance animations ───────────────────────────────────────────────
  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  // ── Completeness indicator ────────────────────────────────────────────
  const filledCount = [name, email, password].filter(Boolean).length;
  const progress = filledCount / 3;

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Validation', 'Please fill in all fields.');
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access_token, { email, name });
      } else {
        Alert.alert('Registration Failed', data.message || 'Unable to register');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Unable to reach backend at ' + API_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Decorative glow blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: logoAnim,
                transform: [
                  {
                    translateY: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.logoRing}>
              <Text style={styles.logoEmoji}>🏋️</Text>
            </View>
            <Text style={styles.brandName}>FitTrack</Text>
            <Text style={styles.brandTagline}>Your journey starts here</Text>
          </Animated.View>

          {/* ── Glass Card ── */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Join thousands training smarter</Text>

            {/* Progress dots */}
            <View style={styles.progressDots}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i < filledCount ? styles.dotFilled : styles.dotEmpty,
                  ]}
                />
              ))}
              <Text style={styles.progressLabel}>{Math.round(progress * 100)}% complete</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleRegister}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={loading}
                activeOpacity={1}
              >
                {loading ? (
                  <ActivityIndicator color={colors.bg} />
                ) : (
                  <Text style={styles.primaryBtnText}>Create Account 🚀</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>
                Already have an account?{' '}
                <Text style={styles.secondaryBtnAccent}>Login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },

  blob: { position: 'absolute', borderRadius: 999, opacity: 0.15 },
  blobTop: { width: 280, height: 280, backgroundColor: colors.secondary, top: -90, left: -70 },
  blobBottom: { width: 240, height: 240, backgroundColor: colors.primary, bottom: -70, right: -60 },

  // Header
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryMuted,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.card,
  },
  logoEmoji: { fontSize: 34 },
  brandName: {
    fontSize: font.size.hero,
    fontWeight: font.weight.black,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  brandTagline: { fontSize: font.size.sm, color: colors.textSecondary, marginTop: 4 },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardTitle: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardSubtitle: { fontSize: font.size.md, color: colors.textSecondary, marginBottom: 16 },

  // Progress dots
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 6,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotFilled: { backgroundColor: colors.primary },
  dotEmpty: { backgroundColor: colors.border },
  progressLabel: { fontSize: font.size.xs, color: colors.primary, marginLeft: 8, fontWeight: font.weight.bold },

  // Inputs
  inputGroup: { marginBottom: spacing.md },
  inputLabel: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semiBold,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: { borderColor: colors.secondary, backgroundColor: colors.secondaryMuted },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: font.size.md, color: colors.textPrimary },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },

  // Buttons
  primaryBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xs,
    shadowColor: colors.secondary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontSize: font.size.lg,
    fontWeight: font.weight.black,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, marginHorizontal: 12, fontSize: font.size.sm },

  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryBtnText: { fontSize: font.size.md, color: colors.textSecondary },
  secondaryBtnAccent: { color: colors.secondary, fontWeight: font.weight.bold },
});
