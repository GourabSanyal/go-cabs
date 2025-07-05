import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import BackButton from '../common/BackButton';
import {primaryColor} from '../../../theme/colors';
import Margin from '../../../components/Margin';
import {Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <Margin margin={20} />
      <View>
        <FlatList
          data={settingData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() =>
                item.title === 'Edit Profile'
                  ? navigate.navigate('EditProfile' as never)
                  : ''
              }>
              <Icon
                name={item?.icon}
                width={25}
                height={25}
                fill={primaryColor}
              />
              <Text style={[styles.h2, {fontFamily: 'Montserrat-Bold'}]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{flexGrow: 1}} />
      <Margin margin={20} />
      <BackButton />
    </View>
  );
};

export default Settings;

const settingData = [
  {
    title: 'Edit Profile',
    icon: 'person',
  },
  {
    title: 'Notifications',
    icon: 'bell',
  },
  {
    title: 'Language',
    icon: 'globe',
  },
  {
    title: 'Report an issue',
    icon: 'alert-triangle',
  },
  {
    title: 'App Version',
    icon: 'layers',
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
