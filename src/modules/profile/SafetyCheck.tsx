import { View, Text, StyleSheet, FlatList, } from 'react-native'
import React from 'react'
import BackButton from './common/BackButton';
import { primaryColor } from '../../theme/colors';
import { Icon } from '@ui-kitten/components';

const SafetyCheck = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Safety Check</Text>
            <FlatList
                data={safetyChecks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Icon name={item?.icon} width={25} height={25} fill={primaryColor} />
                        <Text style={[styles.h2, { fontFamily: 'Montserrat-Bold' }]}>{item.title}</Text>
                    </View>
                )}
            />
            <Text style={styles.heading}>Safety Tips</Text>
            <FlatList
                data={saftyTipes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Icon name="arrow-forward-outline" style={{ marginTop: 5 }} width={20} height={20} fill={"#fff"} />
                        <Text style={styles.h2}>{item}</Text>
                    </View>
                )}
            />
            <View style={{ flexGrow: 1 }} />
            <BackButton />
        </View>
    )
}

export default SafetyCheck

const saftyTipes = [
    `Verify the driver’s name and vehicle details before starting the ride`,
    `Avoid sharing personal details with the driver`,
    `Use the SOS button in case of an emergency`,
    `Ensure doors are locked before starting the ride`,
]

const safetyChecks = [
    {
        title: "Call emergency contacts",
        icon: "phone",
    },
    {
        title: "Send sOS Alert",
        icon: "message-square",
    },
    {
        title: "share live location",
        icon: "pin",
    },
]

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    heading: {
        fontSize: 26,
        fontFamily: 'Montserrat-Bold',
        color: primaryColor,
    },
    h2: {
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
        color: "#fff",
    },
    h1: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: "#fff",
    },
    listItem: {
        paddingLeft: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        paddingVertical: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
    }
})
