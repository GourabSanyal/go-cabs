import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {backgroundPrimary} from '../theme/colors';
import AuthRoutes from './Auth.Routes';
import OnbordingRoutes from './Onboarding.Routes';

const RootStack = createNativeStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: backgroundPrimary,
  },
};

const RootNavigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="AuthScreens" component={AuthRoutes} />
        <RootStack.Screen
          name="OnboardingScreens"
          component={OnbordingRoutes}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
