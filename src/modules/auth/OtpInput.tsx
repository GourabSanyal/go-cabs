import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@ui-kitten/components';

const OTPInput: React.FC = () => {
    // Define the OTP state as an array of strings
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const theme = useTheme();

    // Reference to store input elements
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        // Only allow numeric characters
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            // Move to the next input if text is entered and it's not the last index
            if (text && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
            // Move to the previous input if text is cleared and it's not the first index
            else if (!text && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={el => (inputRefs.current[index] = el)} // Using the useRef hook
                    style={[styles.input, { borderColor: theme['color-success-500'] }]}
                    value={digit}
                    onChangeText={text => handleChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#0A0A23', // Dark background similar to the image
        gap: 5,
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 20,
        color: '#FFFFFF', // White text
    },
});

export default OTPInput;
