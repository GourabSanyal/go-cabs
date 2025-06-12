import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../modules/auth/Login';
import Signup from '../modules/auth/Signup';
import SplashScreen from '../components/SplashScreen';
import VerifyOtp from '../modules/auth/VerifyOtp';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Splash" component={SplashScreen} />
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Signup} />
            <AuthStack.Screen name="VerifyOtp" component={VerifyOtp} />
            </AuthStack.Navigator>
    );
};

export default AuthNavigator;
