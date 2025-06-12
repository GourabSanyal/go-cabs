import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RideRequest, QuotationRequestPayload} from "../ride/types/ride.types";
import {NavigatorScreenParams} from "@react-navigation/native";

export type UserStackParamList = {
  Home: undefined;
  Service: undefined;
  Community: undefined;
  Profile: {userType: "User"};
  MatchedDrivers: undefined;
  Logistics: undefined;
  AirportService: undefined;
  EventService: undefined;
};

export type DriverStackParamList = {
  Home: undefined;
  History: undefined;
  Community: undefined;
  Profile: {userType: "Driver"};
};

export type ProfileStackParamList = {
  EditProfile: undefined;
  SafetyCheck: undefined;
  TwoStepVerification: undefined;
  EmergencyContact: undefined;
  Settings: undefined;
  ManageAccount: undefined;
  FAQs: undefined;
  PrivacyPolicy: undefined;
  TermsAndCondition: undefined;
};

// Define the structure for SelectedLocation, to be used by BookRide params
// This should ideally be in a more common types file if used elsewhere, but for now, here is fine.
interface SelectedLocationType {
  // Renamed to avoid conflict if Home.tsx also defines it
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type BookingStackParamList = {
  BookRide:
    | {
        pickupLocation?: SelectedLocationType; // Added param
        dropOffLocation?: SelectedLocationType; // Added param
      }
    | undefined; // Allow undefined if navigating without params initially, though Home.tsx will always pass them
  SearchDriver: {
    rideId: string;
    biddingRoomId: string;
    initialRideDetails: RideRequest;
  };
  TrackRideScreen: {
    rideId: string;
    active_ride_room_id: string;
    selectedDriverInfo: any;
    rideDetails?: QuotationRequestPayload | RideRequest;
    acceptedAmount?: number;
    acceptedCurrency?: string;
  };
  BookingDetails: undefined;
  CallDriver: undefined;
  MessageDriver: undefined;
  RideCompleted: undefined;
  AcceptRide: undefined;
  RideCompleteDriver: undefined;
  UpcomingRideInfo: undefined;
  ViewBidsScreen: {quotationId: string};
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  VerifyOtp: undefined;
};

export type OnboardingStackParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
  Screen4: undefined;
};

export type RootStackParamList = {
  AuthScreens: {screen: keyof AuthStackParamList};
  OnboardingScreens: {screen: keyof OnboardingStackParamList};
  UserScreens: {screen: keyof UserStackParamList};
  DriverScreens: {screen: keyof DriverStackParamList};
  ProfileScreens: {screen: keyof ProfileStackParamList};
  BookingRoutes: NavigatorScreenParams<BookingStackParamList>;
};

/**
 * Navigation Prop Type
 * Type-safe navigation prop for components using the root stack navigator
 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Screen Props Type
 * Generic type for screen components that receive navigation props
 */
export type ScreenProps = {
  navigation: RootNavigationProp;
};
