import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "../../../assets/images/icons/profile-avatar.svg";
import RatingStar from "../../../assets/images/icons/rating-star.svg";
import {primaryColor} from "../../theme/colors";
import Margin from "../../components/Margin";
import {Icon} from "@ui-kitten/components";
import {useNavigation} from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import DriverInfo from "../driver/components/DriverInfo";
import DullDivider from "../../components/DullDivider";
import auth from "@react-native-firebase/auth";
import {mmkvUtils, storage} from "../../store/mmkv/storage";
import {useRecoilState} from "recoil";
import {userAtom} from "../../store/atoms/user/userAtom";
import {User} from "../../types/user/userTypes";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {RootNavigationProp} from "../../types/navigation/navigation.types";
import {ProfileStackParamList} from "../../types/navigation/navigation.types";
import { collection, getDocs, getFirestore, query, where } from "@react-native-firebase/firestore/lib";

const Profile = ({route}: any) => {
  const navigation = useNavigation<RootNavigationProp>();
  const {userType} = route.params || {};
  const [_, setUser] = useRecoilState<User | null>(userAtom);
  const [imageUrl, setImageUrl] = useState()
  const [name, setName] = useState()
  const db = getFirestore()

  const handleLogout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
      }
      mmkvUtils.setUser(null);
      setUser(null);
      setTimeout(() => {
        navigation.navigate("AuthScreens", {screen: "Login"});
      }, 100);
    } catch (error) {
      console.error("Logout error: ", error);
      navigation.navigate("AuthScreens", {screen: "Login"});
    }
  };

  const getRiderData = async () => {
    try {
      const userId = storage.getString('userId')
      if (!userId) {
        console.error('userId not found in storage')
        return
      }
      const q = query(collection(db, "drivers"), where("userId", "==", userId))
      const driverDoc = await getDocs(q)
      if (driverDoc) {
        driverDoc.forEach(doc => {
          setImageUrl(doc.data().photo)
          setName(doc.data().name)
        })
      } else {
        console.error('Driver document not found')
      }
    } catch (error) {
      console.error('Error fetching driver data:', error)
    }
  }

  useEffect(() => {
    getRiderData()
  }, [])

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}>
          <View>
            <Text style={styles.h1}>Arjun sharma</Text>
            <Text style={styles.h3}>+1 1234567890</Text>
            <View style={{flexDirection: "row", gap: 3, alignItems: "center"}}>
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <RatingStar width={20} height={20} />
              <Text style={styles.ratingText}>5</Text>
            </View>
          </View>
          <ProfileAvatar width={70} height={70} />
        </View>
        {userType === "Driver" ? (
          <>
            <DullDivider />
            <DriverInfo />
          </>
        ) : (
          <>
            <Margin margin={20} />
            <CustomButton
              title="Safety Check"
              onPress={() =>
                navigation.navigate("ProfileScreens", {screen: "SafetyCheck"})
              }
              status="primary"
              size="medium"
            />
          </>
        )}
        <Margin margin={20} />
        <View style={{gap: 20}}>
          {profileListItems?.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.listitem}
              onPress={() =>
                navigation.navigate("ProfileScreens", {screen: item.path})
              }>
              <Icon
                name={item?.icon}
                fill={primaryColor}
                width={25}
                height={25}
              />
              <Text style={styles.h2}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.listitem}>
            <Icon name="settings" fill={primaryColor} width={25} height={25} />
            <Text style={styles.h2} onPress={() => handleLogout()}>
              Logout
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Profile;

const profileListItems = [
  {
    title: "2-Step Verification",
    path: "TwoStepVerification" as keyof ProfileStackParamList,
    icon: "lock-outline",
  },
  {
    title: "Emergency contact",
    path: "EmergencyContact" as keyof ProfileStackParamList,
    icon: "phone-call",
  },
  {
    title: "Settings",
    path: "Settings" as keyof ProfileStackParamList,
    icon: "settings-2",
  },
  {
    title: "Manage your account",
    path: "ManageAccount" as keyof ProfileStackParamList,
    icon: "person-outline",
  },
  {
    title: "FAQs",
    path: "FAQs" as keyof ProfileStackParamList,
    icon: "question-mark-circle",
  },
  {
    title: "Privacy policy",
    path: "PrivacyPolicy" as keyof ProfileStackParamList,
    icon: "file-text",
  },
  {
    title: "Terms and Condition",
    path: "TermsAndCondition" as keyof ProfileStackParamList,
    icon: "file-text",
  },
];

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
    gap: 10,
  },
  h1: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
  },
  h3: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
  },
  h2: {
    color: "#fff",
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
  },
  ratingText: {
    color: primaryColor,
    fontFamily: "Montserrat-SemiBold",
    marginLeft: 5,
    marginTop: 3,
    fontSize: 16,
  },
  listitem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1c2722",
    paddingBottom: 15,
  },
});
