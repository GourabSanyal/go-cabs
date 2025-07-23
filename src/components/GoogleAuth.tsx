import React from 'react';
import {TouchableOpacity} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from '@react-native-firebase/firestore';
import GoogleIcon from '../../assets/images/icons/google.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoogleAuth() {
  const db = getFirestore();

  GoogleSignin.configure({
    webClientId:
      '1051726678978-go98d67mjjhi39t7326u3gbcpqn6sncb.apps.googleusercontent.com',
  });

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const email = signInResult.data?.user.email;
      const photo = signInResult.data?.user.photo;
      const name = signInResult.data?.user.name;
      const userId = signInResult.data?.user.id;
      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.data?.idToken;
      }
      if (!idToken || !name || !userId) {
        throw new Error('No ID token & name found');
      }

      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('userId', userId);

      const existingUser = await getDocs(
        query(collection(db, 'users'), where('email', '==', email)),
      );
      // Create user if not exists
      if (!existingUser.docs[0]) {
        await addDoc(collection(db, 'users'), {userId, name, email, photo});
      }
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(
        signInResult.data!.idToken,
      );
      // Sign-in the user with the credential
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() =>
        onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
      }>
      <GoogleIcon width={50} height={50} />
    </TouchableOpacity>
  );
}
