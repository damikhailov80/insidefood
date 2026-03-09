import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
    const { manifest, expoConfig } = Constants;

    // Check if running on Expo Go (has debuggerHost)
    if (__DEV__ && manifest?.debuggerHost) {
        const host = manifest.debuggerHost.split(':')[0];
        return `http://${host}:4000`;
    }

    // Try expoConfig hostUri (for newer Expo versions)
    if (__DEV__ && expoConfig?.hostUri) {
        const host = expoConfig.hostUri.split(':')[0];
        return `http://${host}:4000`;
    }

    // For iOS simulator, use localhost
    if (Platform.OS === 'ios') {
        return 'http://localhost:4000';
    }

    // For Android emulator, use 10.0.2.2 (special alias for host machine)
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:4000';
    }

    // Fallback
    return 'http://localhost:4000';
};

export const API_URL = getApiUrl();
