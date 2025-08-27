import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {backgroundPrimary} from '../theme/colors';
import AuthRoutes from './Auth.Routes';
import OnbordingRoutes from './Onboarding.Routes';
import TabsNavigator from './Tabs.Routes';
import {useSelector} from 'react-redux';
import {RootState} from '../shared/state/store';
import SplashScreen from '../components/SplashScreen';

const RootStack = createNativeStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: backgroundPrimary,
  },
};

const RootNavigator = () => {
  const {isLoggedIn} = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Splash">
        <RootStack.Screen name="Splash" component={SplashScreen} />
        {!isLoggedIn ? (
          <>
            <RootStack.Screen name="AuthScreens" component={AuthRoutes} />
            <RootStack.Screen
              name="OnboardingScreens"
              component={OnbordingRoutes}
            />
          </>
        ) : (
          <RootStack.Screen name="Tabs" component={TabsNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
