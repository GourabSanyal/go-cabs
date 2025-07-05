import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>
      <Margin margin={10} />
      <View>
        <Text style={styles.h2}>
          At Go Cabs, we value your trust and are committed to protecting your
          privacy.
        </Text>
        <Margin margin={10} />
        <Text style={styles.h2}>
          This Privacy Policy explains how we collect, use, and safeguard your
          personal information when you use our services.
        </Text>
        <Margin margin={10} />
        <Text style={styles.h2}>
          By using the Go Cabs app, you agree to the practices described in this
          policy.
        </Text>
        <Margin margin={10} />
        <Text style={styles.h1}>1. Information We Collect</Text>
        <Margin margin={10} />
        <Text style={styles.h2}>
          We collect the following types of information to provide and improve
          our services:
        </Text>
        <Margin margin={10} />
        <Text style={styles.h2}>1.1 Personal Information:</Text>
        <FlatList
          data={[
            'Name, email address, phone number, and profile photo when you create an account.',
            'Payment information, such as credit/debit card details or wallet IDs.',
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                paddingLeft: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
              }}>
              <Text style={[styles.h2, {marginTop: 1}]}>•</Text>
              <Text style={styles.h2}>{item}</Text>
            </View>
          )}
        />
      </View>
      <View style={{flexGrow: 1}} />
      <BackButton />
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 26,
    fontFamily: 'Montserrat-Bold',
    color: primaryColor,
  },
  h2: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  },
  h1: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
});
