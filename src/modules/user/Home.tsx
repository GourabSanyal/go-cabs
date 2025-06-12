import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, {useState, useEffect, useRef} from "react";
import {useRecoilState} from "recoil";
import {rideAtom} from "../../store/atoms/ride/rideAtom";
import HomeBanner from "./components/HomeBanner";
import Margin from "../../components/Margin";
import LocationInput from "../../components/LocationInput";
import {useSocket} from "../../hooks/useSocket";
import {useNavigation, NavigationProp} from "@react-navigation/native";
import {
  BookingStackParamList,
  RootStackParamList,
} from "../../types/navigation/navigation.types";

interface SelectedLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const {width, height} = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [rideState, setRideState] = useRecoilState(rideAtom);
  const {isConnected} = useSocket();

  const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(
    null,
  );
  const [dropOffLocation, setDropOffLocation] =
    useState<SelectedLocation | null>(null);
  const [isPickupActive, setIsPickupActive] = useState(false);
  const [isDropOffActive, setIsDropOffActive] = useState(false);

  // Effect to deactivate pickup input after selection
  useEffect(() => {
    if (pickupLocation && isPickupActive) {
      // Only deactivate if it was active and a selection was made
      // This check prevents deactivating if pickupLocation was set by other means while input wasn't focused
      setIsPickupActive(false);
    }
  }, [pickupLocation]); // Dependency: only pickupLocation

  // Effect to deactivate dropOff input after selection
  useEffect(() => {
    if (dropOffLocation && isDropOffActive) {
      setIsDropOffActive(false);
    }
  }, [dropOffLocation]); // Dependency: only dropOffLocation

  const handleGoToBooking = () => {
    if (!pickupLocation || !dropOffLocation) {
      Alert.alert(
        "Missing Information",
        "Please select both pickup and drop-off locations.",
      );
      return;
    }
    navigation.navigate("BookingRoutes", {
      screen: "BookRide",
      params: {
        pickupLocation: pickupLocation,
        dropOffLocation: dropOffLocation,
      },
    });
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContentContainer}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}>
      <View style={styles.container}>
        <Margin margin={10} />
        <Text style={styles.headerText}>Where to?</Text>

        <View style={styles.locationInputWrapper}>
          <LocationInput
            placeholder="Enter Pickup Location"
            onLocationSelect={(location: SelectedLocation) => {
              setPickupLocation(location);
            }}
            value={pickupLocation?.address}
            isActive={isPickupActive}
            onFocus={() => {
              setIsPickupActive(true);
              setIsDropOffActive(false);
            }}
            mapboxAccessToken="pk.eyJ1IjoiZ29jYWJzIiwiYSI6ImNtYXBnMmJncTA4NXQyanF2NXIzMHEwNWkifQ.7arQIkXZmcjAiGaqPRKDAQ"
          />
        </View>
        <Margin margin={10} />
        <View style={styles.locationInputWrapper}>
          <LocationInput
            placeholder="Enter Drop-off Location"
            onLocationSelect={(location: SelectedLocation) => {
              setDropOffLocation(location);
            }}
            value={dropOffLocation?.address}
            isActive={isDropOffActive}
            onFocus={() => {
              setIsDropOffActive(true);
              setIsPickupActive(false);
            }}
            mapboxAccessToken="pk.eyJ1IjoiZ29jYWJzIiwiYSI6ImNtYXBnMmJncTA4NXQyanF2NXIzMHEwNWkifQ.7arQIkXZmcjAiGaqPRKDAQ"
          />
        </View>

        <TouchableOpacity
          onPress={handleGoToBooking}
          style={[
            styles.bookingButton,
            (!pickupLocation || !dropOffLocation) && styles.disabledButton,
            styles.bookButtonTopMargin,
          ]}
          disabled={!pickupLocation || !dropOffLocation}>
          <Text style={styles.bookingButtonText}>Book a New Ride</Text>
        </TouchableOpacity>

        <Margin margin={20} />
        <HomeBanner />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#242E2A",
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#242E2A",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  locationInputWrapper: {
    zIndex: 10,
    marginBottom: 5,
  },
  bookingButton: {
    backgroundColor: "#00BF72",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonTopMargin: {
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
