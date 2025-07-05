import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';
import DullDivider from '../../../components/DullDivider';
import {Icon} from '@ui-kitten/components';

const EmergencyContact = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.heading}>Emergency Contact</Text>
        <Icon name="edit-2-outline" width={25} height={25} fill={'#fff'} />
      </View>
      <DullDivider margin={20} />
      <View>
        <View style={styles.listItem}>
          <Icon name="plus-outline" width={25} height={25} fill={'#fff'} />
          <Text style={styles.h2}>Add contacts</Text>
        </View>
        <DullDivider margin={10} />
        <View style={styles.listItem}>
          <Icon name="person" width={25} height={25} fill={primaryColor} />
          <Text style={styles.h2}>Name 1</Text>
          <View style={{flexGrow: 1}} />
          <Icon name="phone" width={25} height={25} fill={primaryColor} />
        </View>
        <DullDivider margin={10} />
        <View style={styles.listItem}>
          <Icon name="person" width={25} height={25} fill={primaryColor} />
          <Text style={styles.h2}>Name 2</Text>
          <View style={{flexGrow: 1}} />
          <Icon name="phone" width={25} height={25} fill={primaryColor} />
        </View>
        <DullDivider margin={10} />
      </View>
      <View style={{flexGrow: 1}} />
      {/* {checked && <CustomButton title="Verify" status="primary" size="medium" />} */}
      <Margin margin={20} />
      <BackButton />
    </View>
  );
};

export default EmergencyContact;

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
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
  },
});
