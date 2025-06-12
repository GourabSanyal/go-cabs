import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "GoCabs",
    slug: "go-cabs-and-drive",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "drive",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    splash: {
        image: "./src/assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        googleServicesFile: "./GoogleService-Info.plist",
        supportsTablet: true,
        bundleIdentifier: "com.gocabs",
        jsEngine: "hermes",
    },
    android: {
        googleServicesFile: "./google-services.json",
        adaptiveIcon: {
            foregroundImage: "./src/assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        package: "com.gocabs",
        jsEngine: "hermes",
    },
    developmentClient: {
        silentLaunch: true,
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./src/assets/images/favicon.png",
    },
    plugins: [
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        [
            "expo-build-properties",
            {
                "ios": {
                    "useFrameworks": "static"
                }
            }
        ],
        [
            "expo-location",
            {
                locationWhenInUsePermission:
                    "Show current location on map for navigation.",
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: "fdd3b266-be2b-4347-9598-c6373b304ac4",
        },
    },
    owner: "go-cabs",
});