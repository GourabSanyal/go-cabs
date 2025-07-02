import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Spinner} from '@ui-kitten/components';
import {StackActions, useNavigation} from '@react-navigation/native';
import GoLogo from '../../assets/images/logo.svg';

interface SplashScreenProps {
  showLoader?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({showLoader = false}) => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        StackActions.replace('AuthScreens', {screen: 'Login'}),
      );
    }, 1000);
  }, []);

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
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
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
