import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Community from '../modules/main/Community';

const CommunityStack = createNativeStackNavigator();

const CommunityNavigator = () => {
  return (
    <CommunityStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <CommunityStack.Screen 
        name="CommunityScreen" 
        component={Community} 
      />
    </CommunityStack.Navigator>
  );
};

export default CommunityNavigator;
