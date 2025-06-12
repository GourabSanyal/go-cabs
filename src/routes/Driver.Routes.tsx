import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHome from '../modules/driver/DriverHome';
import TopBar from '../components/TopBar';
import { ScrollView, StyleSheet, View } from 'react-native';
import DriverNavigation from '../components/DriverNavigation';
import Community from '../modules/user/Community';
import Profile from '../modules/user/Profile';
import History from '../modules/driver/History';

const DriverStack = createNativeStackNavigator();

const DriverNavigator = () => {
    return (
        <DriverStack.Navigator screenOptions={{ headerShown: false }}>
            <DriverStack.Screen name="Home" component={withNavAndFooter(DriverHome)} />
            <DriverStack.Screen name="History" component={withNavAndFooter(History)} />
            <DriverStack.Screen name="Community" component={withNavAndFooter(Community)} />
            <DriverStack.Screen
                name="Profile"
                component={withNavAndFooter(Profile)}
                initialParams={{ userType: 'Driver' }}
            />
        </DriverStack.Navigator>
    );
};

export default DriverNavigator;

const withNavAndFooter = (Component: React.ComponentType<any>) => {
    return (props: any) => (
        <View style={{ flex: 1 }}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Component {...props} />
            </ScrollView>
            <DriverNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
});

