import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Dimensions as RNDimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
import WebView from 'react-native-webview';
import {backgroundPrimary, primaryColor} from '../../theme/colors';
import DullDivider from '../../components/DullDivider';
import CarIcon from '../../../assets/images/icons/car.svg';
import {Driver} from '../../types/driver/driverTypes';
import Margin from '@/components/Margin';
import CustomButton from '@/components/CustomButton';
import {
  StackActions,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import type {RootStackParamList} from '@/types/navigation';

const {height: screenHeight} = RNDimensions.get('window');

interface AnimatedDriver extends Driver {
  animationId: string;
  visible: boolean;
  exiting: boolean;
}

type BookRideRouteProp = RouteProp<RootStackParamList, 'BookRide'>;

const BookRide = () => {
  const navigation = useNavigation();
  const route = useRoute<BookRideRouteProp>();
  const webViewRef = useRef<WebView>(null);
  const [animatedDrivers, setAnimatedDrivers] = useState<AnimatedDriver[]>([]);
  const [showChargingStations, setShowChargingStations] = useState(true);

  const {pickupLocation, dropOffLocation} = route.params;
  const finalPickupCoords = pickupLocation?.coordinates;
  const finalDropOffCoords = dropOffLocation?.coordinates;

  const animationsMap = useRef(
    new Map<
      string,
      {
        translateX: Animated.Value;
        progress: Animated.Value;
        opacity: Animated.Value;
      }
    >(),
  );

  const renderDriverItem = (driver: AnimatedDriver) => {
    if (!driver.visible) return null;
    const animationValues = animationsMap.current.get(driver.animationId);
    if (!animationValues) return null;

    const {translateX, progress, opacity} = animationValues;

    return (
      <Animated.View
        key={driver.animationId}
        style={[
          styles.driverItem,
          {
            transform: [{translateX}],
            opacity,
          },
        ]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <TouchableOpacity style={styles.driverItem}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>{driver.name.charAt(0)}</Text>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.h1}>{driver.name}</Text>
            <Text style={styles.h2}>
              {driver.vehiclemodel.split(' ')[0]} • {driver.regnumber.slice(-4)}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {driver.rating}</Text>
            </View>
          </View>
          <Text style={styles.callButtonText}>{driver.bidAmount}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const sendDataToWebView = () => {
    if (webViewRef.current && finalPickupCoords && finalDropOffCoords) {
      const script = `
        if (window.setLocationsAndCalculateRoute) {
          window.setLocationsAndCalculateRoute(${finalPickupCoords.lng}, ${finalPickupCoords.lat}, ${finalDropOffCoords.lng}, ${finalDropOffCoords.lat});
        } else {
          console.warn('setLocationsAndCalculateRoute not ready in WebView');
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  return (
    <ScrollView
      style={styles.mainScrollContainer}
      contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.container}>
        <View style={styles.locationSummaryContainer}>
          <Text style={styles.locationSummaryText}>
            Pickup: {pickupLocation?.address || 'Not Selected'}
          </Text>
          <Text style={styles.locationSummaryText}>
            Drop-off: {dropOffLocation?.address || 'Not Selected'}
          </Text>
          <View style={styles.chargingToggleContainer}>
            <Text style={styles.switcText}>Show EV Charging Stations</Text>
            <Switch
              value={showChargingStations}
              onValueChange={() =>
                setShowChargingStations(!showChargingStations)
              }
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={showChargingStations ? primaryColor : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{uri: 'file:///android_asset/map.html'}}
            style={styles.map}
            onLoadEnd={sendDataToWebView}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('[BookRide] WebView error: ', nativeEvent);
            }}
            onMessage={event => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log('[BookRide] Message from WebView:', data);
                if (data.type === 'fetchChargingStations') {
                  // handleFetchChargingStations(data.latitude, data.longitude, data.distance);
                }
              } catch (error) {
                console.error(
                  '[BookRide] Error parsing WebView message:',
                  error,
                );
              }
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </View>

        <View style={styles.tabContainer}>
          <>
            <DullDivider />
            <View>
              <TouchableOpacity
                style={[styles.listItem, styles.selectedRide]}
                onPress={() => {
                  const priceString = '100';
                  const numericPrice = parseInt(
                    priceString.replace('₹ ', ''),
                    10,
                  );
                  if (!isNaN(numericPrice)) {
                    // handleRideSelection(item.name, numericPrice);
                  } else {
                    console.error('Could not parse price:', priceString);
                  }
                }}>
                <CarIcon width={50} height={50} />
                <View style={{flexGrow: 1}}>
                  <Text style={styles.h1}>Taxi Go</Text>
                  <Text style={styles.h2}>Arrives in 5 mins</Text>
                </View>
                <Text style={[styles.h1, {alignSelf: 'flex-start'}]}>
                  ₹ 100
                </Text>
              </TouchableOpacity>
            </View>
            <Margin margin={10} />
            <View style={{paddingHorizontal: 20, marginTop: 5}}>
              <CustomButton
                onPress={() =>
                  navigation.dispatch(StackActions.push('ViewBidsScreen'))
                }
                title="Continue Booking"
                status="primary"
                size="medium"
              />
            </View>
          </>
          {/* <>
            <View style={{padding: 20}}>
              <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backButtonText}>
                  ← Back to vehicle selection
                </Text>
              </TouchableOpacity>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Estimated Price:</Text>
                <Text style={styles.priceValue}>100 </Text>
              </View>
              <RadioGroup>
                
              </RadioGroup>
              <View style={{marginTop: 15}}>
                <CustomButton
                  title="Request Quotes"
                  status="primary"
                  size="medium"
                  disabled={false}
                />
              </View>
              <Text style={styles.paymentNote}>
                Payment will be required after selecting a driver bid
              </Text>
            </View>
          </> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default BookRide;

const styles = StyleSheet.create({
  selectedRide: {
    backgroundColor: 'rgba(214, 255, 239, 0.2)',
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: primaryColor,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(214, 255, 239, 0.1)',
    borderRadius: 8,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInitial: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 15,
  },
  h1: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  },
  h2: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#B9B9B9',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  callButton: {
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  switcText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  chargingToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  webview: {
    width: '100%',
    height: 320,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
  },
  h3: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    flexGrow: 1,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  chipContainer: {
    backgroundColor: '#D6FFEF',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#85FFCE',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#005231',
  },
  backButton: {
    marginBottom: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#353f3b',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  successButton: {
    width: '100%',
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  spinningIcon: {
    transform: [{rotate: '0deg'}],
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#353f3b',
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  priceValue: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: primaryColor,
  },
  paymentNote: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
  },
  mainScrollContainer: {
    flex: 1,
    backgroundColor: backgroundPrimary,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: backgroundPrimary,
  },
  locationSummaryContainer: {
    padding: 15,
    backgroundColor: '#353f3b',
    borderRadius: 8,
    marginBottom: 20,
  },
  locationSummaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 5,
  },
  containerAlteredForMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: backgroundPrimary,
  },
  messageText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  tabContainer: {
    flex: 1,
  },
  mapContainer: {
    height: screenHeight * 0.3,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
const ridesData = [
  {
    name: 'Classic',
    price: '₹ 150',
    arrival: 'Arrives in 15 mins',
  },
  {
    name: 'Prime',
    price: '₹ 162',
    arrival: 'Arrives in 12 mins',
  },
  {
    name: 'Delux',
    price: '₹ 175',
    arrival: 'Arrives in 11 mins',
  },
  {
    name: 'Pro',
    price: '₹ 198',
    arrival: 'Arrives in 09 mins',
  },
];
const ridesDataCompared = [
  {
    id: '7',
    name: 'Ola Rides',
    price: '₹ 180-225',
    arrival: 'Avg arriving in 22 mins',
  },
  {
    id: '8',
    name: 'Rapido Rides',
    price: '₹ 186-218',
    arrival: 'Avg arriving in 18 mins',
  },
  {
    id: '9',
    name: 'Uber Rides',
    price: '₹ 191-232',
    arrival: 'Avg arriving in 18 mins',
  },
  {
    id: '10',
    name: 'BluSmart Rides',
    price: '₹ 181-212',
    arrival: 'Avg arriving in 20 mins',
  },
];
