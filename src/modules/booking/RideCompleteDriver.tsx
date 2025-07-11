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
import UserAvatar from "../../../assets/images/icons/avatar.svg";
import RatingStar from "../../../assets/images/icons/rating-star.svg";
import Margin from "../../components/Margin";
import DullDivider from "../../components/DullDivider";
import {Icon} from "@ui-kitten/components";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";

const RideCompleteDriver = () => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <View
            style={{
              width: "100%",
              height: 150,
              backgroundColor: backgroundPrimary,
            }}>
            <WebView
              originWhitelist={["*"]}
              source={{ uri: 'file:///android_asset/map.html' }}
              style={styles.webview}
            />
          </View>
        </View>
        <ScrollView style={styles.middleBlock}>
          <View style={{padding: 20}}>
            <Margin margin={10} />
            <Text style={styles.h4}>Ride Ended!</Text>
            <Margin margin={20} />
            <View style={styles.innerCard}>
              <Text style={[styles.h1, {textAlign: "center"}]}>
                Collect Payment
              </Text>
              <Text
                style={[
                  styles.h1,
                  {textAlign: "center", fontSize: 30, color: primaryColor},
                ]}>
                ₹162
              </Text>
              <Text style={[styles.h3, {textAlign: "center"}]}>
                Payment with {`\n`}metamask
              </Text>
            </View>
            <Margin margin={30} />
            <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
              <UserAvatar width={45} height={45} />
              <View>
                <Text style={styles.h3}>Naman</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    marginTop: -5,
                  }}>
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <Text
                    style={{
                      color: primaryColor,
                      fontFamily: "Montserrat-SemiBold",
                      marginLeft: 5,
                      marginTop: 2,
                    }}>
                    5
                  </Text>
                </View>
              </View>
            </View>
            <DullDivider margin={20} />
            <View
              style={{
                flexDirection: "row",
                gap: 50,
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
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
            <DullDivider margin={20} />
            <View
              style={{flexDirection: "row", gap: 15, paddingHorizontal: 20}}>
              <View style={{alignItems: "center"}}>
                <Icon
                  name="radio-button-on"
                  width={15}
                  height={15}
                  fill={primaryColor}
                />
                <View
                  style={{
                    height: 21,
                    width: 1,
                    backgroundColor: primaryColor,
                    marginVertical: -1,
                  }}
                />
                <Icon
                  name="radio-button-on"
                  width={15}
                  height={15}
                  fill={primaryColor}
                />
              </View>
              <View>
                <Text style={styles.h5}>
                  Bangalore Fort, Bangalore, Karnataka
                </Text>
                <Margin margin={8} />
                <Text style={styles.h5}>
                  Lalbagh Botanical Garden, Bangalore
                </Text>
              </View>
            </View>
            <DullDivider margin={20} />
          </View>
        </ScrollView>
        <View style={styles.bottomBlock}>
          <CustomButton
            title="Finish Ride"
            size="medium"
            onPress={() => navigation.navigate("DriverScreens" as never)}
            status="primary"
          />
        </View>
      </View>
    </>
  );
};

export default RideCompleteDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundPrimary,
  },
  topBlock: {},
  middleBlock: {
    flex: 1,
  },
  bottomBlock: {
    padding: 20,
    backgroundColor: backgroundPrimary,
  },
  //
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
  innerCard: {
    backgroundColor: "#1c2722",
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 10,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
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
  h5: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  h4: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    color: primaryColor,
    marginBottom: 10,
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
  inputStyle: {
    backgroundColor: backgroundPrimary,
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 6,
    marginTop: 20,
  },
});
