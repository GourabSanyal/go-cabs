import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal as RNModal,
} from 'react-native';
import {Button, Card, Icon, Layout} from '@ui-kitten/components';
import {useNavigation, useRoute, StackActions} from '@react-navigation/native';
import {primaryColor, errorColor} from '../../theme/colors';

const SearchDriver = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const renderBidItem = () => (
    <Card style={styles.bidCard}>
      <View style={styles.bidContent}>
        <Icon name="person-outline" fill={primaryColor} style={styles.icon} />
        <View style={styles.bidDetails}>
          <Text style={styles.bidText}>Driver: ...driverSocketId</Text>
          <Text style={styles.bidText}>Bid Amount: 100</Text>
        </View>
        <Button size="small">Select Driver</Button>
      </View>
    </Card>
  );

  if (!route.params) {
    return (
      <Layout style={styles.centered}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Loading ride details...</Text>
      </Layout>
    );
  }

  // return (
  //   <Layout style={styles.centered}>
  //     <Text style={styles.errorText}>
  //       This ride request (ID: rideId) is no longer active or has been
  //       superseded by Ride ID: rideid.
  //     </Text>
  //     <Button
  //       onPress={() => navigation.dispatch(StackActions.push('BookRide'))}
  //       style={{marginTop: 20}}>
  //       Go to Booking
  //     </Button>
  //   </Layout>
  // );

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>Searching for Drivers</Text>
        <Text style={styles.subtitle}>Ride ID: rideId</Text>
        <Text style={styles.subtitle}>Bidding Room: biddingRoomId</Text>

        <Card style={styles.rideInfoCard}>
          <Text style={styles.cardTitle}>Ride Details:</Text>
          <Text>From: pickupLocation</Text>
          <Text>To: dropoffLocation</Text>
          <Text>Estimated Base Fare: initialRideDetails</Text>
        </Card>

        <View style={styles.centered}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.statusText}>Initializing Ride...</Text>
        </View>

        {/* {currentRideState.status === 'pending_bids' &&
          currentRideState.rideId === route.params.rideId && (
            <>
              {bidsForThisRide.length === 0 && !isLoading && (
                <Text style={styles.statusText}>
                  No bids received yet. Waiting for drivers to bid on Ride ID:{' '}
                  {route.params.rideId}...
                </Text>
              )}
              {bidsForThisRide.length > 0 && (
                <Text style={styles.bidsTitle}>
                  Available Bids for Ride ID: {route.params.rideId}
                </Text>
              )}
              <FlatList
                data={bidsForThisRide}
                renderItem={renderBidItem}
                keyExtractor={item => item.driverSocketId}
              />
            </>
          )} */}

        {/* {error && currentRideState.rideId === route.params.rideId && (
          <Text style={styles.errorText}>{error}</Text>
        )} */}
      </ScrollView>
      {/* {isLoading && currentRideState.rideId === route.params.rideId && (
        <RNModal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {}}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color={primaryColor} />
              <Text style={styles.modalText}>
                {currentRideState.status === 'creating_request'
                  ? 'Creating Ride Request...'
                  : currentRideState.status === 'pending_bids' && isLoading
                  ? 'Submitting selection...'
                  : 'Processing...'}
              </Text>
            </View>
          </View>
        </RNModal>
      )} */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContentContainer: {
    flexGrow: 1,
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
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  rideInfoCard: {
    marginBottom: 20,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bidsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  bidCard: {
    marginBottom: 12,
  },
  bidContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  bidDetails: {
    flex: 1,
  },
  bidText: {
    fontSize: 14,
    color: '#333',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    color: '#555',
  },
  errorText: {
    color: errorColor,
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginTop: 15,
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
  },
});

export default SearchDriver;
