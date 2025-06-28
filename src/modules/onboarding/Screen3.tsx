import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {commonOnboardStyles} from './styles';
import NextIcon from '../../../assets/images/onboardin/3-next-button.svg';

const Screen3 = () => {
  const navigation = useNavigation();

  return (
    <View style={commonOnboardStyles.root}>
      <Layout style={commonOnboardStyles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboardin/screen3.png')}
          style={commonOnboardStyles.image}
        />
      </Layout>
      <Layout style={commonOnboardStyles.body}>
        <Text style={commonOnboardStyles.h1}>Multiple Services</Text>
        <Text style={commonOnboardStyles.h2}>
          Book rides, share bikes, rent taxis,{'\n'} or send packages
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Screen4' as never)}>
          <NextIcon style={commonOnboardStyles.nextBtn} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={commonOnboardStyles.link}>Skip</Text>
        </TouchableOpacity>
      </Layout>
    </View>
  );
};

export default Screen3;
