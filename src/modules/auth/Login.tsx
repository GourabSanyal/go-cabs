import {TouchableOpacity, View, ActivityIndicator, Alert} from "react-native";
import React, {useEffect, useState, useCallback, useRef} from "react";
import {Input, Text} from "@ui-kitten/components";
import {useNavigation, useFocusEffect} from "@react-navigation/native";
import {primaryColor} from "../../theme/colors";
import {styles} from "./styles";
import CustomButton from "../../components/CustomButton";
import Margin from "../../components/Margin";
import GoogleIcon from "../../../assets/images/icons/google.svg";
import FacebookIcon from "../../../assets/images/icons/facebook.svg";
import AppleIcon from "../../../assets/images/icons/apple.svg";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {useRecoilState} from "recoil";
import {userAtom} from "../../store/atoms/user/userAtom";
import {User} from "../../types/user/userTypes";
import {mmkvUtils} from "../../store/mmkv/storage";
// import {FIREBASE_WEB_CLIENT_ID} from "@env";
import {RootNavigationProp} from "../../types/navigation/navigation.types";
import Config from "react-native-config";

const Login = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [value, setValue] = React.useState("");
  const [initializing, setInitializing] = useState(true);
  const [_, setUser] = useRecoilState<User | null>(userAtom);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  // const firebaseWebClientId = FIREBASE_WEB_CLIENT_ID;
  const firebaseWebClientId = Config.FIREBASE_WEB_CLIENT_ID;
  // const firebaseWebClientId = '1051726678978-go98d67mjjhi39t7326u3gbcpqn6sncb.apps.googleusercontent.com';
  console.log("web client", firebaseWebClientId, Config.ENVIRONMENT);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: firebaseWebClientId,
      offlineAccess: true,
    });
  }, [firebaseWebClientId]);

  // Reset loading state when screen comes into focus, but only once after logout
  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Reset loading state when screen comes into focus
      setLoading(false);

      // Check if user is already signed in
      const checkGoogleSignIn = async () => {
        try {
          // Try to get current user from Google Sign-In
          const googleUser = await GoogleSignin.getCurrentUser();
          if (googleUser) {
            // If signed in with Google but not with Firebase, sign out from Google
            const currentUser = auth().currentUser;
            if (!currentUser) {
              await GoogleSignin.signOut();
            }
          }
        } catch (error) {
          // console.log("Google Sign-In check error:", error);
        }
      };

      checkGoogleSignIn();
    }, []),
  );

  const onAuthStateChanged = useCallback(
    (loggedInUser: FirebaseAuthTypes.User | null) => {
      if (loggedInUser) {
        // Convert Firebase user to our app's User type
        const userData: User = {
          displayName: loggedInUser.displayName || "",
          uid: loggedInUser.uid,
          email: loggedInUser.email || "",
          photoURL: loggedInUser.photoURL || "",
        };
        setUser(userData);
        mmkvUtils.setUser(userData);

        // Navigate to home screen when user is authenticated
        navigation.navigate("UserScreens", {screen: "Home"});
      } else {
        setUser(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing, navigation, setUser],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Sign in with Google
      await GoogleSignin.signIn();

      // Get the ID token
      const {idToken} = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      // Navigation will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome Back</Text>
      <Text style={styles.h2}>
        Log in to continue your journey {"\n"} with us!
      </Text>
      <Input
        placeholder="Phone Number"
        size="large"
        value={value}
        style={styles.input}
        onChangeText={nextValue => setValue(nextValue)}
      />
      <Margin margin={30} />
      <CustomButton
        title="Log In"
        onPress={() => navigation.navigate("VerifyOtp" as never)}
        status="primary"
        size="medium"
      />
      <View style={styles.orContainer}>
        <View style={styles.orDivider} />
        <Text style={[styles.h2_bold, {marginBottom: 0}]}>Or</Text>
        <View style={styles.orDivider} />
      </View>
      <Text style={[styles.h2_bold, {color: primaryColor}]}>Log In with</Text>
      <View style={styles.social}>
        <TouchableOpacity disabled={loading} onPress={onGoogleButtonPress}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <GoogleIcon width={50} height={50} />
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <FacebookIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AppleIcon width={50} height={50} />
        </TouchableOpacity>
      </View>
      <Text style={styles.h2_bold}>
        Don't have an account?{" "}
        <Text
          onPress={() => navigation.navigate("Register" as never)}
          style={[styles.h2_bold, styles.underline]}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default Login;
