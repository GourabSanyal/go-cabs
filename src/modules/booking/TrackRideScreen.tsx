import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
  StackActions,
} from '@react-navigation/native';
import {primaryColor, errorColor, successColor} from '../../theme/colors';
import WebView from 'react-native-webview';
import CustomButton from '@/components/CustomButton';

const screenHeight = Dimensions.get('window').height;

type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

const TrackRideScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = React.useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // if (!route.params) {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color={primaryColor} />
  //       <Text>Loading ride details...</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.centered}>
  //     <Text style={styles.errorText}>
  //       This ride is no longer active or has been superseded.
  //     </Text>
  //   </View>
  // );

  const destinationAddress = 'dropoffLocation';

  // const getPaymentStatusDisplay = () => {
  //   if (!currentSession) {
  //     return {text: "Payment not required", color: successColor};
  //   }

  //   switch (currentSession.status) {
  //     case "completed":
  //       return {
  //         text: `Payment Confirmed (${currentSession.transactionHash?.slice(
  //           0,
  //           8,
  //         )}...)`,
  //         color: successColor,
  //       };
  //     case "pending":
  //       return {text: "Payment Pending", color: "#FFA500"};
  //     case "expired":
  //       return {text: "Payment Expired", color: errorColor};
  //     case "failed":
  //       return {text: "Payment Failed", color: errorColor};
  //     default:
  //       return {text: "Payment Status Unknown", color: "#888"};
  //   }
  // };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mapViewContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{uri: 'file:///android_asset/map.html'}}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
      <ScrollView
        style={styles.detailsScrollViewContainer}
        contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Tracking Your Ride</Text>
        <Text style={styles.subtitle}>Ride ID: rideId</Text>

        {/* Payment Status Card */}
        <View style={styles.paymentStatusContainer}>
          <Text style={styles.sectionTitle}>Payment Status:</Text>
          <Text style={[styles.paymentStatusText, {color: 'green'}]}>
            PENDING
          </Text>
          <Text style={styles.paymentDetailsText}>Amount Paid: 4SOL</Text>
        </View>

        <View style={styles.rideInfoContainer}>
          <Text style={styles.sectionTitle}>Ride Details:</Text>
          <Text style={styles.infoText}>From:pickupLocation</Text>
          <Text style={styles.infoText}>To: {destinationAddress}</Text>
          <Text style={styles.infoText}>Fare:{'100'}</Text>
        </View>

        <View style={styles.driverInfoContainer}>
          <Text style={styles.sectionTitle}>Driver Information:</Text>
          <Text style={styles.infoText}>Name: Driver name</Text>
          <Text style={styles.infoText}>Vehicle: Toyota camry</Text>
          <Text style={styles.infoText}>Rating: 5</Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Driver Location:</Text>
          <Text style={styles.infoText}>Latitude: 24.572025</Text>
          <Text style={styles.infoText}>Longitude: 24.570572</Text>
        </View>
        <CustomButton title='Navigate' onPress={() => navigation.dispatch(StackActions.push("BookingDetails"))} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mapViewContainer: {
    height: screenHeight * 0.4,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  webview: {
    flex: 1,
  },
  detailsScrollViewContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: primaryColor,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  paymentStatusContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  paymentStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDetailsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  rideInfoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  driverInfoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  errorText: {
    color: errorColor,
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
});

export default TrackRideScreen;
