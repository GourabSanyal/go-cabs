import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal as RNModal,
} from "react-native";
import {Button, Card, Icon, Layout} from "@ui-kitten/components";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import {useSocket} from "../../hooks/useSocket";
import {primaryColor, successColor, errorColor} from "../../theme/colors";
import {
  CurrentRideProgress,
  Bid,
} from "../../services/socket/broadcast/broadcastSocket";
import {BookingStackParamList} from "../../types/navigation/navigation.types";
import {RideRequest} from "../../types/ride/types/ride.types";

interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Type for the route prop using BookingStackParamList
type SearchDriverScreenRouteProp = RouteProp<
  BookingStackParamList,
  "SearchDriver"
>;

const SearchDriver = () => {
  const navigation = useNavigation<NavigationProp<BookingStackParamList>>();
  const route = useRoute<SearchDriverScreenRouteProp>();
  const {currentRideState, selectDriver, socketId, isConnected} = useSocket();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!route.params) {
      console.error("SearchDriver: No route params found on mount effect!");
      Alert.alert("Error", "Ride details not found. Navigating back.", [
        {text: "OK", onPress: () => navigation.goBack()},
      ]);
      return;
    }
    console.log("SearchDriver mounted with params:", route.params);

    console.log("CurrentRideState in SearchDriver:", currentRideState);

    if (currentRideState.status === "creating_request") {
      setIsLoading(true);
      setError(null);
    } else if (currentRideState.status === "pending_bids") {
      setIsLoading(false);
      setError(null);
      if (
        currentRideState.rideId &&
        currentRideState.rideId !== route.params.rideId
      ) {
        Alert.alert(
          "Ride Status Changed",
          "This ride request (ID: " +
            route.params.rideId +
            ") is no longer the active one. Navigating back.",
          [{text: "OK", onPress: () => navigation.navigate("BookRide")}],
        );
      }
    } else if (currentRideState.status === "confirmed_in_progress") {
      setIsLoading(false);
      setError(null);
      if (currentRideState.rideId === route.params.rideId) {
        Alert.alert(
          "Driver Selected!",
          `You are now connected with the driver for ride ${currentRideState.rideId}.`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log(
                  "Ride confirmed, navigating to BookRide as placeholder for TrackRideScreen.",
                );
                navigation.navigate("BookRide");
              },
            },
          ],
        );
      } else {
        console.log(
          "Received confirmed_in_progress for a different ride:",
          currentRideState.rideId,
          "Expected:",
          route.params.rideId,
        );
      }
    } else if (currentRideState.status === "cancelled") {
      if (currentRideState.rideId === route.params.rideId) {
        setIsLoading(false);
        setError(currentRideState.errorMessage || "Ride has been cancelled.");
        Alert.alert(
          "Ride Cancelled",
          currentRideState.errorMessage ||
            "This ride request has been cancelled.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("BookRide"),
            },
          ],
        );
      } else {
        console.log(
          "Received cancelled status for a different ride:",
          currentRideState.rideId,
          "Expected:",
          route.params?.rideId,
        );
      }
    } else if (currentRideState.status === "error") {
      if (currentRideState.rideId === route.params.rideId) {
        setIsLoading(false);
        setError(currentRideState.errorMessage || "An unknown error occurred.");
        Alert.alert(
          "Error",
          currentRideState.errorMessage || "An unknown error occurred.",
          [{text: "OK", onPress: () => navigation.goBack()}],
        );
      } else {
        console.log(
          "Received error for a different ride:",
          currentRideState.rideId,
          "Expected:",
          route.params?.rideId,
          "Error:",
          currentRideState.errorMessage,
        );
      }
    }
  }, [currentRideState, navigation, route.params]);

  const handleSelectDriver = async (driverSocketId: string) => {
    if (
      !route.params ||
      !currentRideState.bidding_room_id ||
      !driverSocketId ||
      currentRideState.rideId !== route.params.rideId
    ) {
      Alert.alert(
        "Error",
        "Cannot select driver: Ride information is missing, mismatched or outdated.",
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log(
        `Rider ${
          socketId ?? "N/A"
        } attempting to select driver ${driverSocketId} for bidding room ${
          currentRideState.bidding_room_id
        } (Ride ID: ${route.params.rideId})`,
      );
      await selectDriver(driverSocketId);
    } catch (e: any) {
      setIsLoading(false);
      setError(e.message || "Failed to select driver.");
      Alert.alert(
        "Selection Error",
        e.message || "Could not select the driver. Please try again.",
      );
      console.error("Error selecting driver:", e);
    }
  };

  const renderBidItem = ({item}: {item: Bid}) => (
    <Card
      style={styles.bidCard}
      onPress={() => handleSelectDriver(item.driverSocketId)}>
      <View style={styles.bidContent}>
        <Icon name="person-outline" fill={primaryColor} style={styles.icon} />
        <View style={styles.bidDetails}>
          <Text style={styles.bidText}>
            Driver: ...{item.driverSocketId.slice(-6)}
          </Text>
          <Text style={styles.bidText}>
            Bid Amount: {item.bidAmount ?? "N/A"}
          </Text>
        </View>
        <Button
          size="small"
          onPress={() => handleSelectDriver(item.driverSocketId)}>
          Select Driver
        </Button>
      </View>
    </Card>
  );

  const bidsForThisRide =
    route.params &&
    currentRideState.rideId === route.params.rideId &&
    currentRideState.bids
      ? Object.values(currentRideState.bids)
      : [];

  if (!route.params) {
    return (
      <Layout style={styles.centered}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Loading ride details...</Text>
      </Layout>
    );
  }

  if (
    currentRideState.rideId &&
    currentRideState.rideId !== route.params.rideId &&
    currentRideState.status !== "idle"
  ) {
    return (
      <Layout style={styles.centered}>
        <Text style={styles.errorText}>
          This ride request (ID: {route.params.rideId}) is no longer active or
          has been superseded by Ride ID: {currentRideState.rideId}.
        </Text>
        <Button
          onPress={() => navigation.navigate("BookRide")}
          style={{marginTop: 20}}>
          Go to Booking
        </Button>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>Searching for Drivers</Text>
        <Text style={styles.subtitle}>Ride ID: {route.params.rideId}</Text>
        <Text style={styles.subtitle}>
          Bidding Room: {route.params.biddingRoomId}
        </Text>

        <Card style={styles.rideInfoCard}>
          <Text style={styles.cardTitle}>Ride Details:</Text>
          <Text>
            From:{" "}
            {route.params.initialRideDetails?.pickupLocation?.address || "N/A"}
          </Text>
          <Text>
            To:{" "}
            {route.params.initialRideDetails?.dropoffLocation?.address || "N/A"}
          </Text>
          <Text>
            Estimated Base Fare:{" "}
            {route.params.initialRideDetails?.fare?.baseFare || "N/A"}
          </Text>
        </Card>

        {(isLoading || currentRideState.status === "creating_request") &&
          currentRideState.rideId === route.params.rideId && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={primaryColor} />
              <Text style={styles.statusText}>
                {currentRideState.status === "creating_request"
                  ? "Initializing Ride..."
                  : "Processing your request..."}
              </Text>
            </View>
          )}

        {currentRideState.status === "pending_bids" &&
          currentRideState.rideId === route.params.rideId && (
            <>
              {bidsForThisRide.length === 0 && !isLoading && (
                <Text style={styles.statusText}>
                  No bids received yet. Waiting for drivers to bid on Ride ID:{" "}
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
          )}

        {error && currentRideState.rideId === route.params.rideId && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </ScrollView>
      {isLoading && currentRideState.rideId === route.params.rideId && (
        <RNModal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {}}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color={primaryColor} />
              <Text style={styles.modalText}>
                {currentRideState.status === "creating_request"
                  ? "Creating Ride Request..."
                  : currentRideState.status === "pending_bids" && isLoading
                  ? "Submitting selection..."
                  : "Processing..."}
              </Text>
            </View>
          </View>
        </RNModal>
      )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: primaryColor,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#666",
  },
  rideInfoCard: {
    marginBottom: 20,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bidsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  bidCard: {
    marginBottom: 12,
  },
  bidContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#333",
  },
  statusText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
    color: "#555",
  },
  errorText: {
    color: errorColor,
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginTop: 15,
    fontSize: 17,
    color: "#333",
    textAlign: "center",
  },
});

export default SearchDriver;
