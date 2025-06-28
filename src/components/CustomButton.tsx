import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

// Status-based colors
const STATUS_COLORS = {
    primary: '#01CD5D',
    secondary: '#005F33',
    danger: '#E53636',
    disabled: '#CCCCCC',
} as const;

// Size-based styles
const SIZE_STYLES = {
    small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
    medium: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 },
} as const;

// Define status and size types based on the keys of the constants
type ButtonStatus = keyof typeof STATUS_COLORS;
type ButtonSize = keyof typeof SIZE_STYLES;

interface CustomButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    size?: ButtonSize;
    status?: ButtonStatus;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    size = 'medium',
    status = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const buttonColor = disabled ? STATUS_COLORS.disabled : STATUS_COLORS[status] || STATUS_COLORS.primary;
    const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.medium;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: buttonColor,
                    paddingVertical: sizeStyle.paddingVertical,
                    paddingHorizontal: sizeStyle.paddingHorizontal,
                },
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={[styles.text, { fontSize: sizeStyle.fontSize }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-SemiBold',
        textTransform: 'uppercase',
    },
    disabled: {
        opacity: 0.6,
    },
});

export default CustomButton;

//   <CustomButton title="Primary" onPress={() => Alert('Primary Pressed')} status="primary" size="medium" />
// <CustomButton title="Secondary" onPress={() => Alert('Secondary Pressed')} status="secondary" size="large" />
// <CustomButton title="Danger" onPress={() => Alert('Danger Pressed')} status="danger" size="small" />
// <CustomButton title="Loading" loading size="medium" />
// <CustomButton title="Disabled" disabled size="medium" />
