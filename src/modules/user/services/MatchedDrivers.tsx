import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Margin from '../../../components/Margin';
import Chip from '../../../components/Chip';
import CarIcon from '../../../../assets/images/icons/car.svg';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../profile/common/BackButton';
import CustomButton from '../../../components/CustomButton';

const MatchedDrivers = () => {
    const [selected, setSelected] = React.useState(0);
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Matched Drives</Text>
            <Text style={styles.h3}>
                Choose from the range of available ride options, according to your flexibility, with GO CABS
            </Text>
            <Margin margin={30} />
            <Chip label="EV Rides" />
            <Margin margin={30} />
            <View style={styles.serviceContainer}>
                {serviceData?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => setSelected(index + 1)}
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
                                    EV {item.title}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <Margin margin={30} />
            <Chip label="Non - EV Rides" />
            <Margin margin={30} />
            <View style={styles.serviceContainer}>
                {serviceData?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => setSelected(index + 1)}
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
            <View style={{ flexGrow: 1 }} />
            <Margin margin={30} />
            <CustomButton
                title="Continue booking"
                size="medium"
                status="primary"
                disabled={selected ? false : true}
            />
            <Margin margin={20} />
            <BackButton />
        </View>
    );
};

export default MatchedDrivers;

const serviceData = [
    {
        title: "Classsic",
        icon: <CarIcon width={50} height={50} />,
    },
    {
        title: "Prime",
        icon: <CarIcon width={50} height={50} />,
    },
    {
        title: "Pro",
        icon: <CarIcon width={50} height={50} />,
    },
    {
        title: "Deluxe",
        icon: <CarIcon width={50} height={50} />,
    },
]

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 20,
        flex: 1,
    },
    heading: {
        color: '#fff', fontSize: 25, textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
    },
    serviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        flexWrap: 'wrap',
    },
    containerGradient: {
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
    },
    cardGradient: {
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        gap: 5,
        width: '100%',
    },
    h4: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    h3: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: '#fff',
        textAlign: 'center',
    },
});


