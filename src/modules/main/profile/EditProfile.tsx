import {View, StyleSheet} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import UserAvatar from '../../../../assets/images/icons/avatar.svg';
import EditIcon from '../../../../assets/images/icons/edit-icon.svg';
import Margin from '../../../components/Margin';
import {Input} from '@ui-kitten/components';
import {backgroundPrimary} from '../../../theme/colors';
import CustomButton from '../../../components/CustomButton';

const EditProfile = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <UserAvatar width={130} height={130} />
          <View style={{position: 'absolute', bottom: 0, right: 0}}>
            <EditIcon width={30} height={30} />
          </View>
        </View>
      </View>
      <Margin margin={20} />
      <View>
        <Input
          style={styles.inputStyle}
          placeholder="Type a message..."
          size="large"
          value="Arjun Sharma"
        />
        <Input
          style={styles.inputStyle}
          placeholder="Type a message..."
          size="large"
          value="+1 12345 67890"
        />
        <Input style={styles.inputStyle} placeholder="Email" size="large" />
        <Input style={styles.inputStyle} placeholder="Street" size="large" />
        <Input style={styles.inputStyle} placeholder="City" size="large" />
        <Input style={styles.inputStyle} placeholder="District" size="large" />
      </View>
      <View style={{flexGrow: 1}} />
      <CustomButton size="medium" title="Save Changes" />
      <Margin margin={10} />
      <BackButton />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    gap: 10,
    flex: 1,
  },
  inputStyle: {
    backgroundColor: backgroundPrimary,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 6,
    marginBottom: 20,
  },
});
