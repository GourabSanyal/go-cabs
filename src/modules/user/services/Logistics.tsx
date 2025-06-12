import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import DropIcon from '../../../../assets/images/icons/drop.svg';
import PickupIcon from '../../../../assets/images/icons/pickup.svg';
import Margin from '../../../components/Margin';
import Chip from '../../../components/Chip';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../../components/CustomButton';
import BackButton from '../../profile/common/BackButton';
import { Input } from '@ui-kitten/components';
import { backgroundPrimary } from '../../../theme/colors';

const Logistics = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Logistics
            </Text>
            <Text style={styles.h3}>
                With GO Cabs its easy to shift your logistics from anywhere to everywhere
            </Text>
            <Margin margin={30} />
            <Chip label="What to do?" />
            <Margin margin={30} />
            <View style={styles.serviceContainer}>
                {serviceData?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            // onPress={() => setSelected(index + 1)}
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
            <View style={{ gap: 15 }}>
                <Input
                    style={styles.input}
                    placeholder="Enter Item Details"
                    placeholderTextColor="#fff"
                    size="large"
                />
                <Input
                    style={styles.input}
                    placeholder="Pickup Location"
                    placeholderTextColor="#fff"
                    size="large"
                />
                <Input
                    style={styles.input}
                    placeholder="Drop Location"
                    placeholderTextColor="#fff"
                    size="large"
                />
                <Input
                    style={styles.input}
                    placeholder="Additional Details"
                    placeholderTextColor="#fff"
                    size="large"
                />
            </View>
            <View style={{ flexGrow: 1 }} />
            <Margin margin={30} />
            <CustomButton
                title="Continue"
                size="medium"
                status="primary"
            // disabled={selected ? false : true}
            />
            <Margin margin={20} />
            <BackButton />
        </View>
    );
};

export default Logistics;


const serviceData = [
    {
        title: "Pickup",
        icon: <DropIcon width={30} height={30} />,
    },
    {
        title: "Drop",
        icon: <PickupIcon width={30} height={30} />,
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
    input: {
        backgroundColor: backgroundPrimary,
        borderWidth: 1,
        borderColor: '#fff'
    },
    serviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
    },
    containerGradient: {
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
    },
    cardGradient: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        gap: 10,
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


