import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../profile/common/BackButton'
import DullDivider from '../../components/DullDivider'
import SendIcon from '../../../assets/images/icons/sendIcon-white.svg';
import UserAvatar from '../../../assets/images/icons/avatar.svg';
import RatingStar from '../../../assets/images/icons/rating-star.svg';
import { backgroundPrimary, primaryColor } from '../../theme/colors';
import { Input } from '@ui-kitten/components';

const MessageDriver = () => {
    const [message, setMessage] = useState("");
    return (
        <>
            <View style={{ padding: 20 }}>
                <BackButton />
            </View>
            <DullDivider />
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 }}>
                <UserAvatar width={45} height={45} />
                <View>
                    <Text style={styles.h3}>Naman</Text>
                    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: -5 }}>
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <Text style={{ color: primaryColor, fontFamily: 'Montserrat-SemiBold', marginLeft: 5, marginTop: 2 }}>5</Text>
                    </View>
                </View>
            </View>
            <DullDivider />
            <View style={styles.container}>
                {/* Rider Message */}
                <View style={styles.toContainer}>
                    <Text style={styles.chatText}>Hi, are you on the way?</Text>
                </View>

                {/* Driver Message */}
                <View style={styles.fromContainer}>
                    <Text style={styles.chatText}>Yes, I’m 5 minutes away.</Text>
                </View>

                {/* Rider Message */}
                <View style={styles.toContainer}>
                    <Text style={styles.chatText}>Okay, I’ll be waiting at pickup point.</Text>
                </View>

                {/* Driver Message */}
                <View style={styles.fromContainer}>
                    <Text style={styles.chatText}>Got it! See you soon.</Text>
                </View>

                {/* Rider Message */}
                <View style={styles.toContainer}>
                    <Text style={styles.chatText}>I see your car. Waving at you!</Text>
                </View>

                {/* Driver Message */}
                <View style={styles.fromContainer}>
                    <Text style={styles.chatText}>Great! Parking now.</Text>
                </View>
                <Input
                    style={styles.inputStyle}
                    placeholder="Type a message..."
                    value={message}
                    size="large"
                    onChangeText={setMessage}
                    accessoryRight={
                        <SendIcon width={28} height={28} fill="#fff" />
                    }
                />
            </View>
        </>
    )
}

export default MessageDriver
// #00BF72
// #B4FFE1
const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
    },
    chatText: {
        color: "#020F0A",
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
    h3: {
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: '#fff',
    },
    fromContainer: {
        backgroundColor: "#00BF72",
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-start'

    },
    toContainer: {
        backgroundColor: "#B4FFE1",
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
    inputStyle: {
        backgroundColor: backgroundPrimary,
        borderWidth: 1.5,
        borderColor: "#fff",
        borderRadius: 6,
        marginTop: 20,
    }
})
