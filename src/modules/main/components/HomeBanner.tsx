import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {primaryColor} from '../../../theme/colors';
import {LinearGradient} from 'react-native-linear-gradient';
import ClassicRideLogo from '../../../../assets/images/icons/classic-ride.svg';
import DeluxeRideLogo from '../../../../assets/images/icons/deluxe-ride.svg';
import PrimeRideLogo from '../../../../assets/images/icons/prime-ride.svg';
import {Icon} from '@ui-kitten/components';
import {
  horizontalScale,
  verticalScale,
  scaleFontSize,
  spacing,
  borderRadius,
  metrics,
} from '../../../utils/responsive';

const HomeBanner = () => {
  // Animation values
  const iconScale = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0.6)).current;
  const numberValue = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-metrics.screenWidth)).current;

  // Setup animations
  useEffect(() => {
    // Icon pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    // Badge glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(badgeOpacity, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    // Number count-up animation
    Animated.timing(numberValue, {
      toValue: 0.2,
      duration: 2000,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();

    // Create shine animation that moves across the component
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: metrics.screenWidth,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(shineAnim, {
          toValue: -metrics.screenWidth,
          duration: 0,
          useNativeDriver: true,
        }),
        // Add delay between animations
        Animated.delay(2000),
      ]),
    ).start();
  }, []);

  // Use state for the formatted number
  const [formattedNumber, setFormattedNumber] = useState('0.0');

  // Update the formatted number when animation value changes
  useEffect(() => {
    const listener = numberValue.addListener(({value}) => {
      setFormattedNumber(value.toFixed(1));
    });

    return () => {
      numberValue.removeListener(listener);
    };
  }, []);

  const logoSize = horizontalScale(50);

  return (
    <>
      <LinearGradient
        colors={['#005935', '#00BF72']}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        style={styles.containerChooseRide}>
        <Text style={[styles.h2, {flexGrow: 1}]}>Choose {'\n'}your ride</Text>
        <View>
          <ClassicRideLogo width={logoSize} height={logoSize} />
          <Text style={styles.h4}>Classic</Text>
        </View>
        <View>
          <DeluxeRideLogo width={logoSize} height={logoSize} />
          <Text style={styles.h4}>Deluxe</Text>
        </View>
        <View>
          <PrimeRideLogo width={logoSize} height={logoSize} />
          <Text style={styles.h4}>Prime</Text>
        </View>
      </LinearGradient>
      <View style={styles.containerWrapper}>
        <View style={styles.container}>
          <View style={styles.carbonSection}>
            {/* Shine effect overlay */}
            <Animated.View
              style={[
                styles.shineEffect,
                {
                  transform: [{translateX: shineAnim}],
                },
              ]}>
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.0)',
                  'rgba(255, 255, 255, 0.4)',
                  'rgba(255, 255, 255, 0.0)',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.carbonIconContainer,
                {transform: [{scale: iconScale}]},
              ]}>
              <Icon
                name="globe-outline"
                width={horizontalScale(24)}
                height={horizontalScale(24)}
                fill={primaryColor}
              />
            </Animated.View>
            <Text style={styles.h1}>
              {formattedNumber} Tons
            </Text>
            <Text style={styles.h3}>Carbon saved by you this year</Text>
            <Animated.View
              style={[styles.ecoTagContainer, {opacity: badgeOpacity}]}>
              <View style={styles.ecoTag}>
                <Text style={styles.ecoTagText}>ECO WARRIOR</Text>
              </View>
            </Animated.View>
          </View>
          <View
            style={{
              width: 1,
              height: '80%',
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          />
          <View style={styles.coinsSection}>
            <View style={styles.coinIconContainer}>
              <Icon
                name="award-outline"
                width={horizontalScale(24)}
                height={horizontalScale(24)}
                fill={primaryColor}
              />
            </View>
            <Text style={[styles.h3, {textAlign: 'center'}]}>You Earned</Text>
            <Text style={styles.h1}>$200.80</Text>
            <Text
              style={[styles.h3, {color: primaryColor, textAlign: 'center'}]}>
              Carbon Coins
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeBanner;

const styles = StyleSheet.create({
  containerChooseRide: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
    padding: spacing.md,
  },
  containerWrapper: {
    borderRadius: borderRadius.lg,
    shadowColor: '#00bf72',
    shadowOffset: {
      width: 0,
      height: verticalScale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: borderRadius.md,
    elevation: 10,
    marginHorizontal: spacing.xs,
  },
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 229, 229, 0.2)',
    backgroundColor: '#1c2722',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.xs,
    overflow: 'hidden',
  },
  carbonSection: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  coinsSection: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  shineEffect: {
    position: 'absolute',
    top: verticalScale(-30),
    left: 0,
    bottom: verticalScale(-30),
    width: horizontalScale(120),
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  carbonIconContainer: {
    backgroundColor: 'rgba(0, 191, 114, 0.15)',
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 114, 0.3)',
  },
  coinIconContainer: {
    backgroundColor: 'rgba(0, 191, 114, 0.15)',
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 114, 0.3)',
  },
  ecoTagContainer: {
    marginTop: spacing.sm,
  },
  ecoTag: {
    backgroundColor: 'rgba(0, 191, 114, 0.2)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 114, 0.3)',
  },
  ecoTagText: {
    color: primaryColor,
    fontFamily: 'Montserrat-Bold',
    fontSize: scaleFontSize(10),
  },
  h1: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: scaleFontSize(35),
    color: primaryColor,
    textAlign: 'center',
  },
  h2: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: scaleFontSize(22),
    color: '#fff',
  },
  h3: {
    fontFamily: 'Montserrat-Bold',
    fontSize: scaleFontSize(16),
    color: '#fff',
    textAlign: 'center',
  },
  h4: {
    fontFamily: 'Montserrat-Bold',
    fontSize: scaleFontSize(12),
    color: '#fff',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
