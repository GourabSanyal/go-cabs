import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {customTheme} from './src/theme/custom-theme';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import RootNavigator from './src/routes/RootNavigator';
import {backgroundPrimary} from './src/theme/colors';
import {customMapping} from './src/theme/customMapping';
import {StatusBar} from 'expo-status-bar';

const App = () => (
  <>
    <StatusBar translucent style="inverted" />
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider
      {...eva}
      theme={{...eva.light, ...customTheme}}
      customMapping={customMapping}>
      <SafeAreaView style={styles.container}>
        <RootNavigator />
      </SafeAreaView>
    </ApplicationProvider>
  </>
);

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundPrimary,
    flex: 1,
    color: '#fff',
  },
});
