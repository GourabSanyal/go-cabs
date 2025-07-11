import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, RouteProp, StackActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {primaryColor, backgroundPrimary, errorColor} from '../../theme/colors';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import Margin from '@/components/Margin';
import CustomButton from '@/components/CustomButton';
// import PaymentModal from '@/components/modals/PaymentModal';

// Define local color constants
const localTextPrimaryColor = '#EAEAEA';
const localTextSecondaryColor = '#B0B0B0';
const localAccentColor = primaryColor;

const ViewBidsScreen = () => {
  const navigation = useNavigation();
  const db = getFirestore();

  // const renderBidItem = () => (
  //   <TouchableOpacity
  //     style={styles.bidItem}
  //     disabled={isProcessingPayment}>
  //     <Text style={styles.driverName}>
  //     driverName (Rating:{' '}
  //       driverRating★)
  //     </Text>
  //     <Text style={styles.vehicleDetails}>Vehicle: vehicleDetails</Text>
  //     <Text style={styles.bidAmount}>
  //       Bid: ₹bidAmount - ETA: estimatedArrivalTime
  //     </Text>
  //     <Text style={styles.timestampText}>
  //       Bid Placed: bidAt
  //     </Text>
  //       <View style={styles.processingIndicator}>
  //         <Text style={styles.processingText}>Processing payment...</Text>
  //       </View>
  //   </TouchableOpacity>
  // );

  // Loading states based on socket state
  // return (
  //   <View style={styles.containerCentered}>
  //     <Text style={styles.infoText}>
  //       Requesting Bids for Quotation ID: {quotationId}...
  //     </Text>
  //     <Text style={styles.infoText}>
  //       Current Status: {currentRideState?.status || 'Initializing...'}
  //     </Text>
  //   </View>
  // );

  // If status is something other than pending_bids (and not a loading/transition state handled above or by navigation effect)
  // return (
  //   <View style={styles.containerCentered}>
  //     <Text style={styles.infoText}>
  //       Status: {currentRideState.status}. Waiting for updates or navigation.
  //     </Text>
  //     {currentRideState.errorMessage && (
  //       <Text style={styles.infoTextError}>
  //         Error: {currentRideState.errorMessage}
  //       </Text>
  //     )}
  //     <Margin margin={10} />
  //     <CustomButton
  //       title="Go Back"
  //       onPress={() => navigation.canGoBack() && navigation.goBack()}
  //     />
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Available Bids for Quotation ID: quotationId
      </Text>
      <Text style={styles.subHeader}>
        Select a bid to proceed with payment and ride confirmation
      </Text>

      {/* { 
      bids.length === 0 ? (*/}
      <Text style={styles.infoText}>
        No bids received yet. Waiting for drivers...
      </Text>
      {/* ) : (
        // <FlatList
          data={bids}
          renderItem={renderBidItem}
          keyExtractor={item => item.id}
          style={styles.list}
          extraData={isProcessingPayment}
        />
      )} */}

      <Margin margin={10} />
      <CustomButton
        title="Cancel Quotation"
        onPress={() => {
          Alert.alert(
            'Cancel Quotation',
            'Are you sure you want to cancel this quotation request?',
            [
              {text: 'No', style: 'cancel'},
              { // TODO: DELETE LATER
                text: 'Navigate',
                 style: 'cancel',
                onPress: () => navigation.dispatch(
                  StackActions.push("TrackRideScreen")
                )
              },
              {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: () => navigation.goBack(),
              },
            ],
          );
        }}
        status="danger"
        // disabled={isProcessingPayment}
      />

      {/* Payment Modal */}
      {/* <PaymentModal
        visible={paymentModalVisible}
        onClose={handlePaymentModalClose}
        onPaymentComplete={handlePaymentComplete} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundPrimary,
    padding: 16,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundPrimary,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: localTextPrimaryColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: localTextSecondaryColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  bidItem: {
    backgroundColor: '#2C3E50',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: localTextPrimaryColor,
  },
  vehicleDetails: {
    fontSize: 14,
    color: localTextSecondaryColor,
    marginVertical: 4,
  },
  bidAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: localAccentColor,
  },
  timestampText: {
    fontSize: 12,
    color: localTextSecondaryColor,
    marginTop: 4,
  },
  processingIndicator: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(1, 205, 93, 0.1)',
    borderRadius: 4,
  },
  processingText: {
    fontSize: 12,
    color: primaryColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 16,
    color: localTextSecondaryColor,
    textAlign: 'center',
    marginTop: 20,
  },
  infoTextError: {
    color: errorColor,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ViewBidsScreen;
