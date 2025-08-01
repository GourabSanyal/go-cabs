import { Platform } from 'react-native';

export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * Check if the device is a tablet
 * @returns {boolean} true if tablet, false otherwise
 */
export const isTablet = (): boolean => {
  return Platform.OS === 'ios' && Platform.isPad;
};

export const getPlatform = (): string => {
  return Platform.OS;
};

/**
 * Get platform-specific value
 * @param iosValue - Value to return for iOS
 * @param androidValue - Value to return for Android
 * @returns The platform-specific value
 */
export const getPlatformValue = <T>(iosValue: T, androidValue: T): T => {
  return Platform.select({
    ios: iosValue,
    android: androidValue,
  }) as T;
}; 