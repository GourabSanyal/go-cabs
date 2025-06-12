import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../modules/user/Home';
import withNavAndFooter from '../layouts/NavFooterWrapper';
import Service from '../modules/user/Service';
import Community from '../modules/user/Community';
import Profile from '../modules/user/Profile';
import MatchedDrivers from '../modules/user/services/MatchedDrivers';
import Logistics from '../modules/user/services/Logistics';
import AirportService from '../modules/user/services/AirportService';
import EventService from '../modules/user/services/EventService';

const UserStack = createNativeStackNavigator();

const UserNavigator = () => {
    return (
        <UserStack.Navigator screenOptions={{
            headerShown: false,
            animation: 'none',
        }}>
            <UserStack.Screen name="Home" component={withNavAndFooter(Home)} />
            <UserStack.Screen name="Service" component={withNavAndFooter(Service)} />
            <UserStack.Screen name="Community" component={withNavAndFooter(Community)} />
            <UserStack.Screen
                name="Profile"
                component={withNavAndFooter(Profile)}
                initialParams={{ userType: 'User' }}
            />
            {/* service routes */}
            <UserStack.Screen name="MatchedDrivers" component={withNavAndFooter(MatchedDrivers)} />
            <UserStack.Screen name="Logistics" component={withNavAndFooter(Logistics)} />
            <UserStack.Screen name="AirportService" component={withNavAndFooter(AirportService)} />
            <UserStack.Screen name="EventService" component={withNavAndFooter(EventService)} />
        </UserStack.Navigator>
    );
};

export default UserNavigator;
