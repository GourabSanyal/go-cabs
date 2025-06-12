export type RootStackParamList = {
  AuthScreens: undefined;
  OnboardingScreens: {screen: keyof OnboardingParamList} | undefined; // `screen` is the key from OnboardingParamList
};

export type OnboardingParamList = {
  Screen1: undefined;
};
