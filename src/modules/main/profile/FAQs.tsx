import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';
import Accordion from '../../../components/Accordion';

const FAQs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FAQs</Text>
      <Margin margin={20} />
      {data?.map((item, i) => (
        <Accordion data={item} key={i} />
      ))}
      <View style={{flexGrow: 1}} />
      <BackButton />
    </View>
  );
};

export default FAQs;

const data = [
  {
    title: 'How can I contact my driver?',
    content:
      'Once your ride is confirmed, you can contact your driver through the in-app chat or call option for any queries or updates.',
  },
  {
    title: 'What if I need to cancel a ride?',
    content:
      'Once your ride is confirmed, you can contact your driver through the in-app chat or call option for any queries or updates.',
  },
  {
    title: 'How do I update my profile information?',
    content:
      'Once your ride is confirmed, you can contact your driver through the in-app chat or call option for any queries or updates.',
  },
  {
    title: 'Are there special services for airport or event rides?',
    content:
      'Once your ride is confirmed, you can contact your driver through the in-app chat or call option for any queries or updates.',
  },
  {
    title: 'How do I delete my account?',
    content:
      'Once your ride is confirmed, you can contact your driver through the in-app chat or call option for any queries or updates.',
  },
];

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
    color: primaryColor,
  },
});
