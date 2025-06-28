import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {commonOnboardStyles} from './styles';
import NextIcon from '../../../assets/images/onboardin/4-next-button.svg';
import CustomButton from '../../components/CustomButton';
import Margin from '../../components/Margin';

const Screen4 = () => {
  const navigation = useNavigation();

  return (
    <View style={commonOnboardStyles.root}>
      <Layout style={commonOnboardStyles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboardin/screen4.png')}
          style={commonOnboardStyles.image}
        />
      </Layout>
      <Layout style={commonOnboardStyles.body}>
        <Text style={commonOnboardStyles.h1}>Multiple Payments</Text>
        <Text style={commonOnboardStyles.h2}>
          Pay securely using crypto wallets, {'\n'} cards, or UPI
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserScreens' as never)}>
          <NextIcon style={commonOnboardStyles.nextBtn} />
        </TouchableOpacity>
        <Margin margin={20} />
        <CustomButton
          title="Procced with driver flow"
          onPress={() => navigation.navigate('DriverScreens' as never)}
          status="primary"
          size="small"
        />
        <TouchableOpacity>
          <Text style={commonOnboardStyles.link}>Skip</Text>
        </TouchableOpacity>
      </Layout>
    </View>
  );
};

export default Screen4;
