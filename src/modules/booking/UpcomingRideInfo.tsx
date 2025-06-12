import { StyleSheet, TouchableOpacity, View, } from 'react-native'
import React from 'react'
import { Icon, Text, } from '@ui-kitten/components'
import DullDivider from '../../components/DullDivider'
import { primaryColor } from '../../theme/colors'

const UpcomingRideInfo = () => {
    return (
        <>
            <View style={styles.container}>
                <>
                    <View style={styles.card}>
                        <View style={{ padding: 10, paddingHorizontal: 20 }}>
                            <Text style={styles.h2}>Upcoming ride</Text>
                        </View>
                        <View style={styles.innerCard}>
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                                <View style={{ height: 25, width: 1, backgroundColor: primaryColor, marginVertical: -1 }} />
                                <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                            </View>
                            <View style={{ flex: 1, gap: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", }}>
                                    <Text style={styles.h3}>
                                        Bangalore Fort, Bangalore,
                                    </Text>
                                    <Text style={[styles.h3, { backgroundColor: "#FFFFFF33", paddingVertical: 2, paddingHorizontal: 10, borderRadius: 4 }]}>
                                        EV
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", flex: 1 }}>
                                    <Text style={styles.h3}>
                                        Bangalore Fort, Bangalore,
                                    </Text>
                                    <Text style={[styles.h3, { fontFamily: 'Montserrat-SemiBold', color: primaryColor }]}>
                                        ₹162
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.cardBottom}>
                            <Text style={[styles.h3, { fontFamily: 'Montserrat-SemiBold' }]}>Scheduled at  10:00 am</Text>
                            <TouchableOpacity>
                                <Icon name="chevron-right-outline" fill="#fff" width={30} height={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
                <DullDivider margin={30} />
                <>
                    <View style={styles.card}>
                        <View style={{ padding: 10, paddingHorizontal: 20 }}>
                            <Text style={styles.h2}>Upcoming ride</Text>
                        </View>
                        <View style={styles.innerCard}>
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                                <View style={{ height: 25, width: 1, backgroundColor: primaryColor, marginVertical: -1 }} />
                                <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                            </View>
                            <View style={{ flex: 1, gap: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", }}>
                                    <Text style={styles.h3}>
                                        Bangalore Fort, Bangalore,
                                    </Text>
                                    <Text style={[styles.h3, { backgroundColor: "#FFFFFF33", paddingVertical: 2, paddingHorizontal: 10, borderRadius: 4 }]}>
                                        EV
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", flex: 1 }}>
                                    <Text style={styles.h3}>
                                        Bangalore Fort, Bangalore,
                                    </Text>
                                    <Text style={[styles.h3, { fontFamily: 'Montserrat-SemiBold', color: primaryColor }]}>
                                        ₹162
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.cardBottom}>
                            <Text style={[styles.h3, { fontFamily: 'Montserrat-SemiBold' }]}>Scheduled at  10:00 am</Text>
                            <TouchableOpacity>
                                <Icon name="chevron-right-outline" fill="#fff" width={30} height={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            </View >
        </>
    )
}

export default UpcomingRideInfo

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
        fontFamily: 'Montserrat-Regular',
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
        borderRadius: 0,
        flexDirection: 'row',
        gap: 15,
        backgroundColor: "#202a26",
    },
})
