import { StyleSheet, View } from 'react-native';
import React from 'react';
import UpcomingRides from './components/UpcomingRides';
import DullDivider from '../../components/DullDivider';
import { Text } from '@ui-kitten/components';
import CarIcon from '../../../assets/images/icons/building-icon.svg';
import { primaryColor } from '../../theme/colors';

const History = () => {
    return (
        <>
            <UpcomingRides />
            <View style={styles.container}>
                <DullDivider />
                {ridesData?.map((item, i) =>
                    <View key={i} style={styles.listItem}>
                        <CarIcon width={40} height={40} />
                        <View style={{ flexGrow: 1 }}>
                            <Text style={styles.h1}>{item.title}</Text>
                            <Text style={styles.h2}>{item.description}</Text>
                        </View>
                        <Text style={[styles.h1, { alignSelf: 'flex-start', fontSize: 20,color:primaryColor }]}>{item.price}</Text>
                    </View>
                )}
            </View>
        </>
    );
};

export default History;

const ridesData = [
    {
        title: 'EV Classic',
        description: 'Arrives in 15 mins',
        price: '₹ 150',
    },
    {
        title: 'EV Prime',
        description: 'Arrives in 12 mins',
        price: '₹ 162',
    },
    {
        title: 'EV Deluxe',
        description: 'Arrives in 11 mins',
        price: '₹ 175',
    },
    {
        title: 'EV Pro',
        description: 'Arrives in 09 mins',
        price: '₹ 198',
    },
    {
        title: 'HSR, BLR → Office',
        description: 'EV Deluxe, 2:05 PM, 28 Dec',
        price: '₹ 132',
    },
    {
        title: 'HSR, BLR → Home',
        description: 'Pro Cab, 8:00 AM, 28 Dec',
        price: '₹ 450',
    },
    {
        title: 'HSR, BLR → Pub',
        description: 'EV Classic, 12:45 PM, 28 Dec',
        price: '₹ 80',
    },
    {
        title: 'HSR, BLR → Beach',
        description: 'EV Prime, 11:55 PM, 28 Dec',
        price: '₹ 850',
    },
    {
        title: 'HSR, BLR → Library',
        description: 'EV Classic, 10:20 AM, 28 Dec',
        price: '₹ 65',
    },
];


const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 0,
    },
    h1: {
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: "#fff",
        marginBottom: 0,
    },
    h2: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        marginTop: -5,
        color: "#B9B9B9",
    },
    listItem: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
    },
})
