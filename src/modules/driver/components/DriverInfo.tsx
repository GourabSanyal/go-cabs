import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from '@ui-kitten/components'
import { primaryColor } from '../../../theme/colors'
import Margin from '../../../components/Margin'
import Chip from '../../../components/Chip'

const DriverInfo = () => {
    return (
        <View style={{ paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.h1}>
                    Vehicle name
                </Text>
                <View style={{ flexGrow: 1 }} />
                <Icon name="edit-2" fill="#fff" width={20} height={20} />
                <Text style={styles.h3}>
                    Edit
                </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.h3}>
                    Vehicle number plate
                </Text>
                <Icon name="checkmark-circle-2" fill={primaryColor} width={15} height={15} />
                <View style={{ flexGrow: 1 }} />
                <Icon name="plus" fill="#fff" width={20} height={20} />
                <Text style={styles.h3}>
                    Add
                </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.h3}>
                    Vehicle type
                </Text>
                <View style={{ flexGrow: 1 }} />
            </View>
            <Margin margin={20} />
            <View style={styles.balanceContainer}>
                <View style={{ margin: 'auto' }}>
                    <View style={styles.chipContainer}>
                        <Text style={styles.text}>Your Balance</Text>
                    </View>
                </View>
                <Margin margin={10} />
                <Text style={[styles.h1, { textAlign: 'center' }]}>
                    $1200
                </Text>
                <Margin margin={20} />
                <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <Icon name="download" fill="#fff" width={25} height={50} />
                        </TouchableOpacity>
                        <Text style={[styles.h3, { textAlign: 'center', marginTop: 10 }]}>
                            Withdraw
                        </Text>
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <Icon name="swap" fill="#fff" width={25} height={25} />
                        </TouchableOpacity>
                        <Text style={[styles.h3, { textAlign: 'center', marginTop: 10 }]}>
                            Transaction
                        </Text>
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <Icon name="more-vertical" fill="#fff" width={25} height={25} />
                        </TouchableOpacity>
                        <Text style={[styles.h3, { textAlign: 'center', marginTop: 10 }]}>
                            More
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default DriverInfo

const styles = StyleSheet.create({
    chipContainer: {
        backgroundColor: "#00BF72",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: "#0D0E22",
    },
    //
    h1: {
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
        fontSize: 25,
    },
    h3: {
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
    },
    balanceContainer: {
        borderWidth: 1.5,
        borderColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    iconContainer: {
        backgroundColor: "#1c2722",
        borderRadius: 8,
        width: 50,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
