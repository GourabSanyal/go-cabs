import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';
import DullDivider from '../../../components/DullDivider';
import CustomButton from '../../../components/CustomButton';
import {Icon, Toggle} from '@ui-kitten/components';

const TwoStepVerification = () => {
  const [checked, setChecked] = React.useState(true);

  const onCheckedChange = (isChecked: any) => {
    setChecked(isChecked);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>2-Step Verfication</Text>
      <Margin margin={10} />
      <Text style={styles.h2}>
        Add an extra layer of security to your account to keep your personal
        details safe.
      </Text>
      <DullDivider margin={30} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.h1}>Status : </Text>
        <Text style={styles.h2}>Enabled</Text>
        <View style={{flexGrow: 1}} />
        <Toggle checked={checked} onChange={onCheckedChange} />
      </View>
      <DullDivider margin={30} />
      {checked && (
        <View>
          <View style={styles.listItem}>
            <Icon
              name="radio-button-off-outline"
              width={25}
              height={25}
              fill={primaryColor}
            />
            <Text style={styles.h2}>SMS Verification</Text>
          </View>
          <View style={styles.listItem}>
            <Icon
              name="checkmark-circle-outline"
              width={25}
              height={25}
              fill={primaryColor}
            />
            <Text style={styles.h2}>Email Verification</Text>
          </View>
        </View>
      )}
      <View style={{flexGrow: 1}} />
      {checked && (
        <CustomButton title="Verify" status="primary" size="medium" />
      )}
      <Margin margin={20} />
      <BackButton />
    </View>
  );
};

export default TwoStepVerification;

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
