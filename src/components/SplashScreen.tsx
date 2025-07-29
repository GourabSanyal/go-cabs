import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Spinner} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import GoLogo from '../../assets/images/logo.svg';
import {useSelector} from 'react-redux';
import {RootState} from '@/shared/state/store';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const {isLoggedIn} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('Tabs');
      } else {
        navigation.replace('AuthScreens', {screen: 'Login'});
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <GoLogo width={220} height={114} />
      <Text style={styles.text}>let's go</Text>
      <View style={styles.loaderContainer}>
        <Spinner size="small" status="primary" />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0D0E22',
  },
  image: {width: 200, height: 114},
  text: {
    color: '#fff',
    fontSize: 28,
    marginTop: 20,
    fontFamily: 'Montserrat-Regular',
  },
  loaderContainer: {
    marginTop: 30,
  },
});
