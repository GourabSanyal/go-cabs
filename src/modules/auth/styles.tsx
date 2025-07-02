import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#0D0E22',
        paddingTop: 70,
        paddingLeft: 30,
        paddingRight: 30,
    },
    input: {
        paddingTop: 30,
        fontFamily: 'Montserrat-Regular',
        backgroundColor: '#0D0E22',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 50,
        marginTop: 50,
    },
    orDivider: {
        height: 1,
        backgroundColor: '#fff',
        width: '100%',
    },
    h1: {
        color: '#fff',
        fontSize: 35,
        marginBottom: 5,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    h2: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 30,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
    },
    h2_bold: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 30,
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
    },
    button: {
        marginBottom: 20,
        marginTop: 30,
        // fontFamily: 'Montserrat-Bold',
        width: '100%',
        // borderRadius: 10,
    },
    underline: { color: primaryColor, textDecorationLine: 'underline' },
    image: {
        width: 50,
        height: 50,
    },
    social: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        height: 'auto',
        marginBottom: 30,
    },
    checkbox: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
    },
    modalcontainer: {
        minHeight: 192,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
