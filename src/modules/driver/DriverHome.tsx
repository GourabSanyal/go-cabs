import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ClassicRide from '../../../assets/images/icons/classic-ride.svg';
import LogisticsIcon from '../../../assets/images/icons/logistic.svg';
import RentalCar from '../../../assets/images/icons/rental-car.svg';
import AirportIcon from '../../../assets/images/icons/airport.svg';
import EventIcon from '../../../assets/images/icons/event.svg';
import PrimeRide from '../../../assets/images/icons/prime-ride.svg';
import UpcomingRides from './components/UpcomingRides';
import DullDivider from '../../components/DullDivider';
import PushAlerts from './components/PushAlert';
import { useNavigation } from '@react-navigation/native';

const DriverHome = () => {
    const navigation = useNavigation()
    return (
        <>
            <UpcomingRides />
            <DullDivider />
            <View style={styles.container}>
                <View style={styles.serviceContainer}>
                    {serviceData?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.containerGradient}
                                onPress={() => navigation.navigate('BookingRoutes', { screen: 'UpcomingRideInfo' })}
                            >
                                <LinearGradient
                                    colors={['#005935', '#00BF72',]}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 0 }}
                                    style={styles.cardGradient}
                                >
                                    {item.icon}
                                    <Text style={styles.h4}>
                                        {item.title}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
            <PushAlerts />
        </>
    );
};

export default DriverHome;


const serviceData = [
    {
        title: <>Classic {'\n'}  Ride</>,
        icon: <ClassicRide width={50} height={50} />,
        path: "MatchedDrivers"
    },
    {
        title: `Logistics Services`,
        icon: <LogisticsIcon width={50} height={50} />,
        path: "Logistics"
    },
    {
        title: `Rental Services`,
        icon: <RentalCar width={50} height={50} />,
        path: "Service"
    },
    {
        title: `Airport Services`,
        icon: <AirportIcon width={50} height={50} />,
        path: "AirportService"
    },
    {
        title: `Prime Services`,
        icon: <PrimeRide width={50} height={50} />,
        path: "Service"
    },
    {
        title: `Event Services`,
        icon: <EventIcon width={50} height={50} />,
        path: "EventService"
    },
]

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    heading: {
        color: '#fff', fontSize: 25, textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
    },
    containerGradient: {
        borderRadius: 8,
        borderWidth: 1,
        width: '28.5%',
        // justifyContent: 'space-between',
    },
    cardGradient: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
        alignItems: 'center',
        gap: 10,
    },
    h4: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    serviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
    }
});


