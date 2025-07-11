import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../modules/main/Home';
import BookRide from "../modules/booking/BookRide";
import BookingDetails from "../modules/booking/BookingDetails";
import CallDriver from "../modules/booking/CallDriver";
import MessageDriver from "../modules/booking/MessageDriver";
import RideCompleted from "../modules/booking/RideComplete";
import AcceptRide from "../modules/booking/AcceptRide";
import RideCompleteDriver from "../modules/booking/RideCompleteDriver";
import UpcomingRideInfo from "../modules/booking/UpcomingRideInfo";
import ViewBidsScreen from "../modules/booking/ViewBidsScreen";
import TrackRideScreen from "../modules/booking/TrackRideScreen";

const HomeStack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <HomeStack.Screen name="MainHome" component={Home} />
      <HomeStack.Screen name="BookRide" component={BookRide} />
      <HomeStack.Screen name="ViewBidsScreen" component={ViewBidsScreen} />
      <HomeStack.Screen name="TrackRideScreen" component={TrackRideScreen} />
      <HomeStack.Screen name="BookingDetails" component={BookingDetails} />
      <HomeStack.Screen name="CallDriver" component={CallDriver} />
      <HomeStack.Screen name="MessageDriver" component={MessageDriver} />
      <HomeStack.Screen name="RideCompleted" component={RideCompleted} />
      <HomeStack.Screen name="AcceptRide" component={AcceptRide} />
      <HomeStack.Screen
        name="RideCompleteDriver"
        component={RideCompleteDriver}
      />
      <HomeStack.Screen
        name="UpcomingRideInfo"
        component={UpcomingRideInfo}
      />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
