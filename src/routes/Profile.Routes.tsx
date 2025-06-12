import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../modules/profile/EditProfile';
import SafetyCheck from '../modules/profile/SafetyCheck';
import TwoStepVerification from '../modules/profile/TwoStepVerification';
import EmergencyContact from '../modules/profile/EmergencyContact';
import Settings from '../modules/profile/Settings';
import ManageAccount from '../modules/profile/ManageAccount';
import FAQs from '../modules/profile/FAQs';
import PrivacyPolicy from '../modules/profile/PrivacyPolicy';
import TermsAndCondition from '../modules/profile/TermsAndCondition';

const ProfileStack = createNativeStackNavigator();

const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="EditProfile" component={EditProfile} />
            <ProfileStack.Screen name="SafetyCheck" component={SafetyCheck} />
            <ProfileStack.Screen name="TwoStepVerification" component={TwoStepVerification} />
            <ProfileStack.Screen name="EmergencyContact" component={EmergencyContact} />
            <ProfileStack.Screen name="Settings" component={Settings} />
            <ProfileStack.Screen name="ManageAccount" component={ManageAccount} />
            <ProfileStack.Screen name="FAQs" component={FAQs} />
            <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <ProfileStack.Screen name="TermsAndCondition" component={TermsAndCondition} />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;









