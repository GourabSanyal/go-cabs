import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserAvatar from '../../../assets/images/icons/avatar.svg';
import RatingStar from '../../../assets/images/icons/rating-star.svg';
import { backgroundPrimary, primaryColor } from '../../theme/colors';
import { Icon } from '@ui-kitten/components';

const Community = () => {
    return (
        <>
            <View style={styles.container}>
                {new Array(5).fill("").map((item, i) =>
                    <View key={i} style={styles.card}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 2 }}>
                            <UserAvatar width={45} height={45} />
                            <View>
                                <Text style={styles.title}>Naman</Text>
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
                        <Text style={styles.h2}>
                            Life in motion, one ride at a time. Whether it’s a quick commute, chasing dreams, or making memories, we’re here to get you there smoothly and safely.
                        </Text>
                        <Text style={[styles.h2, { marginTop: -10, fontFamily: 'Montserrat-ExtraBold', color: primaryColor }]}>
                            #gomobility #evcabs #safety
                        </Text>
                        <View style={{ width: "100%" }}>
                            <Image source={require('../../../assets/images/comunity-cars.png')} style={styles.socialImage} />
                        </View>
                        <View style={styles.shareContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Icon name="message-square-outline" fill="#fff" width={20} height={20} />
                                <Text style={{ color: '#fff', fontFamily: 'Montserrat-SemiBold', fontSize: 12 }}>
                                    10 Comments
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Icon name="heart" fill={primaryColor} width={20} height={20} />
                                <Text style={{ color: '#fff', fontFamily: 'Montserrat-SemiBold', fontSize: 12 }}>
                                    40 Likes
                                </Text>
                            </View>
                            <Icon name="share-outline" fill="#fff" width={20} height={20} />
                            <Icon name="bookmark-outline" fill="#fff" width={20} height={20} />
                            <Icon name="more-horizontal-outline" fill="#fff" width={20} height={20} />
                        </View>
                    </View>
                )}
            </View>
        </>
    )
}

export default Community

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 10,
        gap: 10
    },
    card: {
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
        padding: 10,
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
    },
    socialImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 8,
        backgroundColor: backgroundPrimary
    },
    shareContainer: {
        marginVertical: 5,
        flexDirection: 'row', gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    }
})
