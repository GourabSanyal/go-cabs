import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (based on standard iPhone 11)
const baseWidth = 375;
const baseHeight = 812;

// Scaling factors
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;
const moderateScale = Math.min(widthScale, heightScale);

export const metrics = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH <= 375,
  isMediumDevice: SCREEN_WIDTH > 375 && SCREEN_WIDTH <= 414,
  isLargeDevice: SCREEN_WIDTH > 414,
  isIOS: Platform.OS === 'ios',
};

/**
 * Scale a size based on screen width
 * @param size - Size to scale
 */
export const horizontalScale = (size: number): number => {
  return Math.round(size * widthScale);
};

/**
 * Scale a size based on screen height
 * @param size - Size to scale
 */
export const verticalScale = (size: number): number => {
  return Math.round(size * heightScale);
};

/**
 * Moderate scaling - useful for fonts and elements that shouldn't scale too dramatically
 * @param size - Size to scale
 * @param factor - Optional factor to control scaling intensity (default: 0.5)
 */
export const moderateVerticalScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (verticalScale(size) - size) * factor);
};

/**
 * Scale fonts based on screen size and pixel density
 * @param size - Font size to scale
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Get responsive padding/margin values
 * @param size - Base size to scale
 */
export const spacing = {
  xs: horizontalScale(4),
  sm: horizontalScale(8),
  md: horizontalScale(16),
  lg: horizontalScale(24),
  xl: horizontalScale(32),
  xxl: horizontalScale(40),
};

/**
 * Get responsive border radius values
 */
export const borderRadius = {
  xs: moderateVerticalScale(4),
  sm: moderateVerticalScale(8),
  md: moderateVerticalScale(12),
  lg: moderateVerticalScale(16),
  xl: moderateVerticalScale(24),
  round: moderateVerticalScale(50),
}; 