import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Switch,
} from "react-native";
import React, {useState, useRef, useEffect} from "react";
import WebView from "react-native-webview";
import {backgroundPrimary, primaryColor} from "../../theme/colors";
import {Radio, RadioGroup} from "@ui-kitten/components";
import DullDivider from "../../components/DullDivider";
import CarIcon from "../../../assets/images/icons/car.svg";
import PhantomIcon from "../../../assets/images/icons/PhantomIcon.svg";
import {fetchEvChargingStations} from "../../services/evCharging/evChargingService";
import {EvChargingStationMarker} from "../../types/evCharging/evChargingTypes";
import CustomButton from "../../components/CustomButton";
import Margin from "../../components/Margin";
import {useRecoilState} from "recoil";
import {rideAtom} from "../../store/atoms/ride/rideAtom";
import {Driver} from "../../types/driver/driverTypes";
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import {useSocket} from "../../hooks/useSocket";
import {BookingStackParamList} from "../../types/navigation/navigation.types";
import {Dimensions as RNDimensions} from "react-native";
import {calculatePriceByDistance} from "../../utils/ride/distance/calculateDistance";
// import {PhantomWalletService} from "../../services/payment/phantom/phantomWalletService";
import {convertINRtoSOL} from "../../utils/currency/currencyConverter";
import {storage} from "../../store/mmkv/storage";
import {STORAGE_KEYS} from "../../store/constants/storageKeys";
import {QuotationRequestPayload} from "../../types/ride/types/ride.types";
import {clearPaymentCache} from "../../utils/cache/clearCache";

const {width: screenWidth, height: screenHeight} = RNDimensions.get("window");

// // Define the expected structure for selected locations
// interface SelectedLocation {
//   address: string;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
// }

// Enhanced driver type with animation state
interface AnimatedDriver extends Driver {
  animationId: string;
  visible: boolean;
  exiting: boolean;
}

// Define prop types for BookRide screen
type BookRideRouteProp = RouteProp<BookingStackParamList, "BookRide">;

interface BookRideProps {
  route: BookRideRouteProp;
  // navigation is already available via useNavigation hook
}

const BookRide: React.FC<BookRideProps> = ({route}) => {
  const navigation = useNavigation<NavigationProp<BookingStackParamList>>();
  const passedPickupLocation = route.params?.pickupLocation;
  const passedDropOffLocation = route.params?.dropOffLocation;

  // State to manage if essential data is ready for rendering the main component
  const [isEssentialDataReady, setIsEssentialDataReady] = useState(false);

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL EARLY RETURN
  const [rideState, setRideState] = useRecoilState(rideAtom);
  const {
    submitQuotationRequest,
    currentRideState: socketRideState,
    isConnected: isSocketConnected,
  } = useSocket();
  const webViewRef = useRef<WebView>(null);

  const [compare, setCompare] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null);
  const [showDrivers, setShowDrivers] = useState(false);
  const [animatedDrivers, setAnimatedDrivers] = useState<AnimatedDriver[]>([]);
  const [showChargingStations, setShowChargingStations] = useState(true);
  const [chargingStations, setChargingStations] = useState<
    EvChargingStationMarker[]
  >([]);

  // Animation references - using a Map for better tracking by ID
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

  // Clear any cached modal/payment state on component mount
  useEffect(() => {
    clearPaymentCache();
  }, []);

  // This useEffect will now control whether the main component logic proceeds
  useEffect(() => {
    if (passedPickupLocation && passedDropOffLocation) {
      setIsEssentialDataReady(true);
    } else {
      setIsEssentialDataReady(false); // Ensure it's false if data is missing
      Alert.alert(
        "Location Error",
        "Pickup and Dropoff locations not provided. Please go back and select them.",
        [{text: "OK", onPress: () => navigation.goBack()}],
      );
    }
  }, [passedPickupLocation, passedDropOffLocation, navigation]);

  // This useEffect now depends on isEssentialDataReady or more directly on the presence of location data.
  // It will initialize rideState once locations are confirmed to be available.
  useEffect(() => {
    // Only proceed if essential data (locations) is ready
    if (isEssentialDataReady && passedPickupLocation && passedDropOffLocation) {
      setRideState(prev => ({
        ...prev,
        pickupLocation: {
          latitude: String(passedPickupLocation.coordinates.lat),
          longitude: String(passedPickupLocation.coordinates.lng),
          address: passedPickupLocation.address,
        },
        dropOffLocation: {
          latitude: String(passedDropOffLocation.coordinates.lat),
          longitude: String(passedDropOffLocation.coordinates.lng),
          address: passedDropOffLocation.address,
        },
        selectedRideType: undefined, // Reset these when new locations are set
        fare: undefined,
        payment: undefined,
        status: "configuring_ride", // Or an appropriate initial status
      }));
    }
  }, [
    isEssentialDataReady,
    passedPickupLocation,
    passedDropOffLocation,
    setRideState,
  ]);

  // The useEffect for socketRideState, and any other useEffects, useState, etc.
  // should be here or after, as long as they are before the conditional return below.
  // Example: The problematic useEffect from your log for socketRideState:
  useEffect(() => {
    if (
      socketRideState.status === "pending_bids" &&
      socketRideState.bidding_room_id
    ) {
      setRideState(prev => ({
        ...prev,
        status: "PENDING_BIDS",
        quotationRequestId: socketRideState.bidding_room_id,
      }));
      navigation.navigate("ViewBidsScreen", {
        quotationId: socketRideState.bidding_room_id,
      });
    } else if (
      socketRideState.status === "error" &&
      rideState.status === "QUOTATION_REQUEST_INITIATED" // Check if error is related to current quotation attempt
    ) {
      Alert.alert(
        "Quotation Error",
        socketRideState.errorMessage || "Failed to submit quotation request.",
      );
      setRideState(prev => ({
        ...prev,
        status: "error",
        errorMessage:
          socketRideState.errorMessage || "Failed to submit quotation request.",
      }));
    }
  }, [
    socketRideState,
    navigation,
    setRideState,
    rideState.status, // Added rideState.status as a dependency
  ]);

  // CONDITIONAL EARLY RETURN: If essential data is not ready, render nothing or a loader.
  // This MUST come AFTER ALL hook declarations.
  // if (!isEssentialDataReady) { // <<<<< We will move this condition to the JSX
  // You can return null or a loading indicator.
  // Returning null is fine if the alert and navigation.goBack() handle user feedback.
  // return null;
  // }

  // Function to handle ride type selection
  const handleRideSelection = (rideName: string, price: number) => {
    setRideState(prev => ({
      ...prev,
      selectedRideType: rideName,
      fare: {
        baseFare: price,
        totalFare: price, // change this to what the driver will send the user as bid
        currency: "INR",
      },
    }));
  };

  const handlePaymentMethodChange = (index: number) => {
    setPaymentMethod(index);
    const paymentTypes = [
      "metamask",
      "credit",
      "debit",
      "cash",
      "Phantom",
    ] as const;

    setRideState(prev => ({
      ...prev,
      payment: {
        method: paymentTypes[index],
        confirmed: true,
      },
    }));
  };

  const handleRequestQuotes = async () => {
    const currentFare = rideState.fare?.baseFare;
    if (!currentFare) {
      console.error("No fare amount available");
      return;
    }
    const fareInSOL = await convertINRtoSOL(currentFare);

    setRideState(prev => ({
      ...prev,
      fare: {
        ...prev.fare,
        baseFare: currentFare,
        totalFare: currentFare,
        currency: "INR",
        solAmount: fareInSOL,
      },
      status: "QUOTATION_REQUEST_INITIATED",
    }));

    console.log("Fare in INR:", currentFare);
    console.log("Fare in SOL:", fareInSOL);

    if (!isSocketConnected) {
      Alert.alert(
        "Connection Error",
        "Not connected to the server. Please check your internet connection or try again later.",
      );
      setRideState(prev => ({
        ...prev,
        status: "error",
        errorMessage: "Connection failed",
      }));
      return;
    }

    if (
      !rideState.pickupLocation?.address ||
      !rideState.dropOffLocation?.address ||
      !rideState.pickupLocation.latitude ||
      !rideState.pickupLocation.longitude ||
      !rideState.dropOffLocation.latitude ||
      !rideState.dropOffLocation.longitude
    ) {
      Alert.alert(
        "Missing Info",
        "Pickup and drop-off locations are missing or incomplete. Please go back to Home.",
        [{text: "OK", onPress: () => navigation.goBack()}],
      );
      setRideState(prev => ({
        ...prev,
        status: "error",
        errorMessage: "Location data missing",
      }));
      return;
    }

    const riderId = "current-rider-id"; // FIXME: Replace with actual rider ID from auth/user state

    const quotationDataForServer: QuotationRequestPayload = {
      riderId: riderId,
      pickupLocation: {
        latitude: Number(rideState.pickupLocation.latitude),
        longitude: Number(rideState.pickupLocation.longitude),
        address: rideState.pickupLocation.address || "",
      },
      dropoffLocation: {
        latitude: Number(rideState.dropOffLocation.latitude),
        longitude: Number(rideState.dropOffLocation.longitude),
        address: rideState.dropOffLocation.address || "",
      },
      requestedAt: new Date().toISOString(),
    };

    if (!submitQuotationRequest) {
      Alert.alert("Error", "submitQuotationRequest not available. Dev issue.");
      setRideState(prev => ({
        ...prev,
        status: "error",
        errorMessage: "Quotation submission system error",
      }));
      return;
    }

    submitQuotationRequest(quotationDataForServer);
  };

  // Render a single driver item with animations
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
        {/* Progress bar */}
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        <TouchableOpacity
          style={styles.driverItem}
          onPress={() => {
            setRideState(prev => ({
              ...prev,
              driver: driver,
            }));
            navigation.navigate("BookingDetails");
          }}>
          {/* Driver Avatar */}
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>{driver.name.charAt(0)}</Text>
          </View>

          {/* Driver Info */}
          <View style={styles.driverDetails}>
            <Text style={styles.h1}>{driver.name}</Text>
            <Text style={styles.h2}>
              {driver.vehiclemodel.split(" ")[0]} • {driver.regnumber.slice(-4)}
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

  const finalPickupCoords = passedPickupLocation!.coordinates;
  const finalDropOffCoords = passedDropOffLocation!.coordinates;

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

  useEffect(() => {
    if (isEssentialDataReady) {
      // console.log(
      //   "[BookRide] Essential data ready, attempting to send to WebView.",
      // );
    }
  }, [isEssentialDataReady, finalPickupCoords, finalDropOffCoords]);

  const handleFetchChargingStations = async (
    latitude: number,
    longitude: number,
    distance: number,
  ) => {
    try {
      const stations = await fetchEvChargingStations(
        latitude,
        longitude,
        distance,
      );

      // Transform API response to marker format
      const stationMarkers: EvChargingStationMarker[] = stations.map(
        station => {
          // Extract connection types
          const connectionTypes = station.Connections.filter(
            conn => conn.ConnectionType?.Title,
          ).map(conn => conn.ConnectionType!.Title);

          // Determine if station is operational
          const isOperational = station.StatusType?.IsOperational ?? true;

          // Get the highest power rating from connections
          const highestPowerKW = station.Connections.reduce(
            (max, conn) =>
              conn.PowerKW && conn.PowerKW > max ? conn.PowerKW : max,
            0,
          );

          return {
            id: station.ID,
            latitude: station.AddressInfo.Latitude,
            longitude: station.AddressInfo.Longitude,
            name: station.AddressInfo.Title || `Charging Station ${station.ID}`,
            address: [
              station.AddressInfo.AddressLine1,
              station.AddressInfo.Town,
              station.AddressInfo.StateOrProvince,
              station.AddressInfo.Postcode,
            ]
              .filter(Boolean)
              .join(", "),
            connectionTypes:
              connectionTypes.length > 0 ? connectionTypes : ["Unknown"],
            isOperational,
            powerKW: highestPowerKW > 0 ? highestPowerKW : undefined,
            numberOfPoints: station.NumberOfPoints,
            operator: station.OperatorInfo?.Title,
          };
        },
      );

      setChargingStations(stationMarkers);

      // Send the stations to the WebView
      if (webViewRef.current) {
        const script = `
          if (window.addChargingStations) {
            window.addChargingStations(${JSON.stringify(stationMarkers)});
          } else {
            console.warn('addChargingStations not ready in WebView');
          }
        `;
        webViewRef.current.injectJavaScript(script);
      }
    } catch (error) {
      console.error("[BookRide] Error fetching charging stations:", error);
    }
  };

  const ridesData = [
    {
      name: "Taxi Go",
      price: `₹ ${calculatePriceByDistance(
        Number(rideState.pickupLocation?.latitude),
        Number(rideState.pickupLocation?.longitude),
        Number(rideState.dropOffLocation?.latitude),
        Number(rideState.dropOffLocation?.longitude),
        "TAXI",
      ).toFixed(0)}`,
      arrival: "Arrives in 15 mins",
    },
    {
      name: "Moto Go",
      price: `₹ ${calculatePriceByDistance(
        Number(rideState.pickupLocation?.latitude),
        Number(rideState.pickupLocation?.longitude),
        Number(rideState.dropOffLocation?.latitude),
        Number(rideState.dropOffLocation?.longitude),
        "MOTO",
      ).toFixed(0)}`,
      arrival: "Arrives in 12 mins",
    },
  ];

  // Function to get the price for the selected ride type
  const getSelectedRidePrice = (): string => {
    if (
      !rideState.selectedRideType ||
      !rideState.pickupLocation ||
      !rideState.dropOffLocation
    ) {
      return "₹ 0";
    }

    const rideType = rideState.selectedRideType.includes("Taxi")
      ? "TAXI"
      : "MOTO";
    const price = calculatePriceByDistance(
      Number(rideState.pickupLocation.latitude),
      Number(rideState.pickupLocation.longitude),
      Number(rideState.dropOffLocation.latitude),
      Number(rideState.dropOffLocation.longitude),
      rideType,
    );

    return `₹ ${price.toFixed(0)}`;
  };

  return (
    <ScrollView
      style={styles.mainScrollContainer}
      contentContainerStyle={styles.scrollContentContainer}>
      {isEssentialDataReady ? (
        <View style={styles.container}>
          <View style={styles.locationSummaryContainer}>
            <Text style={styles.locationSummaryText}>
              Pickup:{" "}
              {rideState.pickupLocation?.address || "Fetching address..."}
            </Text>
            <Text style={styles.locationSummaryText}>
              Drop-off:{" "}
              {rideState.dropOffLocation?.address || "Fetching address..."}
            </Text>
            <View style={styles.chargingToggleContainer}>
              <Text style={styles.switcText}>Show EV Charging Stations</Text>
              <Switch
                value={showChargingStations}
                onValueChange={value => {
                  setShowChargingStations(value);
                  if (webViewRef.current) {
                    webViewRef.current.injectJavaScript(`
                      if (window.toggleChargingStations) {
                        window.toggleChargingStations(${value});
                      }
                    `);
                  }
                }}
                trackColor={{false: "#767577", true: "#81b0ff"}}
                thumbColor={showChargingStations ? primaryColor : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={["*"]}
              source={{uri: "file:///android_asset/map.html"}} // Make sure this path is correct for your setup
              style={styles.map}
              onLoadEnd={() => {
                // console.log("[BookRide] WebView loaded. Sending coordinates.");
                sendDataToWebView();
              }}
              onError={syntheticEvent => {
                const {nativeEvent} = syntheticEvent;
                console.warn("[BookRide] WebView error: ", nativeEvent);
              }}
              onMessage={event => {
                // Handle messages from WebView
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  console.log("[BookRide] Message from WebView:", data);

                  if (data.type === "fetchChargingStations") {
                    handleFetchChargingStations(
                      data.latitude,
                      data.longitude,
                      data.distance,
                    );
                  }
                } catch (error) {
                  console.error(
                    "[BookRide] Error parsing WebView message:",
                    error,
                  );
                }
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              // renderLoading={() => <ActivityIndicator size="large" color={primaryColor} />} // Optional loading indicator
            />
          </View>

          <View style={styles.tabContainer}>
            {!isPayment ? (
              <>
                <DullDivider />
                <View>
                  {!showDrivers
                    ? (compare ? ridesDataCompared : ridesData)?.map(
                        (item, index) => (
                          <TouchableOpacity
                            key={index.toString()}
                            style={[
                              styles.listItem,
                              rideState.selectedRideType === item.name &&
                                styles.selectedRide,
                            ]}
                            onPress={() => {
                              const priceString = item.price;
                              const numericPrice = parseInt(
                                priceString.replace("₹ ", ""),
                                10,
                              );
                              if (!isNaN(numericPrice)) {
                                handleRideSelection(item.name, numericPrice);
                              } else {
                                console.error(
                                  "Could not parse price:",
                                  priceString,
                                );
                              }
                            }}>
                            <CarIcon width={50} height={50} />
                            <View style={{flexGrow: 1}}>
                              <Text style={styles.h1}>{item.name}</Text>
                              <Text style={styles.h2}>{item.arrival}</Text>
                            </View>
                            <Text
                              style={[styles.h1, {alignSelf: "flex-start"}]}>
                              {item.price}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )
                    : animatedDrivers.map(driver => renderDriverItem(driver))}
                </View>
                <Margin margin={10} />
                <View style={{paddingHorizontal: 20, marginTop: 5}}>
                  <CustomButton
                    // title="Continue Booking Your GO Ride"
                    // status="primary"
                    title={
                      rideState.selectedRideType
                        ? "Continue Booking"
                        : "Select a Ride Type"
                    }
                    status={rideState.selectedRideType ? "primary" : "disabled"}
                    size="medium"
                    onPress={() => {
                      setIsPayment(true);
                    }}
                    disabled={!rideState.selectedRideType}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={{padding: 20}}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setIsPayment(false)}>
                    <Text style={styles.backButtonText}>
                      ← Back to vehicle selection
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Estimated Price:</Text>
                    <Text style={styles.priceValue}>
                      {getSelectedRidePrice()}
                    </Text>
                  </View>
                  <RadioGroup
                    selectedIndex={paymentMethod !== null ? paymentMethod : -1}
                    onChange={handlePaymentMethodChange}>
                    {/* <Radio style={styles.option}>
                      {_evaProps => (
                        <>
                          <Text style={styles.h3}>Phantom Wallet</Text>
                          <PhantomIcon width={25} height={25} />
                        </>
                      )}
                    </Radio> */}
                  </RadioGroup>
                  <View style={{marginTop: 15}}>
                    <CustomButton
                      title="Request Quotes"
                      status="primary"
                      size="medium"
                      onPress={handleRequestQuotes}
                      disabled={false}
                    />
                  </View>
                  <Text style={styles.paymentNote}>
                    Payment will be required after selecting a driver bid
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      ) : (
        // Optional: Render a loading indicator or null while essential data is not ready
        // If navigation.goBack() is called, this part might not even be visible for long.
        <View style={styles.containerAlteredForMessage}>
          <Text style={styles.messageText}>
            Loading ride details or redirecting...
          </Text>
        </View>
      )}
      {(rideState.status === "creating_request" ||
        rideState.status === "QUOTATION_REQUEST_INITIATED" ||
        socketRideState?.status === "creating_request" || // Retain for direct ride if ever used
        socketRideState?.status === "creating_quotation_request") && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            {rideState.status === "QUOTATION_REQUEST_INITIATED" ||
            socketRideState?.status === "creating_quotation_request"
              ? "Requesting quotes..."
              : "Creating your ride request..."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default BookRide;

const styles = StyleSheet.create({
  selectedRide: {
    backgroundColor: "rgba(214, 255, 239, 0.2)",
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 22,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: primaryColor,
  },
  driverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(214, 255, 239, 0.1)",
    borderRadius: 8,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  driverInitial: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat-Bold",
  },
  driverDetails: {
    flex: 1,
    marginLeft: 15,
  },
  h1: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
  h2: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#B9B9B9",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    color: "#FFD700",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
  },
  callButton: {
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  callButtonText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
  },
  switcText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
  },
  chargingToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  webview: {
    width: "100%",
    height: 320,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1c2722",
  },
  h3: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    flexGrow: 1,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  chipContainer: {
    backgroundColor: "#D6FFEF",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  chip: {
    backgroundColor: "#85FFCE",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#005231",
  },
  backButton: {
    marginBottom: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#353f3b",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 5,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  successButton: {
    width: "100%",
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
  spinningIcon: {
    transform: [{rotate: "0deg"}],
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#353f3b",
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  priceValue: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: primaryColor,
  },
  paymentNote: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginTop: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
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
    backgroundColor: "#353f3b", // A slightly different background for emphasis
    borderRadius: 8,
    marginBottom: 20,
  },
  locationSummaryText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    marginBottom: 5,
  },
  containerAlteredForMessage: {
    // Styles for the message view if locations aren't ready
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: backgroundPrimary,
  },
  messageText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
  tabContainer: {
    flex: 1,
  },
  mapContainer: {
    height: screenHeight * 0.3, // Or a fixed height like 250 or 300
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const ridesData = [
  {
    name: "Classic",
    price: "₹ 150",
    arrival: "Arrives in 15 mins",
  },
  {
    name: "Prime",
    price: "₹ 162",
    arrival: "Arrives in 12 mins",
  },
  {
    name: "Delux",
    price: "₹ 175",
    arrival: "Arrives in 11 mins",
  },
  {
    name: "Pro",
    price: "₹ 198",
    arrival: "Arrives in 09 mins",
  },
];
const ridesDataCompared = [
  {
    id: "7",
    name: "Ola Rides",
    price: "₹ 180-225",
    arrival: "Avg arriving in 22 mins",
  },
  {
    id: "8",
    name: "Rapido Rides",
    price: "₹ 186-218",
    arrival: "Avg arriving in 18 mins",
  },
  {
    id: "9",
    name: "Uber Rides",
    price: "₹ 191-232",
    arrival: "Avg arriving in 18 mins",
  },
  {
    id: "10",
    name: "BluSmart Rides",
    price: "₹ 181-212",
    arrival: "Avg arriving in 20 mins",
  },
];
