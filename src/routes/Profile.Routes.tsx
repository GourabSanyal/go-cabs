import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '../modules/main/Profile';
import EditProfile from '@/modules/main/profile/EditProfile';
import SafetyCheck from '@/modules/main/profile/SafetyCheck';
import TwoStepVerification from '@/modules/main/profile/TwoStepVerification';
import EmergencyContact from '@/modules/main/profile/EmergencyContact';
import ManageAccount from '@/modules/main/profile/FAQs';
import PrivacyPolicy from '@/modules/main/profile/PrivacyPolicy';
import Settings from '@/modules/main/profile/Settings';
import FAQs from '@/modules/main/profile/FAQs';
import TermsAndCondition from '@/modules/main/profile/TermsAndCondition';

const ProfileStack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <ProfileStack.Screen name="MainProfile" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="SafetyCheck" component={SafetyCheck} />
      <ProfileStack.Screen
        name="TwoStepVerification"
        component={TwoStepVerification}
      />
      <ProfileStack.Screen
        name="EmergencyContact"
        component={EmergencyContact}
      />
      <ProfileStack.Screen name="Settings" component={Settings} />
      <ProfileStack.Screen name="ManageAccount" component={ManageAccount} />
      <ProfileStack.Screen name="FAQs" component={FAQs} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <ProfileStack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigator;
