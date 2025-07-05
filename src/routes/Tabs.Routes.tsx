import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TopBar from '@/components/TopBar';
import {backgroundPrimary, primaryColor} from '@/theme/colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Platform} from 'react-native';
import {House, LayoutGrid, Earth, User} from 'lucide-react-native';

const isIOS = Platform.OS === 'ios';

const Tabs = createBottomTabNavigator();

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
            height: isIOS ? hp(8) : hp(6),
          },
        }}>
        <Tabs.Screen
          options={{
            title: 'Home',
            tabBarIcon: ({color}) => <House color={color} />,
          }}
          name="Home"
          component={Home}
        />
        <Tabs.Screen
          options={{
            title: 'Services',
            tabBarIcon: ({color}) => <LayoutGrid color={color} />,
          }}
          name="Services"
          component={Home}
        />
        <Tabs.Screen
          options={{
            title: 'Community',
            tabBarIcon: ({color}) => <Earth color={color} />,
          }}
          name="Community"
          component={Home}
        />
        <Tabs.Screen
          options={{
            title: 'Profile',
            tabBarIcon: ({color}) => <User color={color} />,
          }}
          name="Profile"
          component={Home}
        />
      </Tabs.Navigator>
    </>
  );
}

function Home() {
  return <View style={{flex: 1}} />;
}
