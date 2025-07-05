import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {commonOnboardStyles} from './styles';
import NextIcon from '../../../assets/images/onboardin/1-next-button.svg';

const Screen1 = () => {
  const navigation = useNavigation();

  return (
    <View style={commonOnboardStyles.root}>
      <Layout style={commonOnboardStyles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboardin/screen1.png')}
          style={commonOnboardStyles.image}
        />
      </Layout>
      <Layout style={commonOnboardStyles.body}>
        <Text style={commonOnboardStyles.h1}>Eco-Friendly Rides</Text>
        <Text style={commonOnboardStyles.h2}>
          Choose eco-friendly options for a {'\n'}cleaner future
        </Text>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => navigation.navigate('Screen2' as never)}>
          <NextIcon style={commonOnboardStyles.nextBtn} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => navigation.navigate('Tabs' as never)}>
          <Text style={commonOnboardStyles.link}>Skip</Text>
        </TouchableOpacity>
      </Layout>
    </View>
  );
};

export default Screen1;
