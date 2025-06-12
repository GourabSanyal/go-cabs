import React from "react";
import * as eva from "@eva-design/eva";
import {ApplicationProvider, IconRegistry} from "@ui-kitten/components";
import {StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {customTheme} from "./src/theme/custom-theme";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import RootNavigator from "./src/routes/RootNavigator";
import {backgroundPrimary} from "./src/theme/colors";
import {customMapping} from "./src/theme/customMapping";
import {RecoilRoot} from "recoil";
// import EnvDebugger from "./src/components/EnvDebugger";

// Set this to true to show environment variables debugger
// const SHOW_ENV_DEBUGGER = true;

const App = () => (
  <RecoilRoot>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider
      {...eva}
      theme={{...eva.light, ...customTheme}}
      customMapping={customMapping}>
      <SafeAreaView style={styles.container}>
        {/* {SHOW_ENV_DEBUGGER ? <EnvDebugger /> : <RootNavigator />} */}
        <RootNavigator />
      </SafeAreaView>
    </ApplicationProvider>
  </RecoilRoot>
);

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundPrimary,
    flex: 1,
    color: "#fff",
  },
});
