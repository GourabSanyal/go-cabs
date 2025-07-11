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

const AcceptRide = () => {
  const navigation = useNavigation();
  const [startRide, setStartRide] = React.useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <View
            style={{
              width: "100%",
              height: startRide ? 320 : 250,
              backgroundColor: backgroundPrimary,
            }}>
            <WebView
              originWhitelist={["*"]}
              source={{ uri: 'file:///android_asset/map.html' }}
              style={[styles.webview, {height: startRide ? 320 : 320}]}
            />
          </View>
        </View>
        <ScrollView style={styles.middleBlock}>
          <View style={{padding: 20}}>
            <Margin margin={20} />
            <View style={styles.innerCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1.5,
                  borderBottomColor: "#FFFFFF33",
                }}>
                <Text style={[styles.h5, {fontFamily: "Montserrat-SemiBold"}]}>
                  Distance to Pickup
                </Text>
                <Text
                  style={[
                    styles.h5,
                    {color: primaryColor, fontFamily: "Montserrat-SemiBold"},
                  ]}>
                  800 m
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}>
                <Text style={[styles.h5, {fontFamily: "Montserrat-SemiBold"}]}>
                  Estimated Time
                </Text>
                <Text
                  style={[
                    styles.h5,
                    {color: primaryColor, fontFamily: "Montserrat-SemiBold"},
                  ]}>
                  2 min
                </Text>
              </View>
            </View>
            <Margin margin={40} />
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
          {startRide ? (
            <CustomButton
              title="End Ride"
              status="primary"
              size="small"
              onPress={() => navigation.navigate("RideCompleteDriver" as never)}
              style={{flexGrow: 1}}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 20,
                marginTop: 20,
              }}>
              <CustomButton
                title="Start Ride"
                status="primary"
                size="small"
                onPress={() => setStartRide(true)}
                style={{flexGrow: 1}}
              />
              <CustomButton
                onPress={() => navigation.goBack()}
                title="Cancel Ride"
                status="danger"
                size="small"
                style={{flexGrow: 1}}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default AcceptRide;

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
  webview: {
    width: "100%",
  },
  innerCard: {
    backgroundColor: "#1c2722",
    borderWidth: 1.5,
    borderColor: primaryColor,
    borderRadius: 0,
  },
  h1: {
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    marginBottom: 0,
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
});
