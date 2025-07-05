import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ProfileAvatar from '../../../assets/images/icons/profile-avatar.svg';
import RatingStar from '../../../assets/images/icons/rating-star.svg';
import {primaryColor} from '../../theme/colors';
import Margin from '../../components/Margin';
import {Icon} from '@ui-kitten/components';
import {StackActions, useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import {getAuth, signOut} from '@react-native-firebase/auth';

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

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.dispatch(StackActions.replace('AuthScreens'));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}>
          <View>
            <Text style={styles.h1}>Arjun sharma</Text>
            <Text style={styles.h3}>+1 1234567890</Text>
            <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <Text style={styles.ratingText}>5</Text>
            </View>
          </View>
          <ProfileAvatar width={70} height={70} />
        </View>

        <Margin margin={20} />
        <CustomButton
          title="Safety Check"
          onPress={() => navigation.dispatch(StackActions.push('SafetyCheck'))}
          status="primary"
          size="medium"
        />

        <Margin margin={20} />
        <View style={{gap: 20}}>
          {profileListItems?.map((item, i) => (
            <TouchableOpacity
              activeOpacity={0.95}
              key={i}
              style={styles.listitem}
              onPress={() => navigation.dispatch(StackActions.push(item.path))}>
              <Icon
                name={item?.icon}
                fill={primaryColor}
                width={25}
                height={25}
              />
              <Text style={styles.h2}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.listitem}>
            <Icon name="settings" fill={primaryColor} width={25} height={25} />
            <Text style={styles.h2} onPress={() => handleLogout()}>
              Logout
            </Text>
          </View>
        </View>
      </View>
    </>
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
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
    gap: 10,
  },
  h1: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 25,
  },
  h3: {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  h2: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  ratingText: {
    color: primaryColor,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 5,
    marginTop: 3,
    fontSize: 16,
  },
  listitem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
    paddingBottom: 15,
  },
});
