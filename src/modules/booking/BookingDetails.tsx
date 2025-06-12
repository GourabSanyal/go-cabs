import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {backgroundPrimary, primaryColor} from "../../theme/colors";
import WebView from "react-native-webview";
import CarIcon from "../../../assets/images/icons/car.svg";
import UserAvatar from "../../../assets/images/icons/avatar.svg";
import Margin from "../../components/Margin";
import DullDivider from "../../components/DullDivider";
import {Icon} from "@ui-kitten/components";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useRecoilValue} from "recoil";
import {rideAtom} from "../../store/atoms/ride/rideAtom";
import {RootNavigationProp} from "../../types/navigation/navigation.types";

const BookingDetails = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const driver = useRecoilValue(rideAtom).driver;

  return (
    <>
      <View>
        <ScrollView>
          <View
            style={{
              width: "100%",
              height: 320,
              backgroundColor: backgroundPrimary,
            }}>
            <WebView
              originWhitelist={["*"]}
              source={{ uri: 'file:///android_asset/map.html' }}
              style={styles.webview}
            />
          </View>
          <View style={styles.rideTypeContainer}>
            <Text style={styles.h3}>EV Prime</Text>
            <CarIcon width={30} height={30} />
          </View>
          <View style={{padding: 20}}>
            <Text style={styles.h4}>Arriving in 2 min</Text>
            <Margin margin={5} />
            <View style={styles.driverInfoContainer}>
              <UserAvatar width={45} height={45} />
              <View style={styles.driverDetails}>
                <Text style={styles.h1}>{driver?.name}</Text>
                <Text style={styles.h3}>
                  {driver?.vehiclemodel?.split(" ")[0]} •{" "}
                  {driver?.regnumber?.slice(-4)}
                </Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>★ {driver?.rating}</Text>
                </View>
              </View>
            </View>
            <DullDivider margin={30} />
            <View
              style={{
                flexDirection: "row",
                gap: 50,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}>
              <TouchableOpacity
                style={{flexDirection: "row", gap: 10}}
                onPress={() => navigation.navigate("CallDriver" as never)}>
                <Icon width={25} height={25} name="phone" fill={primaryColor} />
                <Text style={styles.h3}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: "row", gap: 10}}
                onPress={() => navigation.navigate("MessageDriver" as never)}>
                <Icon
                  width={25}
                  height={25}
                  name="message-square"
                  fill={primaryColor}
                />
                <Text style={styles.h3}>Message</Text>
              </TouchableOpacity>
            </View>
            <Margin margin={20} />
            <View style={{width: "80%", margin: "auto"}}>
              <CustomButton
                title="Safety Check"
                size="medium"
                status="primary"
                onPress={() =>
                  navigation.navigate("ProfileScreens", {screen: "SafetyCheck"})
                }
              />
            </View>
            <Margin margin={30} />
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <View style={styles.chipCard} />
              <View style={styles.chipCard} />
              <View style={styles.chipCard} />
              <View style={styles.chipCard} />
            </View>
            <Margin margin={30} />
            <CustomButton title="Cancel Ride" size="medium" status="danger" />
            <Margin margin={20} />
            <CustomButton
              title="View Completed Ride"
              size="medium"
              onPress={() => navigation.navigate("RideCompleted" as never)}
              status="primary"
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  chipCard: {
    backgroundColor: "grey",
    height: 70,
    borderRadius: 12,
    width: 70,
  },
  switcText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
  },
  rideTypeContainer: {
    padding: 20,
    backgroundColor: "#101c17",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
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
  h1: {
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    marginBottom: 0,
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
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
  h4: {
    fontSize: 13,
    fontFamily: "Montserrat-Bold",
    color: primaryColor,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  driverInfoContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  driverInitial: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
  driverDetails: {
    justifyContent: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#ffd700",
  },
});
