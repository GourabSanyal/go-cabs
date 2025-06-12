import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screen1 from '../modules/onboarding/Screen1';
import Screen2 from '../modules/onboarding/Screen2';
import Screen4 from '../modules/onboarding/Screen4';
import Screen3 from '../modules/onboarding/Screen3';

const OnboardingStack = createNativeStackNavigator();

const OnboardingNavigator = () => {
    return (
        <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
            <OnboardingStack.Screen name="Screen1" component={Screen1} />
            <OnboardingStack.Screen name="Screen2" component={Screen2} />
            <OnboardingStack.Screen name="Screen3" component={Screen3} />
            <OnboardingStack.Screen name="Screen4" component={Screen4} />
        </OnboardingStack.Navigator>
    );
};

export default OnboardingNavigator;
