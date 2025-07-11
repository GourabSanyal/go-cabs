import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GoLogo from '../../assets/images/logo.svg';
import {ArrowLeft} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

const TopBar = ({hasBackButton}: {hasBackButton?: boolean}) => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        {hasBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.95}>
            <ArrowLeft
              color="white"
              strokeWidth="4"
              style={{marginRight: 15}}
            />
          </TouchableOpacity>
        )}
        <GoLogo width={65} height={34} />
      </View>
    </>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
