import { Platform } from 'react-native';
import Constants from 'expo-constants';

// On Vercel (web build), set EXPO_PUBLIC_API_URL to your deployed backend URL.
// e.g. https://your-backend.railway.app
// Locally it falls back to dynamic host detection.
const getApiUrl = (): string => {
  // Env variable set at build time (works for Expo web / Vercel)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Local dev: detect host from Expo manifest
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  const manifest = Constants.manifest || Constants.expoConfig;
  const hostUri = manifest?.debuggerHost || (manifest as any)?.hostUri;
  if (typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:3000`;
  }

  return 'http://localhost:3000';
};

export const API_URL = getApiUrl();
