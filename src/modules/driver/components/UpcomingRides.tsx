import { StyleSheet, TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react'
import { Card, Icon, Text, Modal } from '@ui-kitten/components'
import UserAvatar from '../../../../assets/images/icons/avatar.svg';
import RatingStar from '../../../../assets/images/icons/rating-star.svg';
import { primaryColor } from '../../../theme/colors';
import DullDivider from '../../../components/DullDivider';
import Margin from '../../../components/Margin';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const UpcomingRides = () => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation()
    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={{ padding: 10, paddingHorizontal: 20 }}>
                        <Text style={styles.h2}>Upcoming ride</Text>
                    </View>
                    <View style={styles.cardBottom}>
                        <Text style={styles.h3}>scheduled at  10:00 am</Text>
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Icon name="chevron-right-outline" fill="#fff" width={30} height={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                visible={visible}
                backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onBackdropPress={() => setVisible(false)} // Close when clicking outside
            >
                <Card disabled={true} style={{ width: 340, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
                        <UserAvatar width={45} height={45} />
                        <View>
                            <Text style={styles.h3}>Naman</Text>
                            <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: -5 }}>
                                <RatingStar width={10} height={10} />
                                <RatingStar width={10} height={10} />
                                <RatingStar width={10} height={10} />
                                <RatingStar width={10} height={10} />
                                <RatingStar width={10} height={10} />
                                <Text style={{ color: primaryColor, fontFamily: 'Montserrat-SemiBold', fontSize: 10, marginLeft: 5, marginTop: 2 }}>5</Text>
                            </View>
                        </View>
                    </View>
                    <DullDivider margin={15} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={styles.h3}>
                            Estimated Fare
                        </Text>
                        <Text style={[styles.h3, { color: primaryColor }]}>
                            ₹162
                        </Text>
                    </View>
                    <DullDivider margin={15} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={styles.h3}>
                            Distance to Pickup
                        </Text>
                        <Text style={[styles.h3, { color: primaryColor }]}>
                            800 m
                        </Text>
                    </View>
                    <DullDivider margin={15} />
                    <View style={styles.innerCard}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                            <View style={{ height: 21, width: 1, backgroundColor: primaryColor, marginVertical: -1 }} />
                            <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                        </View>
                        <View>
                            <Text style={styles.h4}>
                                Bangalore Fort, Bangalore,
                            </Text>
                            <Margin margin={8} />
                            <Text style={styles.h4}>
                                Lalbagh Botanical Garden,
                            </Text>
                        </View>
                    </View>
                    <DullDivider margin={15} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginTop: 20 }}>
                        <CustomButton
                            title="Accept Ride"
                            status="primary"
                            size="small"
                            onPress={() => {
                                setVisible(false)
                                navigation.navigate('BookingRoutes', { screen: 'AcceptRide' });
                            }}
                            style={{ flexGrow: 1 }}
                        />
                        <CustomButton
                            onPress={() => setVisible(false)}
                            title="Reject Ride"
                            status="danger"
                            size="small"
                            style={{ flexGrow: 1 }}
                        />
                    </View>
                </Card>
            </Modal>
        </>
    )
}

export default UpcomingRides

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        backgroundColor: '#00BF72',
        borderWidth: 1.5,
        borderColor: '#fff',
        borderRadius: 12
    },
    cardBottom: {
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: "#202a26",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderTopWidth: 1.5,
        borderTopColor: "#fff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    h2: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#000',
    },
    h3: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: '#fff',
    },
    h4: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#fff',
    },
    innerCard: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 15
    },
})
