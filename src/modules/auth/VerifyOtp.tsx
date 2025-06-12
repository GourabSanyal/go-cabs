import { View } from 'react-native';
import React from 'react';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import OTPInput from './OtpInput';
import CustomButton from '../../components/CustomButton';
import Margin from '../../components/Margin';

const VerifyOtp = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>
                Phone Verification
            </Text>
            <Text style={styles.h2}>
                Enter your OTP code
            </Text>
            <OTPInput />
            <Text style={[styles.h2_bold, { fontSize: 14, marginTop: 20, marginBottom: 50 }]}>
                Didn’t receive code? <Text style={[styles.h2_bold, styles.underline, { fontSize: 14, }]}>Resend again</Text>
            </Text>
            <Margin margin={30} />
            <CustomButton title="Verify OTP" onPress={() => navigation.navigate('OnboardingScreens', { screen: 'Screen1' })} status="primary" size="medium" />
        </View >
    );
};

export default VerifyOtp;


