import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {backgroundPrimary, primaryColor} from '../../theme/colors';
import WebView from 'react-native-webview';
import CarIcon from '../../../assets/images/icons/car.svg';
import UserAvatar from '../../../assets/images/icons/avatar.svg';
import RatingStar from '../../../assets/images/icons/rating-star.svg';
import Margin from '../../components/Margin';
import DullDivider from '../../components/DullDivider';
import {Icon, Input} from '@ui-kitten/components';
import CustomButton from '../../components/CustomButton';
import {StackActions, useNavigation} from '@react-navigation/native';
import SendIcon from '../../../assets/images/icons/sendIcon-white.svg';
import {LinearGradient} from 'react-native-linear-gradient';
import {RootNavigationProp} from '@/shared/hooks/useAppNavigation';

const {width} = Dimensions.get('window');

const RideComplete = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [message, setMessage] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Animation values
  const iconScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const shineAnim = useRef(new Animated.Value(-width)).current;

  // Setup animations
  useEffect(() => {
    // Icon pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    // Create shine animation that moves across the component
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: width,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(shineAnim, {
          toValue: -width,
          duration: 0,
          useNativeDriver: true,
        }),
        // Add delay between animations
        Animated.delay(2000),
      ]),
    ).start();
  }, []);

  // Function to handle payment processing
  const handlePayment = () => {
    setShowPaymentDialog(true);

    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentDialog(false);
      setShowSuccessDialog(true);

      // Update ride state to completed
      // setRideState(prev => ({
      //   ...prev,
      //   status: "completed",
      //   payment: {
      //     method: prev.payment?.method || "metamask",
      //     confirmed: true,
      //   },
      // }));
    }, 2000);
  };

  // Function to handle payment success
  const handlePaymentSuccess = () => {
    setShowSuccessDialog(false);
    navigation.dispatch(StackActions.push('UserScreens', {screen: 'Home'}));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <View
            style={{
              width: '100%',
              height: 150,
              backgroundColor: backgroundPrimary,
            }}>
            <WebView
              originWhitelist={['*']}
              source={{uri: 'file:///android_asset/map.html'}}
              style={styles.webview}
            />
          </View>
        </View>
        <ScrollView style={styles.middleBlock}>
          <View style={styles.rideTypeContainer}>
            <Text style={styles.h3}>EV Prime</Text>
            <CarIcon width={30} height={30} />
          </View>
          <View style={{padding: 20}}>
            <Text style={styles.h4}>You've arrived at your destination!</Text>
            <Margin margin={5} />
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <UserAvatar width={45} height={45} />
              <View>
                <Text style={styles.h3}>Driver name</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 3,
                    alignItems: 'center',
                    marginTop: -5,
                  }}>
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <RatingStar width={15} height={15} />
                  <Text
                    style={{
                      color: primaryColor,
                      fontFamily: 'Montserrat-SemiBold',
                      marginLeft: 5,
                      marginTop: 2,
                    }}>
                    5
                  </Text>
                </View>
              </View>
              <View style={{flexGrow: 1}} />
              <Text style={[styles.h3, {alignSelf: 'flex-start'}]}>
                Toyota Camry
              </Text>
            </View>
            <DullDivider margin={30} />
            <View
              style={{
                flexDirection: 'row',
                gap: 50,
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', gap: 10}}
                onPress={() => navigation.navigate('CallDriver' as never)}>
                <Icon width={25} height={25} name="phone" fill={primaryColor} />
                <Text style={styles.h3}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', gap: 10}}
                onPress={() => navigation.navigate('MessageDriver' as never)}>
                <Icon
                  width={25}
                  height={25}
                  name="message-square"
                  fill={primaryColor}
                />
                <Text style={styles.h3}>Message</Text>
              </TouchableOpacity>
            </View>
            <Margin margin={20} />
            <View style={{width: '80%', margin: 'auto'}}>
              <CustomButton
                title="Safety Check"
                size="medium"
                status="primary"
                onPress={() =>
                  navigation.dispatch(
                    StackActions.push('ProfileScreens', {
                      screen: 'SafetyCheck',
                    }),
                  )
                }
              />
            </View>
            <Margin margin={30} />
            <View style={{flexDirection: 'row', gap: 15}}>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name="radio-button-on"
                  width={15}
                  height={15}
                  fill={primaryColor}
                />
                <View
                  style={{
                    height: 21,
                    width: 1,
                    backgroundColor: primaryColor,
                    marginVertical: -1,
                  }}
                />
                <Icon
                  name="radio-button-on"
                  width={15}
                  height={15}
                  fill={primaryColor}
                />
              </View>
              <View>
                <Text style={styles.h5}>Home</Text>
                <Margin margin={8} />
                <Text style={styles.h5}>
                  Lalbagh Botanical Garden, Bangalore
                </Text>
              </View>
            </View>
            <DullDivider margin={10} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <Text
                style={[
                  styles.h5,
                  {color: primaryColor, fontFamily: 'Montserrat-SemiBold'},
                ]}>
                You reached in 30 min
              </Text>
              <Text
                style={[
                  styles.h5,
                  {color: primaryColor, fontFamily: 'Montserrat-SemiBold'},
                ]}>
                7.7 km
              </Text>
            </View>
            <Margin margin={40} />
            <View style={styles.co2CardContainer}>
              <LinearGradient
                colors={['#005935', '#00BF72']}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                style={styles.co2Card}>
                {/* Shine effect overlay */}
                <Animated.View
                  style={[
                    styles.shineEffect,
                    {
                      transform: [{translateX: shineAnim}],
                    },
                  ]}>
                  <LinearGradient
                    colors={[
                      'rgba(255, 255, 255, 0.0)',
                      'rgba(255, 255, 255, 0.4)',
                      'rgba(255, 255, 255, 0.0)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <View style={styles.co2IconContainer}>
                  <Icon
                    name="globe-outline"
                    width={32}
                    height={32}
                    fill="#FFFFFF"
                  />
                </View>
                <View style={styles.co2TextContainer}>
                  <Text style={styles.co2SavedText}>3 kg</Text>
                  <Text style={styles.co2Text}>
                    CO₂ emissions saved on this ride!
                  </Text>
                </View>
                <View style={styles.co2BadgeContainer}>
                  <View style={styles.co2Badge}>
                    <Text style={styles.co2BadgeText}>ECO</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
            <Margin margin={30} />
            <View style={styles.fareCard}>
              <Text style={styles.fareTitle}>Ride Fare Breakdown</Text>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Base Fare</Text>
                <Text style={styles.fareValue}>₹100</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Service Fee</Text>
                <Text style={styles.fareValue}>₹20</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Taxes</Text>
                <Text style={styles.fareValue}>₹12</Text>
              </View>
              <View style={styles.fareRowTotal}>
                <Text style={styles.fareLabelTotal}>Total</Text>
                <Text style={styles.fareValueTotal}>₹100</Text>
              </View>
            </View>
            <Margin margin={30} />
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                paddingLeft: 20,
                marginBottom: -10,
              }}>
              <Text
                style={[
                  styles.h5,
                  {fontFamily: 'Montserrat-SemiBold', marginTop: 1},
                ]}>
                How was your experience?
              </Text>
              <View
                style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                <Icon
                  name="star-outline"
                  width={15}
                  height={15}
                  fill={'#fff'}
                />
                <Icon
                  name="star-outline"
                  width={15}
                  height={15}
                  fill={'#fff'}
                />
                <Icon
                  name="star-outline"
                  width={15}
                  height={15}
                  fill={'#fff'}
                />
                <Icon
                  name="star-outline"
                  width={15}
                  height={15}
                  fill={'#fff'}
                />
                <Icon
                  name="star-outline"
                  width={15}
                  height={15}
                  fill={'#fff'}
                />
              </View>
            </View>
            <Input
              style={styles.inputStyle}
              placeholder="Type a message..."
              value={message}
              size="medium"
              onChangeText={setMessage}
              accessoryRight={<SendIcon width={25} height={25} fill="#fff" />}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomBlock}>
          <CustomButton
            // title={`Pay ${
            //   baseFare !== undefined ? baseFare + 20 + 12 : "N/A"
            // } | Metamask`}
            title="FINISH & GO HOME"
            size="medium"
            onPress={() =>
              navigation.dispatch(
                StackActions.push('MainHome'),
              )
            }
            status="primary"
          />
        </View>
      </View>

      {/* Payment Processing Dialog */}
      <Modal
        visible={showPaymentDialog}
        transparent={true}
        animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="sync-outline"
              fill={primaryColor}
              width={50}
              height={50}
              style={styles.spinningIcon}
            />
            <Text style={styles.modalText}>Processing Payment...</Text>
            <Text style={styles.modalSubText}>
              Please wait while we process your payment
            </Text>
          </View>
        </View>
      </Modal>

      {/* Success Dialog */}
      <Modal
        visible={showSuccessDialog}
        transparent={true}
        animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="checkmark-circle-outline"
              fill={primaryColor}
              width={50}
              height={50}
            />
            <Text style={styles.modalText}>Payment Successful!</Text>
            <Text style={styles.modalSubText}>
              Your ride has been completed
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handlePaymentSuccess}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default RideComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundPrimary,
  },
  topBlock: {},
  middleBlock: {
    flex: 1,
  },
  bottomBlock: {
    padding: 20,
    backgroundColor: backgroundPrimary,
  },
  //
  chipCard: {
    backgroundColor: 'grey',
    height: 70,
    borderRadius: 12,
    width: 70,
  },
  switcText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  rideTypeContainer: {
    padding: 20,
    backgroundColor: '#101c17',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  webview: {
    width: '100%',
    height: 320,
  },
  innerCard: {
    backgroundColor: '#1c2722',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1.5,
    borderColor: primaryColor,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 15,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  h1: {
    fontSize: 22,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    marginBottom: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1c2722',
  },
  h3: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  },
  h5: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  h4: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: primaryColor,
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipContainer: {
    backgroundColor: '#D6FFEF',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#85FFCE',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#005231',
  },
  inputStyle: {
    backgroundColor: backgroundPrimary,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 6,
    marginTop: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1c2722',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1.5,
    borderColor: primaryColor,
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginTop: 15,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  spinningIcon: {
    transform: [{rotate: '0deg'}],
  },
  successButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 20,
  },
  successButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  },
  fareCard: {
    backgroundColor: '#1c2722',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1.5,
    borderColor: primaryColor,
  },
  fareTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: primaryColor,
    marginBottom: 15,
    textAlign: 'center',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fareRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  fareLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  fareLabelTotal: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  fareValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  fareValueTotal: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: primaryColor,
  },
  // New CO2 emission UI styles
  co2CardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00bf72',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    marginHorizontal: 5, // Add margin to better show the shadow
  },
  co2Card: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 229, 229, 0.3)',
    overflow: 'hidden', // Ensure gradient stays within borders
    borderRadius: 12,
  },
  shineEffect: {
    position: 'absolute',
    top: -20,
    left: 0,
    bottom: -20,
    width: 120,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  co2IconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  co2TextContainer: {
    flex: 1,
  },
  co2SavedText: {
    fontSize: 22,
    fontFamily: 'Montserrat-ExtraBold',
    color: '#FFFFFF',
  },
  co2Text: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  co2BadgeContainer: {
    alignItems: 'flex-end',
  },
  co2Badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  co2BadgeText: {
    color: '#005231',
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 12,
  },
});
