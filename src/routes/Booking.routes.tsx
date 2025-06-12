import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import BookRide from "../modules/booking/BookRide";
import TopBar from "../components/TopBar";
import BookingDetails from "../modules/booking/BookingDetails";
import CallDriver from "../modules/booking/CallDriver";
import MessageDriver from "../modules/booking/MessageDriver";
import RideCompleted from "../modules/booking/RideComplete";
import AcceptRide from "../modules/booking/AcceptRide";
import RideCompleteDriver from "../modules/booking/RideCompleteDriver";
import UpcomingRideInfo from "../modules/booking/UpcomingRideInfo";
import ViewBidsScreen from "../modules/booking/ViewBidsScreen";
import TrackRideScreen from "../modules/booking/TrackRideScreen";
import {BookingStackParamList} from "../types/navigation/navigation.types";

const BookingStack = createNativeStackNavigator<BookingStackParamList>();

const BookingNavigator = () => {
  return (
    <>
      <TopBar />
      <BookingStack.Navigator screenOptions={{headerShown: false}}>
        <BookingStack.Screen name="BookRide" component={BookRide} />
        <BookingStack.Screen name="ViewBidsScreen" component={ViewBidsScreen} />
        <BookingStack.Screen
          name="TrackRideScreen"
          component={TrackRideScreen}
        />
        <BookingStack.Screen name="BookingDetails" component={BookingDetails} />
        <BookingStack.Screen name="CallDriver" component={CallDriver} />
        <BookingStack.Screen name="MessageDriver" component={MessageDriver} />
        <BookingStack.Screen name="RideCompleted" component={RideCompleted} />
        <BookingStack.Screen name="AcceptRide" component={AcceptRide} />
        <BookingStack.Screen
          name="RideCompleteDriver"
          component={RideCompleteDriver}
        />
        <BookingStack.Screen
          name="UpcomingRideInfo"
          component={UpcomingRideInfo}
        />
      </BookingStack.Navigator>
    </>
  );
};

export default BookingNavigator;
