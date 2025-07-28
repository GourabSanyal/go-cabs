import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {CheckBox, Input, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {primaryColor} from '../../theme/colors';
import {styles} from './styles';
import Margin from '../../components/Margin';
import FacebookIcon from '../../../assets/images/icons/facebook.svg';
import AppleIcon from '../../../assets/images/icons/apple.svg';
import CustomButton from '../../components/CustomButton';
import GoogleAuth from '@/components/GoogleAuth';
import {useSelector} from 'react-redux';
import {RootState} from '@/shared/state/store';

const Signup = () => {
  const navigation = useNavigation();
  const [value, setValue] = React.useState('');
  const [checked, setChecked] = React.useState(true);
  const {isLoggingIn} = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome Back</Text>
      <Text style={styles.h2}>
        Start your eco-friendly journey {'\n'} with us!
      </Text>
      <Input
        placeholder="Phone Number"
        size="large"
        value={value}
        style={styles.input}
        onChangeText={nextValue => setValue(nextValue)}
        disabled={isLoggingIn}
      />
      <View style={{marginTop: 30}}>
        <CheckBox
          checked={checked}
          onChange={nextChecked => setChecked(nextChecked)}
          disabled={isLoggingIn}>
          <Text>
            <Text style={styles.checkbox}>By signing up. you agree to the</Text>{' '}
            <Text
              style={[
                styles.checkbox,
                {textDecorationLine: 'underline', color: primaryColor},
              ]}>
              Terms of service
            </Text>{' '}
            and{' '}
            <Text
              style={[
                styles.checkbox,
                {textDecorationLine: 'underline', color: primaryColor},
              ]}>
              Privacy policy
            </Text>
            .
          </Text>
        </CheckBox>
      </View>
      <Margin margin={30} />
      <CustomButton
        title="Sign Up"
        onPress={() => navigation.navigate('VerifyOtp' as never)}
        status="primary"
        size="medium"
        disabled={isLoggingIn}
      />
      <View style={styles.orContainer}>
        <View style={styles.orDivider} />
        <Text style={[styles.h2_bold, {marginBottom: 0}]}>Or</Text>
        <View style={styles.orDivider} />
      </View>
      <Text style={[styles.h2_bold, {color: primaryColor}]}>Sign Up with</Text>
      <View style={styles.social}>
        <GoogleAuth />
        <TouchableOpacity 
          activeOpacity={0.95}
          disabled={isLoggingIn}
          style={{ opacity: isLoggingIn ? 0.7 : 1 }}>
          <FacebookIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.95}
          disabled={isLoggingIn}
          style={{ opacity: isLoggingIn ? 0.7 : 1 }}>
          <AppleIcon width={50} height={50} />
        </TouchableOpacity>
      </View>
      <Text style={styles.h2_bold}>
        Don't have an account?{' '}
        <Text
          onPress={() => navigation.navigate('Login' as never)}
          style={[styles.h2_bold, styles.underline]}>
          Log In
        </Text>
      </Text>
      {/* onPress={() => navigation.navigate('OnboardingScreens', { screen: 'Screen1' })} */}
    </View>
  );
};

export default Signup;
