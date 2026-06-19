import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getExpoHost = () => {
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  const manifest = Constants.manifest || Constants.expoConfig;
  const hostUri = manifest?.debuggerHost || (manifest as any)?.hostUri;
  if (typeof hostUri === 'string') {
    return hostUri.split(':')[0];
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.hostname || 'localhost';
  }

  return 'localhost';
};

export const API_HOST = getExpoHost();
export const API_URL = `http://${API_HOST}:3000`;
