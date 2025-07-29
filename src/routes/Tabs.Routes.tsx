import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TopBar from '@/components/TopBar';
import {backgroundPrimary, primaryColor} from '@/theme/colors';
import {Platform} from 'react-native';
import {House, LayoutGrid, Earth, User} from 'lucide-react-native';
import HomeNavigator from './Home.Routes';
import ServicesNavigator from './Services.Routes';
import CommunityNavigator from './Community.Routes';
import ProfileNavigator from './Profile.Routes';
import {
  horizontalScale,
  verticalScale,
  metrics,
  scaleFontSize,
} from '../utils/responsive';

const Tabs = createBottomTabNavigator();

const TAB_ICON_SIZE = horizontalScale(24);
const TAB_BAR_HEIGHT = Platform.select({
  ios: verticalScale(85),
  android: verticalScale(85),
});

export default function TabsNavigator() {
  return (
    <>
      <TopBar />
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: primaryColor,
          tabBarInactiveTintColor: '#fff',
          tabBarActiveBackgroundColor: backgroundPrimary,
          tabBarInactiveBackgroundColor: backgroundPrimary,
          tabBarStyle: {
            backgroundColor: backgroundPrimary,
            borderTopWidth: 0,
            height: TAB_BAR_HEIGHT,
            paddingHorizontal: horizontalScale(10),
            paddingBottom: Platform.OS === 'ios' ? verticalScale(25) : verticalScale(10),
            paddingTop: verticalScale(10),
          },
          tabBarLabelStyle: {
            fontSize: scaleFontSize(12),
            fontFamily: 'Montserrat-Medium',
            paddingBottom: metrics.isSmallDevice ? verticalScale(5) : verticalScale(8),
          },
          tabBarIconStyle: {
            marginTop: verticalScale(4),
          },
        }}>
        <Tabs.Screen
          options={{
            title: 'Home',
            tabBarIcon: ({color}) => (
              <House 
                color={color} 
                width={TAB_ICON_SIZE} 
                height={TAB_ICON_SIZE}
              />
            ),
          }}
          name="Home"
          component={HomeNavigator}
        />
        <Tabs.Screen
          options={{
            title: 'Services',
            tabBarIcon: ({color}) => (
              <LayoutGrid 
                color={color} 
                width={TAB_ICON_SIZE} 
                height={TAB_ICON_SIZE}
              />
            ),
          }}
          name="Services"
          component={ServicesNavigator}
        />
        <Tabs.Screen
          options={{
            title: 'Community',
            tabBarIcon: ({color}) => (
              <Earth 
                color={color} 
                width={TAB_ICON_SIZE} 
                height={TAB_ICON_SIZE}
              />
            ),
          }}
          name="Community"
          component={CommunityNavigator}
        />
        <Tabs.Screen
          options={{
            title: 'Profile',
            tabBarIcon: ({color}) => (
              <User 
                color={color} 
                width={TAB_ICON_SIZE} 
                height={TAB_ICON_SIZE}
              />
            ),
          }}
          name="Profile"
          component={ProfileNavigator}
        />
      </Tabs.Navigator>
    </>
  );
}