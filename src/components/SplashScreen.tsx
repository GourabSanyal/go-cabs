import {StyleSheet, View} from "react-native";
import React, {useEffect, useRef} from "react";
import {Text, Spinner} from "@ui-kitten/components";
import {useNavigation} from "@react-navigation/native";
import GoLogo from "../../assets/images/logo.svg";
import {userEmailSelector} from "../store/selectors/user/userSelectors";
import {useRecoilValue} from "recoil";
import auth from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {RootNavigationProp} from "../types/navigation/navigation.types";

interface SplashScreenProps {
  showLoader?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  showLoader = false 
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const user = useRecoilValue(userEmailSelector);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Don't run auth logic if we're just showing loader
    if (showLoader) return;
    
    if (hasCheckedAuth.current) return;

    const checkAuthState = async () => {
      try {
        const currentUser = auth().currentUser;
        const googleUser = await GoogleSignin.getCurrentUser();
        const isGoogleSignedIn = !!googleUser;

        if (isGoogleSignedIn && !currentUser) {
          await GoogleSignin.signOut();
        }

        const shouldNavigateToHome = currentUser || isGoogleSignedIn || user;
        if (shouldNavigateToHome) {
          navigation.navigate("UserScreens", {screen: "Home"});
        } else {
          navigation.navigate("AuthScreens", {screen: "Login"});
        }
      } catch (error) {
        console.error("Auth state check error:", error);
        navigation.navigate("AuthScreens", {screen: "Login"});
      } finally {
        hasCheckedAuth.current = true;
      }
    };

    const timer = setTimeout(checkAuthState, 1000);
    return () => clearTimeout(timer);
  }, [user, navigation, showLoader]);

  return (
    <View style={styles.container}>
      <GoLogo width={220} height={114} />
      <Text style={styles.text}>let's go</Text>
      {showLoader && (
        <View style={styles.loaderContainer}>
          <Spinner size="small" status="primary" />
        </View>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: "center", alignItems: "center"},
  image: {width: 200, height: 114},
  text: {
    color: "#fff",
    fontSize: 28,
    marginTop: 20,
    fontFamily: "Montserrat-Regular",
  },
  loaderContainer: {
    marginTop: 30,
  },
});
