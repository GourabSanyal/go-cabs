import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import HomeBanner from './components/HomeBanner';
import Margin from '../../components/Margin';
import LocationInput from '../../components/LocationInput';
import {useNavigation} from '@react-navigation/native';

interface SelectedLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();

  const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(
    null,
  );
  const [dropOffLocation, setDropOffLocation] =
    useState<SelectedLocation | null>(null);
  const [isPickupActive, setIsPickupActive] = useState(false);
  const [isDropOffActive, setIsDropOffActive] = useState(false);

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
    backgroundColor: '#242E2A',
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#242E2A',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  locationInputWrapper: {
    zIndex: 10,
    marginBottom: 5,
  },
  bookingButton: {
    backgroundColor: '#00BF72',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonTopMargin: {
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
