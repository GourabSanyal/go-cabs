import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';
import {Icon} from '@ui-kitten/components';

const ManageAccount = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Your Account</Text>
      <Margin margin={20} />
      <View>
        <FlatList
          data={accountSettings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Icon
                name={item?.icon}
                width={25}
                height={25}
                fill={primaryColor}
              />
              <Text style={[styles.h2, {fontFamily: 'Montserrat-Bold'}]}>
                {item.title}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={{flexGrow: 1}} />
      <Margin margin={20} />
      <BackButton />
    </View>
  );
};

export default ManageAccount;

const accountSettings = [
  {
    title: 'Payment Methods',
    icon: 'credit-card',
  },
  {
    title: 'Request Account Data',
    icon: 'file-text',
  },
  {
    title: 'Deactivate Account',
    icon: 'trash',
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
  listItem: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
  },
});
