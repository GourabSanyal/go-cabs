import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Service from '../modules/main/Service';
import MatchedDrivers from '../modules/main/services/MatchedDrivers';
import Logistics from '../modules/main/services/Logistics';
import AirportService from '../modules/main/services/AirportService';
import EventService from '../modules/main/services/EventService';

const ServicesStack = createNativeStackNavigator();

const ServicesNavigator = () => {
  return (
    <ServicesStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <ServicesStack.Screen name="Service" component={Service} />
      <ServicesStack.Screen name="MatchedDrivers" component={MatchedDrivers} />
      <ServicesStack.Screen name="Logistics" component={Logistics} />
      <ServicesStack.Screen name="AirportService" component={AirportService} />
      <ServicesStack.Screen name="EventService" component={EventService} />
    </ServicesStack.Navigator>
  );
};

export default ServicesNavigator;
