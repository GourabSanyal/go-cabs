import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { commonOnboardStyles } from './styles';
import NextIcon from '../../../assets/images/onboardin/2-next-button.svg'

const Screen2 = () => {
    const navigation = useNavigation();

    return (
        <View style={commonOnboardStyles.root}>
            <Layout style={commonOnboardStyles.imageContainer}>
                <Image source={require('../../../assets/images/onboardin/screen2.png')} style={commonOnboardStyles.image} />
            </Layout>
            <Layout style={commonOnboardStyles.body}>
                <Text style={commonOnboardStyles.h1}>
                    Affordable Fares
                </Text>
                <Text style={commonOnboardStyles.h2}>
                    Enjoy affordable fares with upfront  {'\n'}pricing and no hidden charges
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Screen3' as never)}>
                    <NextIcon style={commonOnboardStyles.nextBtn} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={commonOnboardStyles.link}>
                        Skip
                    </Text>
                </TouchableOpacity>
            </Layout>
        </View>
    );
};

export default Screen2;

