import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/colors';

export const commonOnboardStyles = StyleSheet.create({
  imageContainer: {
    height: '50%',
    backgroundColor: primaryColor,
  },
  root: {
    backgroundColor: primaryColor,
    flex: 1,
  },
  h1: {
    marginTop: 25,
    color: '#fff',
    fontSize: 30,
    marginBottom: 10,
    //  fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  h2: {
    color: '#fff', fontSize: 16, marginBottom: 30,
    // fontWeight: 300,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  button: { marginTop: 20 },
  image: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  body: {
    height: '50%',
    backgroundColor: '#0D0E22',
    padding: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  nextBtn: {
    width: 85,
    height: 85,
    textAlign: 'center',
    margin: 'auto',
  },
  link: {
    color: '#fff', fontSize: 16, marginTop: 15,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    textDecorationColor: '#fff',
    textDecorationLine: 'underline',
  },
});
