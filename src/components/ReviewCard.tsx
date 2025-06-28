import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { primaryColor } from '../theme/colors'
import UserAvatar from '../../assets/images/icons/avatar.svg';
import RatingStar from '../../assets/images/icons/rating-star.svg';

const ReviewCard = () => {
    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 2 }}>
                <UserAvatar width={45} height={45} />
                <View>
                    <Text style={styles.title}>Naman</Text>
                    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center',marginTop: -5 }}>
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <RatingStar width={15} height={15} />
                        <Text style={{ color: primaryColor, fontFamily: 'Montserrat-SemiBold', marginLeft: 5, marginTop: 2 }}>5</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.h2}>
                There must be a feature so that we can do a basic chat with others regarding carbon coins and other crypto stuff
            </Text>
            <Text style={[styles.h2, { marginTop: 5, fontFamily: 'Montserrat-ExtraBold' }]}>
                #gomobility #evcabs #safety
            </Text>
        </View>
    )
}

export default ReviewCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: primaryColor,
        backgroundColor: '#1c2722',
        padding: 15,
        gap: 10,
    },
    title: {
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
    h2: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
    }
})
