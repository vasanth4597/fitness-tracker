import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

// ── In-app Toast Popup ────────────────────────────────────────────────────────
interface ToastProps {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

function Toast({ type, title, message, onDismiss, actionLabel, onAction }: ToastProps) {
  const slideY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => dismiss(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: -120, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  const config = {
    error: { bg: '#1A0A0A', border: '#FF5252', icon: '⛔', titleColor: '#FF5252' },
    warning: { bg: '#1A1200', border: '#FFB300', icon: '⚠️', titleColor: '#FFB300' },
    success: { bg: '#0A1A0F', border: '#00FF87', icon: '✅', titleColor: '#00FF87' },
  }[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: config.bg, borderColor: config.border },
        { transform: [{ translateY: slideY }], opacity },
      ]}
    >
      <View style={styles.toastHeader}>
        <Text style={styles.toastIcon}>{config.icon}</Text>
        <Text style={[styles.toastTitle, { color: config.titleColor }]}>{title}</Text>
        <TouchableOpacity onPress={dismiss} style={styles.toastClose}>
          <Text style={styles.toastCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.toastMessage}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.toastAction, { borderColor: config.border }]}
          onPress={() => { dismiss(); onAction(); }}
        >
          <Text style={[styles.toastActionText, { color: config.titleColor }]}>
            {actionLabel} →
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const login = useAuthStore((state) => state.login);

  // ── Entrance animations ──────────────────────────────────────────────
  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  // Shake animation for error emphasis
  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const showToast = (props: ToastProps) => {
    setToast(props);
    shakeCard();
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast({
        type: 'warning',
        title: 'Email Required',
        message: 'Please enter your email address.',
        onDismiss: () => setToast(null),
      });
      return;
    }
    if (!password) {
      showToast({
        type: 'warning',
        title: 'Password Required',
        message: 'Please enter your password to continue.',
        onDismiss: () => setToast(null),
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data.access_token, { email: email.trim() });
      } else {
        const msg: string = data?.message || 'Unable to login';

        // Account not found — nudge to register
        if (
          msg.toLowerCase().includes('account not found') ||
          msg.toLowerCase().includes('register')
        ) {
          showToast({
            type: 'error',
            title: 'Account Not Found',
            message: `No account exists for "${email.trim()}". Create one to get started!`,
            onDismiss: () => setToast(null),
            actionLabel: 'Register Now',
            onAction: () => navigation.navigate('Register'),
          });
        } else if (msg.toLowerCase().includes('wrong password') || msg.toLowerCase().includes('password')) {
          showToast({
            type: 'error',
            title: 'Wrong Password',
            message: 'The password you entered is incorrect. Please try again.',
            onDismiss: () => setToast(null),
          });
        } else {
          showToast({
            type: 'error',
            title: 'Login Failed',
            message: msg,
            onDismiss: () => setToast(null),
          });
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to reach the server. Please check your network or try again later.',
        onDismiss: () => setToast(null),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Floating toast — rendered on top of everything */}
      {toast && <Toast {...toast} />}

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
          {/* ── Logo ── */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: logoAnim,
                transform: [
                  {
                    translateY: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View style={[styles.logoRing, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.logoEmoji}>⚡</Text>
            </Animated.View>
            <Text style={styles.brandName}>FitTrack</Text>
            <Text style={styles.brandTagline}>Train smarter. Live better.</Text>
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
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Welcome back 👋</Text>
            <Text style={styles.cardSubtitle}>Log in to continue your journey</Text>

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
                  placeholder="Enter password"
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

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleLogin}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={loading}
                activeOpacity={1}
              >
                {loading ? (
                  <ActivityIndicator color={colors.bg} />
                ) : (
                  <Text style={styles.primaryBtnText}>Login →</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.secondaryBtnText}>
                New here?{' '}
                <Text style={styles.secondaryBtnAccent}>Create an account</Text>
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

  // Decorative blobs
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.18 },
  blobTop: { width: 300, height: 300, backgroundColor: colors.primary, top: -100, right: -80 },
  blobBottom: { width: 260, height: 260, backgroundColor: colors.secondary, bottom: -80, left: -80 },

  // Logo
  logoSection: { alignItems: 'center', marginBottom: spacing.xl },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMuted,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.glow,
  },
  logoEmoji: { fontSize: 36 },
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
  cardSubtitle: { fontSize: font.size.md, color: colors.textSecondary, marginBottom: spacing.lg },

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
  inputWrapperFocused: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: font.size.md, color: colors.textPrimary },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },

  // Buttons
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xs,
    ...shadow.glow,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontSize: font.size.lg,
    fontWeight: font.weight.black,
    color: colors.bg,
    letterSpacing: 0.5,
  },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, marginHorizontal: 12, fontSize: font.size.sm },

  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryBtnText: { fontSize: font.size.md, color: colors.textSecondary },
  secondaryBtnAccent: { color: colors.primary, fontWeight: font.weight.bold },

  // ── Toast ──────────────────────────────────────────────────────────────────
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    left: 16,
    right: 16,
    zIndex: 999,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  toastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  toastIcon: { fontSize: 20 },
  toastTitle: {
    flex: 1,
    fontSize: font.size.md,
    fontWeight: font.weight.black,
    letterSpacing: 0.3,
  },
  toastClose: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastCloseText: { fontSize: 12, color: colors.textSecondary, fontWeight: font.weight.bold },
  toastMessage: {
    fontSize: font.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  toastAction: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  toastActionText: { fontSize: font.size.sm, fontWeight: font.weight.black, letterSpacing: 0.5 },
});
