import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../modules/main/Home';

const HomeStack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <HomeStack.Screen name="MainHome" component={Home} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
