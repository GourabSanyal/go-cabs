import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MatchedIcon from '../../../assets/images/icons/service1.svg';
import LogisticsIcon from '../../../assets/images/icons/logistic.svg';
import PurchasesIcon from '../../../assets/images/icons/inapp-purchase.svg';
import AirportIcon from '../../../assets/images/icons/airport.svg';
import EventIcon from '../../../assets/images/icons/event.svg';
import ExploreIcon from '../../../assets/images/icons/explore-more.svg';
import ReviewCard from '../../components/ReviewCard';
import Margin from '../../components/Margin';
import SuggestionInput from '../../components/SuggestionInput';
import { useNavigation } from '@react-navigation/native';

const Service = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Our Services</Text>
            <View style={styles.serviceContainer}>
                {serviceData?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate(item.path as never)}
                            key={index}
                            style={styles.containerGradient}
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
            <Margin margin={30} />
            <ReviewCard />
            <Margin margin={30} />
            <SuggestionInput />
            <Margin margin={30} />
        </View>
    );
};

export default Service;




const serviceData = [
    {
        title: "Matched Drives",
        icon: <MatchedIcon width={40} height={40} />,
        path: "MatchedDrivers"
    },
    {
        title: `Logistics Services`,
        icon: <LogisticsIcon width={40} height={40} />,
        path: "Logistics"
    },
    {
        title: `In-app Purchases`,
        icon: <PurchasesIcon width={40} height={40} />,
        path: "Service"
    },
    {
        title: `Airport Services`,
        icon: <AirportIcon width={40} height={40} />,
        path: "AirportService"
    },
    {
        title: `Event Services`,
        icon: <EventIcon width={40} height={40} />,
        path: "EventService"
    },
    {
        title: `Explore More`,
        icon: <ExploreIcon width={40} height={40} />,
        path: "Service"
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
        width: 95,
        // justifyContent: 'space-between',
    },
    cardGradient: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingVertical: 10,
        alignItems: 'center',
        gap: 10,
    },
    h4: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    serviceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 20,
    }
});


