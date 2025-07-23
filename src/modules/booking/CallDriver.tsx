import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import UserAvatar from '../../../assets/images/icons/avatar.svg';
import SpeakerIcon from '../../../assets/images/icons/more-call.svg';
import MoreIcon from '../../../assets/images/icons/speaker.svg';
import DisconnectCall from '../../../assets/images/icons/disconnect-call.svg';
import { primaryColor } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

const CallDriver = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <UserAvatar width={100} height={100} />
            <Text style={styles.h5}>Calling...</Text>
            <Text style={styles.h1}>Anil Kumar</Text>
            <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center', marginTop: 200 }}>
                <TouchableOpacity>
                    <MoreIcon width={50} height={50} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <DisconnectCall width={70} height={70} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <SpeakerIcon width={50} height={50} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default CallDriver

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    h1: {
        color: "#fff",
        fontSize: 30,
        fontFamily: 'Montserrat-Bold',
    },
    h5: {
        color: primaryColor,
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    }
})
