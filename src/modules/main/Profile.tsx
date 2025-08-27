import {StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView} from 'react-native';
import React, { useState } from 'react';
import ProfileAvatar from '../../../assets/images/icons/profile-avatar.svg';
import RatingStar from '../../../assets/images/icons/rating-star.svg';
import {primaryColor} from '../../theme/colors';
import Margin from '../../components/Margin';
import {Icon, Spinner} from '@ui-kitten/components';
import {StackActions, useNavigation, CommonActions} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  horizontalScale,
  verticalScale,
  scaleFontSize,
  spacing,
} from '../../utils/responsive';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../shared/state/auth/reducer';

export type ProfileStackParamList = {
  EditProfile: undefined;
  SafetyCheck: undefined;
  TwoStepVerification: undefined;
  EmergencyContact: undefined;
  Settings: undefined;
  ManageAccount: undefined;
  FAQs: undefined;
  PrivacyPolicy: undefined;
  TermsAndCondition: undefined;
};

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Sign out from Firebase first
      const auth = getAuth();
      await signOut(auth);
      
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.log('Google sign out error:', error);
      }

      // Clear Redux state
      dispatch(logoutSuccess());

      // Navigate directly to Login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'AuthScreens',
              state: {
                routes: [{ name: 'Login' }]
              }
            }
          ],
        })
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const starSize = horizontalScale(20);
  const avatarSize = horizontalScale(70);
  const iconSize = horizontalScale(25);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.h1}>Arjun sharma</Text>
              <Text style={styles.h3}>+1 1234567890</Text>
              <View style={styles.ratingContainer}>
                <RatingStar width={starSize} height={starSize} />
                <RatingStar width={starSize} height={starSize} />
                <RatingStar width={starSize} height={starSize} />
                <RatingStar width={starSize} height={starSize} />
                <RatingStar width={starSize} height={starSize} />
                <Text style={styles.ratingText}>5</Text>
              </View>
            </View>
            <ProfileAvatar width={avatarSize} height={avatarSize} />
          </View>

          <Margin margin={spacing.lg} />
          <CustomButton
            title="Safety Check"
            onPress={() => navigation.dispatch(StackActions.push('SafetyCheck'))}
            status="primary"
            size="medium"
          />

          <Margin margin={spacing.lg} />
          <View style={styles.listContainer}>
            {profileListItems?.map((item, i) => (
              <TouchableOpacity
                activeOpacity={0.95}
                key={i}
                style={styles.listitem}
                onPress={() => navigation.dispatch(StackActions.push(item.path))}>
                <Icon
                  name={item?.icon}
                  fill={primaryColor}
                  width={iconSize}
                  height={iconSize}
                />
                <Text style={styles.h2}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.listitem}
              disabled={isLoggingOut}
              onPress={handleLogout}
              activeOpacity={0.95}>
              <Icon 
                name="settings" 
                fill={isLoggingOut ? `${primaryColor}80` : primaryColor}
                width={iconSize} 
                height={iconSize} 
              />
              <Text style={[styles.h2, isLoggingOut && { opacity: 0.6 }]}>
                Logout
              </Text>
              {isLoggingOut && (
                <View style={styles.loaderContainer}>
                  <Spinner size="small" status="primary" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const profileListItems = [
  {
    title: '2-Step Verification',
    path: 'TwoStepVerification' as keyof ProfileStackParamList,
    icon: 'lock-outline',
  },
  {
    title: 'Emergency contact',
    path: 'EmergencyContact' as keyof ProfileStackParamList,
    icon: 'phone-call',
  },
  {
    title: 'Settings',
    path: 'Settings' as keyof ProfileStackParamList,
    icon: 'settings-2',
  },
  {
    title: 'Manage your account',
    path: 'ManageAccount' as keyof ProfileStackParamList,
    icon: 'person-outline',
  },
  {
    title: 'FAQs',
    path: 'FAQs' as keyof ProfileStackParamList,
    icon: 'question-mark-circle',
  },
  {
    title: 'Privacy policy',
    path: 'PrivacyPolicy' as keyof ProfileStackParamList,
    icon: 'file-text',
  },
  {
    title: 'Terms and Condition',
    path: 'TermsAndCondition' as keyof ProfileStackParamList,
    icon: 'file-text',
  },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  headerContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(2),
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  listContainer: {
    gap: spacing.md,
  },
  h1: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: scaleFontSize(25),
  },
  h3: {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: scaleFontSize(13),
  },
  h2: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: scaleFontSize(18),
  },
  ratingText: {
    color: primaryColor,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: spacing.xs,
    marginTop: verticalScale(3),
    fontSize: scaleFontSize(16),
  },
  listitem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
    paddingVertical: spacing.md,
  },
  loaderContainer: {
    marginLeft: spacing.md,
  },
});
